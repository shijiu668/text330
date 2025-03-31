import { NextRequest } from 'next/server';
import OpenAI from 'openai';

export const runtime = 'edge';

const client = new OpenAI({
  baseURL: 'https://xiaoai.plus/v1',
  apiKey: 'sk-KVkxFwriPzRegQYNSiRMwQzQLwAdjAkh4zg4dCp7u1lxJPuV',
});

export async function POST(req: NextRequest) {
  try {
    const { prompt, style } = await req.json();

    // 添加请求参数日志
    console.log('Received request parameters:', {
      prompt,
      style,
      timestamp: new Date().toISOString(),
    });

    if (!prompt) {
      return new Response(JSON.stringify({ error: 'Please provide an image description' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const response = await client.images.generate({
      model: 'dall-e-3',
      prompt,
      n: 1,
      size: '1024x1024',
      style: style || undefined,
    });

    // 添加响应日志
    console.log('API Response:', {
      success: true,
      imageUrl: response.data[0]?.url,
      timestamp: new Date().toISOString(),
    });

    return new Response(JSON.stringify(response), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    // 添加错误日志
    console.error('Error details:', {
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
    });

    return new Response(
      JSON.stringify({ error: 'An error occurred while generating the image' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}