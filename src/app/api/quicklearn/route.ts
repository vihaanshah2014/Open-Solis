import { OpenAIApi, Configuration } from "openai-edge";
import { OpenAIStream, StreamingTextResponse } from "ai";

// /api/quicklearn
const config = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(config);

export async function POST(req: Request) {
    const { prompt, sysPrompt } = await req.json();

    const response = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [
            {
                role: "system",
                content: `You are an AI that listens to instructions and does as said. Output the following using different visual queues to ephasise key points, feel free to include: code blocks, bolding,and italics, in the following ${sysPrompt}`
            },
            {
                role: "user",
                content: `User: ${prompt}`
            },
        ],
        stream: true,
    });

    const stream = OpenAIStream(response);
    return new StreamingTextResponse(stream);
}