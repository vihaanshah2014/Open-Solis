import { OpenAIApi, Configuration } from "openai-edge";
import { OpenAIStream, StreamingTextResponse } from "ai";

// Configuration for OpenAI API using an environment variable for the API key
const config = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(config);

// The POST function to handle incoming requests to the /api/aristotle endpoint
export async function POST(req: Request) {
  try {
    // Extracting message, context, note, and extractedText from the request body
    const { message, context, note, extractedText } = await req.json();

    // Construct the context string for the OpenAI API call
    const contextString = `${context}\nNote Content: ${note}\nExtracted Text: ${extractedText}\nUser: ${message}`;

    const response = await openai.createChatCompletion({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are Aristotle, a knowledgeable and concise assistant. Answer all questions with precision and relevance to the context provided. Keep responses brief and to the point, focusing on delivering clear and direct information based on the current conversation context. Avoid unnecessary elaboration and maintain a supportive yet succinct tone."
        },
        {
          role: "user",
          content: contextString
        },
      ],
      stream: true,
    });

    const stream = OpenAIStream(response);
    return new StreamingTextResponse(stream);
  } catch (error) {
    console.error("Error processing request:", error);
    return new Response("Error processing request", { status: 500 });
  }
}
