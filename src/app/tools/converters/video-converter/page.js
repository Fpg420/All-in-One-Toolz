// src/app/tools/converters/video-converter/page.js
import dynamic from "next/dynamic";
import React from "react";

const VideoConverter = dynamic(() => import("./VideoConverterClient"), {
  ssr: false,
});

export default function VideoConverterPage() {
  return (
    <main>
      <h1>Video Converter page</h1>
      <VideoConverter />
    </main>
  );
}
