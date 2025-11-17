// /tools/converters/video-converter/page.js
import dynamic from "next/dynamic";

export default function VideoConverterPage() {
  const VideoConverter = dynamic(
    () => import("./VideoConverterClient"),
    { ssr: false } // THIS IS CRUCIAL
  );

  return <VideoConverter />;
}
