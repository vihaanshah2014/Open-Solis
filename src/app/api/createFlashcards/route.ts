//api/createFlashcards
import { OpenAIApi, Configuration } from "openai-edge";
import { OpenAIStream, StreamingTextResponse } from "ai";

const config = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(config);

export async function POST(req: Request) {
    try {
        const { prompt, inputType, userId } = await req.json();

        if (!prompt || typeof prompt !== "string") {
            throw new Error("Invalid or missing 'prompt' in request body.");
        }

        // console.log("Received prompt:", prompt);
        // console.log("Received inputType:", inputType);
        // console.log("Received userId:", userId);

        const response = await openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: "system",
                    content: `Generate flashcards based on the provided notes. Here are the guidelines:

1. Create exactly 10 flashcards in total.
4. Stay within the main topic provided in the notes.
7. Return the flashcards as a JSON object in this exact format:
{
  "flashcards": [
    {
      "question": "string",
      "answer": "string"
    },
    {
      "question": "string",
      "answer": "string"
    },
    {
      "question": "string",
      "answer": "string"
    },
    {
      "question": "string",
      "answer": "string"
    },
    {
      "question": "string",
      "answer": "string"
    },
    {
        "question": "string",
        "answer": "string"
      },
      {
        "question": "string",
        "answer": "string"
      },
      {
        "question": "string",
        "answer": "string"
      },
      {
        "question": "string",
        "answer": "string"
      },
      {
        "question": "string",
        "answer": "string"
      }
  ]
}`,
                },
                {
                    role: "user",
                    content: prompt,
                },
            ],
            stream: true,
        });

        const stream = OpenAIStream(response);
        return new StreamingTextResponse(stream);
    } catch (error) {
        console.error('Error:', error);
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
}
