// src/app/tools/converters/video-converter/page.js
import dynamic from "next/dynamic";

export default function VideoConverterPage() {
  const VideoConverter = dynamic(
    () => import("./VideoConverterClient"), // load client-only component
    { ssr: false } // CRUCIAL: disables server-side rendering
  );

  return <VideoConverter />;
}
