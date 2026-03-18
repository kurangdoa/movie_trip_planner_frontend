"use client";

import { useState } from "react";

// 1. We split the interface. One for the overall movie, one for the individual properties.
interface PropertyMatch {
  vibe_score: number;
  explanation: string;
  listing_url: string;
  picture_url?: string;
}

interface VibeResult {
  movie_title: string;
  movie_poster?: string;
  movie_overview?: string;
  movie_url?: string; 
  user_prompt?: string;
  matches: PropertyMatch[]; // Now expecting an array of up to 3 properties!
}

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<VibeResult | null>(null);
  const [error, setError] = useState("");
  const [city, setCity] = useState("Amsterdam");

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const response = await fetch(`${API_URL}/api/recommend`, {
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
    <main className="min-h-screen bg-gray-900 text-white p-4 md:p-10 flex flex-col items-center w-full">
      
      {/* HEADER SECTION */}
      <div className="w-full flex flex-col items-center mb-8">
        <h1 className="text-3xl md:text-5xl font-bold mb-4 text-blue-400 text-center w-full leading-tight">
          Movie x Airbnb <br className="block md:hidden" /> Vibe Matcher 🍿✈️
        </h1>
        <p className="text-lg md:text-2xl font-bold text-blue-200 text-center max-w-xl">
          We match the vibe of your favorite movie to your Airbnb stay!
        </p>
      </div>

      {/* SEARCH FORM */}
      <form onSubmit={handleSearch} className="w-full max-w-3xl mb-8 flex flex-col md:flex-row gap-4">
        <select 
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="p-3 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white w-full md:w-48"
        >
          <option value="">Anywhere</option>
          <option value="Amsterdam">Amsterdam</option>
          <option value="London">London</option>
        </select>

        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="e.g. Medieval feeling of Game of Thrones."
          className="flex-1 w-full p-3 bg-gray-800 rounded-lg text-white ring-2 ring-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-semibold transition disabled:opacity-50"
        >
          {loading ? "Searching..." : "Search"}
        </button>
      </form>

      {error && <p className="text-red-400 mb-4">{error}</p>}

      {/* RESULTS DISPLAY - MULTIPLE PROPERTIES */}
      {result && (
        <div className="w-full max-w-6xl animate-in fade-in slide-in-from-bottom-4 duration-500 flex flex-col items-center">
          
          {/* THE MOVIE (VIBE SOURCE) */}
          <div className="bg-gray-800 rounded-2xl w-full max-w-3xl border border-gray-700 shadow-2xl overflow-hidden mb-8 flex flex-col md:flex-row items-stretch">
            {/* Poster Left Side */}
            {result.movie_poster && (
              <div className="w-full md:w-1/3 h-64 md:h-auto shrink-0 relative">
                <img 
                  src={result.movie_poster} 
                  alt={result.movie_title}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>
            )}
            
            {/* Text Right Side */}
            <div className="p-6 md:p-8 md:w-2/3 flex flex-col justify-center text-center md:text-left">
              <p className="text-sm text-blue-400 font-bold uppercase tracking-widest mb-1">
                The Cinematic Vibe
              </p>
              <h2 className="text-3xl font-black text-white leading-tight mb-4">
                {result.movie_title}
              </h2>
              
              {/* 🟢 NEW: Overview Text */}
              {result.movie_overview && (
                <p className="text-gray-300 text-sm md:text-base leading-relaxed line-clamp-4 md:line-clamp-none mb-6">
                  {result.movie_overview}
                </p>
              )}

              {/* 🟢 NEW: TMDB Link */}
              {result.movie_url && (
                <div className="mt-auto">
                  <a 
                    href={result.movie_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm font-bold text-blue-400 hover:text-blue-300 transition-colors bg-blue-900/20 px-4 py-2 rounded-full border border-blue-800/50 hover:border-blue-500/50 w-fit"
                  >
                    View on TMDB <span className="text-lg leading-none">↗</span>
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* THE PROPERTIES (VIBE MATCHES) */}
          <h3 className="text-2xl font-bold text-gray-200 mb-6 w-full text-center md:text-center">
            Top {result.matches.length} Recommended Stays 🏨
          </h3>
          
          <div className={`w-full gap-6 ${
            result.matches.length === 1 
              ? "flex justify-center" 
              : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
          }`}>
            {result.matches.map((property, index) => (
              <div 
                key={index} 
                className={`bg-gray-800 rounded-2xl border border-gray-700 shadow-xl overflow-hidden flex flex-col ${
                  result.matches.length === 1 ? "w-full max-w-md" : ""
                }`}
              >
                
                {/* Airbnb Photo */}
                <div className="h-48 relative border-b border-gray-700 bg-gray-900">
                  {property.picture_url ? (
                    <img 
                      src={property.picture_url} 
                      alt="Airbnb Listing"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-500 text-sm">
                      No Image
                    </div>
                  )}
                  {/* Floating Rank Badge (#1, #2, #3) */}
                  <div className="absolute top-3 left-3 bg-black/80 backdrop-blur-sm font-black px-3 py-1 rounded text-white shadow-lg border border-gray-600">
                    #{index + 1}
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-5 flex flex-col flex-1 gap-4">
                  {/* Score */}
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 font-bold text-sm uppercase tracking-wider">Vibe Score</span>
                    <span className="text-xl font-black text-green-400 bg-green-900/30 border border-green-500/50 px-3 py-1 rounded-lg">
                      {property.vibe_score}/100
                    </span>
                  </div>

                  {/* Explanation */}
                  <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-700/50 flex-1">
                    <p className="text-gray-300 text-sm leading-relaxed">
                      {property.explanation}
                    </p>
                  </div>

                  {/* Action Button */}
                  <a
                    href={property.listing_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-lg text-center transition-all shadow-[0_0_15px_rgba(37,99,235,0.2)] mt-auto"
                  >
                    View on Airbnb ✈️
                  </a>
                </div>
              </div>
            ))}
          </div>

        </div>
      )}

    </main>
  );
}