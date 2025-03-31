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
            <h3 className="text-xl font-semibold text-white mb-4">AI图片生成优势</h3>
            <p className="text-gray-300">利用先进的AI技术，快速生成高质量图片。无需专业设计技能，也能创作出令人惊叹的视觉作品。</p>
          </div>

          <div className="bg-gradient-to-br from-pink-600/10 to-purple-600/10 p-8 rounded-2xl backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all">
            <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-500 rounded-lg flex items-center justify-center mb-6">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-4">创意灵感激发</h3>
            <p className="text-gray-300">突破创意瓶颈，获得无限灵感。AI助手帮助你探索新的视觉可能，激发创作潜能。</p>
          </div>

          <div className="bg-gradient-to-br from-blue-600/10 to-green-600/10 p-8 rounded-2xl backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-green-500 rounded-lg flex items-center justify-center mb-6">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-4">商业应用场景</h3>
            <p className="text-gray-300">为品牌营销、产品展示、社交媒体等商业场景提供高效的图片生成解决方案。</p>
          </div>
        </div>
        <div className="mt-24 space-y-16">
          <section>
            <h2 className="text-3xl font-bold text-white mb-8">如何使用</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-gradient-to-br from-indigo-600/10 to-purple-600/10 p-8 rounded-2xl backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all">
                <h3 className="text-xl font-semibold text-white mb-4">输入描述</h3>
                <p className="text-gray-300">在输入框中详细描述您想要生成的图片内容，可以包含场景、风格、色彩等具体要求。</p>
              </div>
              <div className="bg-gradient-to-br from-purple-600/10 to-pink-600/10 p-8 rounded-2xl backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all">
                <h3 className="text-xl font-semibold text-white mb-4">选择风格</h3>
                <p className="text-gray-300">从下拉菜单中选择合适的图片风格，可以选择自然写实或鲜艳风格，满足不同创作需求。</p>
              </div>
              <div className="bg-gradient-to-br from-pink-600/10 to-red-600/10 p-8 rounded-2xl backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all">
                <h3 className="text-xl font-semibold text-white mb-4">一键生成</h3>
                <p className="text-gray-300">点击生成按钮，AI将根据您的描述快速创作出独特的图片作品，支持下载保存。</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-3xl font-bold text-white mb-8">生成效果</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-gradient-to-br from-orange-600/10 to-yellow-600/10 p-8 rounded-2xl backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all">
                <h3 className="text-xl font-semibold text-white mb-4">高清画质</h3>
                <p className="text-gray-300">生成的图片分辨率高达1024x1024像素，细节清晰，色彩饱满，适合各种使用场景。</p>
              </div>
              <div className="bg-gradient-to-br from-yellow-600/10 to-green-600/10 p-8 rounded-2xl backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all">
                <h3 className="text-xl font-semibold text-white mb-4">风格多样</h3>
                <p className="text-gray-300">支持多种艺术风格，从写实到抽象，从古典到现代，满足不同创作需求。</p>
              </div>
              <div className="bg-gradient-to-br from-green-600/10 to-teal-600/10 p-8 rounded-2xl backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all">
                <h3 className="text-xl font-semibold text-white mb-4">快速生成</h3>
                <p className="text-gray-300">强大的AI引擎确保图片生成速度，让您的创意灵感快速变为现实。</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-3xl font-bold text-white mb-8">为什么选择我们</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-gradient-to-br from-teal-600/10 to-cyan-600/10 p-8 rounded-2xl backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all">
                <h3 className="text-xl font-semibold text-white mb-4">技术领先</h3>
                <p className="text-gray-300">采用最新的DALL-E 3模型，确保生成图片的质量和创意性始终保持领先水平。</p>
              </div>
              <div className="bg-gradient-to-br from-cyan-600/10 to-blue-600/10 p-8 rounded-2xl backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all">
                <h3 className="text-xl font-semibold text-white mb-4">简单易用</h3>
                <p className="text-gray-300">直观的用户界面设计，无需复杂操作，人人都能轻松创作出专业级图片。</p>
              </div>
              <div className="bg-gradient-to-br from-blue-600/10 to-indigo-600/10 p-8 rounded-2xl backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all">
                <h3 className="text-xl font-semibold text-white mb-4">持续创新</h3>
                <p className="text-gray-300">我们不断优化算法和用户体验，为用户提供更好的创作工具和服务支持。</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
