// src/app/tools/converters/video-converter/page.js
"use client";

import dynamic from "next/dynamic";
import React from "react";

const VideoConverter = dynamic(() => import("./VideoConverterClient"), {
  ssr: false,
});

export default function VideoConverterPage() {
  return (
    <main>
      <h1>Video Converter page (client)</h1>
      <VideoConverter />
    </main>
  );
}
