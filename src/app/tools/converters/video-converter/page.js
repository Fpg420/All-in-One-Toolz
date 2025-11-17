// /tools/converters/video-converter/page.js
"use client";
import dynamic from "next/dynamic";

export default function VideoConverterPage() {
  const VideoConverter = dynamic(() => import("./VideoConverterClient"), {
    ssr: false, // <-- important: disables server-side rendering
  });

  return <VideoConverter />;
}
