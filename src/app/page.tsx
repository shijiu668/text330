'use client';

import { useState } from 'react';
import Image from 'next/image';

export default function Home() {
  const [prompt, setPrompt] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [style, setStyle] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setImageUrl('');

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, style }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate image');
      }

      setImageUrl(data.data[0].url);
    } catch (error: unknown) {
      console.error('Image generation error:', error);
      setError(error instanceof Error ? error.message : 'An error occurred while generating the image');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!imageUrl) return;
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `generated-image-${Date.now()}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch {
      setError('Error downloading the image');
    }
  };

  return (
    <main className="min-h-screen p-8 bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-white mb-8">
          AI Image Generator
        </h1>
        
        <form onSubmit={handleSubmit} className="mb-8">
          <div className="flex gap-4">
            <div className="flex-1 flex gap-4">
              <input
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe the image you want to generate..."
                className="flex-1 p-4 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <select
                value={style}
                onChange={(e) => setStyle(e.target.value)}
                className="p-4 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">no style</option>
                <option value="vivid">vivid</option>
                <option value="natural">natural</option>
              </select>
            </div>
            <button
              type="submit"
              disabled={loading}
              className={`px-8 py-4 rounded-lg font-semibold text-white transition-colors ${loading ? 'bg-gray-600 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
            >
              {loading ? 'Generating...' : 'Generate Image'}
            </button>
          </div>
        </form>

        {error && (
          <div className="p-4 mb-8 rounded-lg bg-red-500/10 text-red-500 text-center">
            {error}
          </div>
        )}

        {imageUrl && (
          <div className="bg-gray-700 rounded-lg p-4">
            <div className="relative w-full h-[512px] mb-4">
              <Image
                src={imageUrl}
                alt="Generated Image"
                fill
                unoptimized
                className="rounded-lg object-contain"
              />
            </div>
            <button
              onClick={handleDownload}
              className="w-full py-3 rounded-lg bg-green-600 hover:bg-green-700 text-white font-semibold transition-colors"
            >
              Download Image
            </button>
          </div>
        )}

        {loading && (
          <div className="flex items-center justify-center p-12">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
          <div className="bg-gradient-to-br from-purple-600/10 to-blue-600/10 p-8 rounded-2xl backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center mb-6">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-4">AI Image Generation Advantages</h3>
            <p className="text-gray-300">Leverage advanced AI technology to quickly generate high-quality images. Create stunning visual works without professional design skills.</p>
          </div>

          <div className="bg-gradient-to-br from-pink-600/10 to-purple-600/10 p-8 rounded-2xl backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all">
            <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-500 rounded-lg flex items-center justify-center mb-6">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-4">Creative Inspiration</h3>
            <p className="text-gray-300">Break through creative blocks and gain unlimited inspiration. Let our AI assistant help you explore new visual possibilities and unlock your creative potential.</p>
          </div>

          <div className="bg-gradient-to-br from-blue-600/10 to-green-600/10 p-8 rounded-2xl backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-green-500 rounded-lg flex items-center justify-center mb-6">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-4">Business Applications</h3>
            <p className="text-gray-300">Efficient image generation solutions for brand marketing, product showcases, social media, and various business scenarios.</p>
          </div>
        </div>
        <div className="mt-24 space-y-16">
          <section>
            <h2 className="text-3xl font-bold text-white mb-8">How to Use</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-gradient-to-br from-indigo-600/10 to-purple-600/10 p-8 rounded-2xl backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all">
                <h3 className="text-xl font-semibold text-white mb-4">Enter Description</h3>
                <p className="text-gray-300">Describe your desired image in detail, including specific requirements for scene, style, colors, and other elements.</p>
              </div>
              <div className="bg-gradient-to-br from-purple-600/10 to-pink-600/10 p-8 rounded-2xl backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all">
                <h3 className="text-xl font-semibold text-white mb-4">Choose Style</h3>
                <p className="text-gray-300">Select your preferred image style from the dropdown menu - choose between natural realistic or vivid styles to meet different creative needs.</p>
              </div>
              <div className="bg-gradient-to-br from-pink-600/10 to-red-600/10 p-8 rounded-2xl backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all">
                <h3 className="text-xl font-semibold text-white mb-4">One-Click Generation</h3>
                <p className="text-gray-300">Click the generate button, and AI will quickly create unique image artwork based on your description, with download support.</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-3xl font-bold text-white mb-8">Generation Results</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-gradient-to-br from-orange-600/10 to-yellow-600/10 p-8 rounded-2xl backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all">
                <h3 className="text-xl font-semibold text-white mb-4">High Definition Quality</h3>
                <p className="text-gray-300">Generated images boast a resolution of 1024x1024 pixels, with crisp details and rich colors, suitable for various use cases.</p>
              </div>
              <div className="bg-gradient-to-br from-yellow-600/10 to-green-600/10 p-8 rounded-2xl backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all">
                <h3 className="text-xl font-semibold text-white mb-4">Diverse Styles</h3>
                <p className="text-gray-300">Support for multiple artistic styles, from realistic to abstract, classical to modern, meeting various creative requirements.</p>
              </div>
              <div className="bg-gradient-to-br from-green-600/10 to-teal-600/10 p-8 rounded-2xl backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all">
                <h3 className="text-xl font-semibold text-white mb-4">Rapid Generation</h3>
                <p className="text-gray-300">Powerful AI engine ensures swift image generation, turning your creative ideas into reality quickly.</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-3xl font-bold text-white mb-8">Why Choose Us</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-gradient-to-br from-teal-600/10 to-cyan-600/10 p-8 rounded-2xl backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all">
                <h3 className="text-xl font-semibold text-white mb-4">Leading Technology</h3>
                <p className="text-gray-300">Utilizing the latest DALL-E 3 model to ensure consistently superior image quality and creativity.</p>
              </div>
              <div className="bg-gradient-to-br from-cyan-600/10 to-blue-600/10 p-8 rounded-2xl backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all">
                <h3 className="text-xl font-semibold text-white mb-4">User-Friendly</h3>
                <p className="text-gray-300">Intuitive interface design allows everyone to create professional-quality images without complex operations.</p>
              </div>
              <div className="bg-gradient-to-br from-blue-600/10 to-indigo-600/10 p-8 rounded-2xl backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all">
                <h3 className="text-xl font-semibold text-white mb-4">Continuous Innovation</h3>
                <p className="text-gray-300">We constantly optimize our algorithms and user experience to provide better creative tools and service support.</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
