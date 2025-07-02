'use client';

import { Particles } from "@tsparticles/react";
import { type ISourceOptions } from "@tsparticles/engine";

const options: ISourceOptions = {
  fullScreen: { enable: true, zIndex: -1 },
  background: { color: { value: "transparent" } },
  particles: {
    number: { value: 50 },
    color: { value: "#8b5cf6" },
    shape: { type: "circle" },
    opacity: { value: 0.4 },
    size: { value: 3 },
    move: {
      enable: true,
      speed: 1,
      direction: "none",
      outModes: { default: "out" },
    },
  },
  interactivity: {
    events: {
      onHover: { enable: true, mode: "repulse" },
      resize: { enable: true },
    },
    modes: {
      repulse: { distance: 100 },
    },
  },
  detectRetina: true,
};

export default function FloatingParticles() {
  return <Particles id="tsparticles" options={options} />;
}
