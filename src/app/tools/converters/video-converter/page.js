import dynamic from "next/dynamic";

export default function VideoConverterPage() {
  const VideoConverter = dynamic(
    () => import("./VideoConverterClient"),
    { ssr: false }
  );

  return <VideoConverter />;
}
