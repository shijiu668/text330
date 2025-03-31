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
      </div>
    </main>
  );
}
