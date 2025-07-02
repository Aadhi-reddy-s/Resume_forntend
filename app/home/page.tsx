"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import FloatingParticles from "@/app/components/animations/FloatingParticles";
import React from "react";

type SkillExperienceEducation =
  | string
  | {
      title?: string;
      institution?: string;
      degree?: string;
      graduation_year?: string;
    };

type ResumeAnalysis = {
  name: string;
  skills: SkillExperienceEducation[];
  experience: SkillExperienceEducation[];
  education: SkillExperienceEducation[];
  score: number;
  verdict: string;
  suggestions: string;
};

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [jobRole, setJobRole] = useState("");
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<ResumeAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [editProfile, setEditProfile] = useState(false);
  const [editableUsername, setEditableUsername] = useState("");
  const [editableEmail, setEditableEmail] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [phone, setPhone] = useState<string>("");
  const [linkedin, setLinkedin] = useState<string>("");
  const [selectedSampleResume, setSelectedSampleResume] = useState<string | null>(null);

  const router = useRouter();
  const summaryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loggedIn = localStorage.getItem("loggedIn");
    const storedUsername = localStorage.getItem("username");
    const storedEmail = localStorage.getItem("email");
    const storedPhone = localStorage.getItem("phone") || "";
    const storedLinkedin = localStorage.getItem("linkedin") || "";

    if (loggedIn !== "true") {
      router.push("/login");
    } else {
      setUsername(storedUsername);
      setEmail(storedEmail || `${storedUsername?.toLowerCase()}@example.com`);
      setPhone(storedPhone);
      setLinkedin(storedLinkedin);
    }
  }, [router]);

  const handleSaveProfile = () => {
    localStorage.setItem("username", editableUsername);
    localStorage.setItem("email", editableEmail);
    localStorage.setItem("phone", phone);
    localStorage.setItem("linkedin", linkedin);
    setUsername(editableUsername);
    setEmail(editableEmail);
    setEditProfile(false);
    setSidebarOpen(false);
  };

  const handleUpload = async () => {
    if (!file || !jobRole.trim()) {
      setError("Please upload a resume and enter a job role.");
      return;
    }

    const formData = new FormData();
    formData.append("resume", file);
    formData.append("jobRole", jobRole.trim());

    setLoading(true);
    setError(null);
    setAnalysis(null);

    try {
      const res = await fetch("http://localhost:5000/analyze", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (data.success) {
        setAnalysis(data.analysis);
        saveAnalysisToHistory(data.analysis, jobRole.trim());
      } else {
        setError("Failed to analyze resume.");
      }
    } catch {
      setError("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const saveAnalysisToHistory = (analysis: ResumeAnalysis, role: string) => {
    const history = JSON.parse(localStorage.getItem("resumeAnalysisHistory") || "[]");
    const newRecord = {
      name: analysis.name,
      score: analysis.score,
      role,
      time: new Date().toISOString(),
    };
    const updatedHistory = [newRecord, ...history].slice(0, 10);
    localStorage.setItem("resumeAnalysisHistory", JSON.stringify(updatedHistory));
  };

  const renderItem = (item: SkillExperienceEducation) => {
    if (typeof item === "string") return item;
    if (item.title) return item.title;
    const institution = item.institution || "";
    const degree = item.degree || "";
    const graduation = item.graduation_year || "";
    return `${degree} at ${institution}${graduation ? ` (Graduation: ${graduation})` : ""}`;
  };

  const handleDownload = () => {
    if (!analysis) return;
    const summary = `
Name: ${analysis.name}
Skills: ${analysis.skills.map(renderItem).join(", ")}
Experience: ${analysis.experience.map(renderItem).join(", ")}
Education: ${analysis.education.map(renderItem).join(", ")}
Score: ${analysis.score}
Verdict: ${analysis.verdict}
Suggestions: ${analysis.suggestions}
    `.trim();

    const blob = new Blob([summary], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "resume_summary.txt";
    link.click();
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    if (analysis && summaryRef.current) {
      summaryRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [analysis]);

  const handleModelResumeChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedPath = e.target.value;
    if (!selectedPath) return;

    try {
      const res = await fetch(selectedPath);
      const blob = await res.blob();
      const modelFile = new File([blob], selectedPath.split("/").pop() || "model.pdf", {
        type: "application/pdf",
      });
      setFile(modelFile);
    } catch (err) {
      console.error("Failed to load model resume:", err);
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen p-6 bg-gray-50 text-gray-800 relative">
     {/* Background Video */}
<video className="fixed top-0 left-0 w-screen h-screen object-cover" autoPlay loop muted>
  <source src="/background.mp4" type="video/mp4" />
  Your browser does not support the video tag.
</video>

      <FloatingParticles />

      {/* Profile Sidebar Trigger */}
      <div className="absolute top-4 left-4 z-10">
        <button
          onClick={() => setSidebarOpen(true)}
          className="bg-white border border-gray-300 rounded-full p-2 shadow hover:bg-gray-100"
        >
          👤
        </button>
      </div>

      {/* Top-right Username */}
<div className="absolute top-4 right-4 text-lg font-semibold text-gray-800 z-10 flex items-center space-x-1">
  {username && (
    <>
      <span role="img" aria-label="waving hand">👋</span>
      <span>Welcome,</span>
      <span className="font-bold text-blue-600">{username}</span>
    </>
  )}
</div>


      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-80 bg-white border-r border-gray-200 shadow-lg p-4 transform transition-transform duration-300 z-50 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">👤 Profile Details</h2>
          <button onClick={() => setSidebarOpen(false)} className="text-xl font-bold">×</button>
        </div>

        {editProfile ? (
          <>
            <label className="text-sm">Name</label>
            <input
              className="border w-full px-2 py-1 mb-2 rounded"
              value={editableUsername}
              onChange={(e) => setEditableUsername(e.target.value)}
            />
            <label className="text-sm">Email</label>
            <input
              className="border w-full px-2 py-1 mb-2 rounded"
              value={editableEmail}
              onChange={(e) => setEditableEmail(e.target.value)}
            />
            <label className="text-sm">Phone</label>
            <input
              className="border w-full px-2 py-1 mb-2 rounded"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            <label className="text-sm">LinkedIn</label>
            <input
              className="border w-full px-2 py-1 mb-2 rounded"
              value={linkedin}
              onChange={(e) => setLinkedin(e.target.value)}
            />
            <button onClick={handleSaveProfile} className="mt-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full">
              Save
            </button>
            <button onClick={() => setEditProfile(false)} className="mt-2 bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500 w-full">
              Cancel
            </button>
          </>
        ) : (
          <>
            <p><strong>Name:</strong> {username}</p>
            <p><strong>Email:</strong> {email}</p>
            {phone && <p><strong>Phone:</strong> {phone}</p>}
            {linkedin && <p><strong>LinkedIn:</strong> {linkedin}</p>}
            <button onClick={() => {
              setEditProfile(true);
              setEditableUsername(username || "");
              setEditableEmail(email || "");
            }} className="mt-4 bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 w-full">
              ✏️ Edit Profile
            </button>
          </>
        )}
        <button onClick={() => {
          localStorage.clear();
          router.push("/login");
        }} className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 w-full">
          Logout
        </button>
      </div>

     {/* Title */}
<h1 className="text-4xl font-extrabold text-center text-blue-700 mb-8 z-10">
    📄 AI Resume Analyzer
</h1>


      {/* Upload Section */}
      <input
        type="file"
        accept="application/pdf"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
        className="border border-gray-300 rounded p-2 w-full max-w-md z-10"
      />
      {file && (
        <p className="text-sm text-gray-600 mt-1 max-w-md truncate text-center z-10">
          Uploaded File: <span className="font-medium">{file.name}</span>
        </p>
      )}

      <select
        onChange={handleModelResumeChange}
        className="mt-2 border border-gray-300 rounded p-2 w-full max-w-md z-10"
        defaultValue=""
      >
        <option value="" disabled>Select a model resume</option>
        <option value="/model-resumes/software-engineer.pdf">Software Engineer</option>
        <option value="/model-resumes/product-manager.pdf">Product Manager</option>
        <option value="/model-resumes/data-analyst.pdf">Data Analyst</option>
      </select>

      <input
        type="text"
        placeholder="Enter target job role"
        value={jobRole}
        onChange={(e) => setJobRole(e.target.value)}
        className="mt-4 border border-gray-300 rounded p-2 w-full max-w-md z-10"
      />

      <button
        onClick={handleUpload}
        disabled={!file || loading}
        className="mt-4 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50 z-10"
      >
        {loading ? "Analyzing..." : "Upload & Analyze"}
      </button>

      {error && (
        <div className="mt-6 p-4 bg-red-100 text-red-700 rounded max-w-md w-full text-center z-10">
          {error}
        </div>
      )}

      {analysis && (
        <div ref={summaryRef} className="mt-8 p-6 bg-white rounded shadow max-w-2xl w-full z-10">
          <h2 className="text-xl font-semibold mb-4">📊 Resume Analysis Result</h2>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mb-6">
            <div className="w-32 h-32">
              <CircularProgressbar
                value={analysis.score}
                text={`${analysis.score}%`}
                styles={buildStyles({
                  textSize: "18px",
                  pathColor: analysis.score >= 75 ? "#10b981" : analysis.score >= 50 ? "#f59e0b" : "#ef4444",
                  textColor: "#111827",
                  trailColor: "#e5e7eb",
                })}
              />
            </div>
            <div className="bg-gray-100 p-4 rounded-lg shadow w-full sm:w-auto">
              <p><strong>Name:</strong> {analysis.name}</p>
              <p><strong>Verdict:</strong> {analysis.verdict}</p>
              <p className="mt-2"><strong>Suggestions:</strong></p>
              <p className="text-sm text-gray-700 whitespace-pre-line">{analysis.suggestions}</p>
            </div>
          </div>

          <div className="mt-4">
            <h3 className="font-semibold text-lg">🛠 Skills</h3>
            <ul className="list-disc list-inside text-sm mt-1">
              {analysis.skills.map((s, idx) => (
                <li key={idx}>{renderItem(s)}</li>
              ))}
            </ul>
          </div>

          <div className="mt-4">
            <h3 className="font-semibold text-lg">💼 Experience</h3>
            <ul className="list-disc list-inside text-sm mt-1">
              {analysis.experience.map((e, idx) => (
                <li key={idx}>{renderItem(e)}</li>
              ))}
            </ul>
          </div>

          <div className="mt-4">
            <h3 className="font-semibold text-lg">🎓 Education</h3>
            <ul className="list-disc list-inside text-sm mt-1">
              {analysis.education.map((e, idx) => (
                <li key={idx}>{renderItem(e)}</li>
              ))}
            </ul>
          </div>

          <button
            onClick={handleDownload}
            className="mt-6 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Download Summary
          </button>
        </div>
      )}

      {/* === Sample Resumes Viewer Section === */}
      <div className="mt-12 w-full max-w-2xl z-10">
        <h2 className="text-xl font-semibold mb-4">📚 Sample Resumes</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { title: "Software Engineer", path: "/model-resumes/software-engineer.pdf" },
            { title: "Product Manager", path: "/model-resumes/product-manager.pdf" },
            { title: "Data Analyst", path: "/model-resumes/data-analyst.pdf" },
          ].map((resume) => (
            <button
              key={resume.path}
              onClick={() => setSelectedSampleResume(resume.path)}
              className="bg-white border border-gray-300 p-4 rounded shadow hover:bg-gray-100 text-center"
            >
              {resume.title}
            </button>
          ))}
        </div>
      </div>

      {/* Modal PDF Viewer */}
      {selectedSampleResume && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-white rounded shadow-lg w-[90%] h-[90%] relative">
            <button
              onClick={() => setSelectedSampleResume(null)}
              className="absolute top-2 right-2 text-xl font-bold text-gray-700 hover:text-red-500"
            >
              ×
            </button>
            <iframe
              src={selectedSampleResume}
              className="w-full h-full rounded-b"
              title="Sample Resume Preview"
            ></iframe>
          </div>
        </div>
      )}
    </div>
  );
}
