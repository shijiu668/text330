import { NextRequest } from 'next/server';
import OpenAI from 'openai';

export const runtime = 'edge';

const client = new OpenAI({
  baseURL: 'https://xiaoai.plus/v1',
  apiKey: 'sk-KVkxFwriPzRegQYNSiRMwQzQLwAdjAkh4zg4dCp7u1lxJPuV',
});

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json();

    if (!prompt) {
      return new Response(JSON.stringify({ error: '请提供图片描述' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const response = await client.images.generate({
      model: 'dall-e-3',
      prompt,
      n: 1,
      size: '1024x1024',
    });

    return new Response(JSON.stringify(response), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('图片生成错误:', error);
    return new Response(
      JSON.stringify({ error: '生成图片时发生错误，请稍后重试' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}