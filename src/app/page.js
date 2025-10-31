// src/app/page.js
export default function Home() {
  return (
    <main className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-6">
      <h1 className="text-4xl font-bold mb-4 text-center">All n One Toolz</h1>
      <p className="text-lg text-gray-300 mb-8 text-center max-w-2xl">
        A free collection of online tools — calculators, converters, downloaders, and more!
      </p>
      <div className="flex flex-wrap justify-center gap-4">
        <a href="/tools/bmi-calculator" className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-lg">
          🧮 BMI Calculator
        </a>
        <a href="#" className="bg-green-600 hover:bg-green-700 text-white px-5 py-3 rounded-lg">
          🎬 YouTube Downloader (coming soon)
        </a>
        <a href="#" className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-3 rounded-lg">
          📂 File Converter (coming soon)
        </a>
      </div>

      <footer className="mt-16 text-gray-500 text-sm text-center">
        © {new Date().getFullYear()} All n One Toolz. Built with ❤️ using Next.js
      </footer>
    </main>
  );
}
