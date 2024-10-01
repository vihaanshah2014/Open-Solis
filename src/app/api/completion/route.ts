import { OpenAIApi, Configuration } from "openai-edge";
import { OpenAIStream, StreamingTextResponse } from "ai";

const config = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(config);

export async function POST(req: Request) {
  const { prompt } = await req.json();

  const response = await openai.createChatCompletion({
    model: "gpt-4-turbo-preview",
    messages: [
      {
        role: "system",
        content: `You are a concise AI assistant integrated into a note-taking app. Your role is to add to the user's notes with brief, relevant content. Follow these guidelines:
        1. Keep responses short, ideally 1-2 sentences or 50 words maximum.
        2. Maintain the original tone and style of the note.
        3. Use HTML tags for formatting when necessary (e.g., <b>, <i>. DO NOT USE <ul>, <li>).
        4. Focus on completing thoughts or adding relevant details.
        5. Avoid introducing new, unrelated topics.
        6. Do not use markdown formatting.`
      },
      {
        role: "user",
        content: `Complete this note: "${prompt}"`
      },
    ],
    max_tokens: 100,
    temperature: 0.7,
    stream: true,
  });

  const stream = OpenAIStream(response);
  return new StreamingTextResponse(stream);
}