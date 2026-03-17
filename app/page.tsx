"use client"; // Tells Next.js this is an interactive client component

import { useState } from "react";

interface VibeResult {
  movie_title: string;
  vibe_score: number;
  explanation: string;
  listing_url: string;
  picture_url?: string;
}

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  //const [result, setResult] = useState<any>(null); // We'll use 'any' for now, or you can define the TypeScript interface!
  // <VibeResult | null> tells TypeScript it starts empty but will be this specific object
  const [result, setResult] = useState<VibeResult | null>(null);
  const [error, setError] = useState("");
  const [city, setCity] = useState("Amsterdam"); // Or "" for no default

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const response = await fetch(`${API_URL}/api/recommend`, {
      //const response = await fetch("http://localhost:8000/api/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: prompt, city: city }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch recommendation");
      }

      const data = await response.json();
      setResult(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-900 text-white p-10 flex flex-col items-center">
      <h1 className="text-4xl font-bold mb-4 text-blue-400 text-center">Movie x Hotel Vibe Matcher 🍿✈️</h1>
      <p className="text-2xl font-bold mb-8 text-blue-200 text-center">We match the vibe of your favorite movie to your holiday hotel!</p>

{/* SEARCH FORM */}
      <form onSubmit={handleSearch} className="w-full max-w-3xl mb-8 flex flex-col md:flex-row gap-4">
        
        {/* CITY DROPDOWN */}
        <select 
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="p-3 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white w-full md:w-48"
        >
          <option value="">Anywhere</option>
          <option value="Amsterdam">Amsterdam</option>
          <option value="Paris">Paris</option>
          <option value="London">London</option>
          <option value="Tokyo">Tokyo</option>
        </select>

        {/* TEXT INPUT */}
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="e.g. Medieval feeling of Game of Thrones."
          // ADDED: bg-gray-800 so the text-white is actually visible!
          // ADDED: w-full so it fills the space on mobile
          className="flex-1 w-full p-3 bg-gray-800 rounded-lg text-white ring-2 ring-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />

        {/* SUBMIT BUTTON */}
        <button
          type="submit"
          disabled={loading}
          // ADDED: w-full md:w-auto to look like a wide button on phones, but normal on desktop
          className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-semibold transition disabled:opacity-50"
        >
          {loading ? "Searching..." : "Search"}
        </button>
      </form>

      {/* ERROR MESSAGE */}
      {error && <p className="text-red-400 mb-4">{error}</p>}

{/* RESULTS DISPLAY */}
      {result && (
        <div className="bg-gray-800 rounded-2xl w-full max-w-2xl border border-gray-700 shadow-2xl overflow-hidden mt-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
          
          {/* IMAGE HEADER (Handles missing images gracefully) */}
          {result.picture_url ? (
            <img 
              src={result.picture_url} 
              alt={`Vibe match for ${result.movie_title}`}
              className="w-full h-64 object-cover border-b border-gray-700"
            />
          ) : (
            <div className="w-full h-48 bg-gradient-to-r from-gray-900 to-gray-800 flex items-center justify-center border-b border-gray-700">
              <span className="text-gray-500 text-lg">📸 Image not available</span>
            </div>
          )}

          {/* CARD BODY */}
          <div className="p-6 md:p-8 flex flex-col gap-6">
            
            {/* TITLE & SCORE ROW */}
            <div className="flex justify-between items-start gap-4">
              <div>
                <p className="text-sm text-blue-400 font-bold uppercase tracking-widest mb-1">
                  Perfect Match For
                </p>
                <h2 className="text-3xl font-black text-white leading-tight">
                  {result.movie_title}
                </h2>
              </div>
              
              {/* VIBE SCORE BADGE */}
              <div className="flex flex-col items-center justify-center bg-green-900/30 border border-green-500/50 rounded-xl p-3 min-w-[90px] shadow-inner">
                <span className="text-3xl font-black text-green-400">{result.vibe_score}</span>
                <span className="text-[10px] text-green-300 uppercase font-bold tracking-wider mt-1">Vibe Score</span>
              </div>
            </div>

            {/* EXPLANATION BOX */}
            <div className="bg-gray-900/50 rounded-xl p-5 border border-gray-700/50">
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Why it fits the vibe</h3>
              <p className="text-gray-200 leading-relaxed text-lg">
                {result.explanation}
              </p>
            </div>

            {/* ACTION BUTTON */}
            <a
              href={result.listing_url}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 px-6 rounded-xl text-center transition-all duration-200 shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:shadow-[0_0_30px_rgba(37,99,235,0.5)] flex items-center justify-center gap-2 text-lg"
            >
              <span>View on Airbnb</span>
              <span className="text-xl">✈️</span>
            </a>
          </div>
        </div>
      )}


    </main>
  );
}