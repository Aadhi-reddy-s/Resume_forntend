'use client';

export default function BackgroundEffects() {
  return (
    <div className="fixed top-0 left-0 w-full h-full -z-10 overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-[400px] h-[400px] bg-purple-500 opacity-20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-pink-500 opacity-20 rounded-full blur-3xl animate-pulse" />
    </div>
  );
}
