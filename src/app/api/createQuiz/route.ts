import { OpenAIApi, Configuration } from "openai-edge";
import { OpenAIStream, StreamingTextResponse } from "ai";

const config = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(config);

const calculateComplexity = (mentalStudyScoreCode, topicsUnderstoodPercentage) => {
    const validTopicsPercentage = topicsUnderstoodPercentage !== null ? topicsUnderstoodPercentage : 50;
    const baseScore = (mentalStudyScoreCode + validTopicsPercentage) / 2;
    return Math.min(Math.max(baseScore, 0), 100);
};

export async function POST(req) {
    try {
        const { prompt, inputType, userId, mentalStudyScoreCode, hobbies, topicsUnderstoodPercentage } = await req.json();

        const complexity = calculateComplexity(mentalStudyScoreCode, topicsUnderstoodPercentage);
        const validTopicsPercentage = topicsUnderstoodPercentage !== null ? topicsUnderstoodPercentage : "unknown";

        const response = await openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: "system",
                    content: `Generate a quiz based on the provided notes. Here are the guidelines:

1. Create exactly 5 questions in total.
2. The current complexity level is ${complexity.toFixed(2)} out of 100.
3. Adjust question difficulty based on this complexity:
   - Lower complexity (0-30): Use simple language, focus on basic concepts and definitions.
   - Medium complexity (31-70): Mix of basic and more advanced concepts, must include some application questions.
   - Higher complexity (71-100): Include more challenging questions, advanced concepts, and analytical thinking.
4. Stay within the main topic provided in the notes.
5. If the complexity is below 60, consider using analogies related to the user's hobbies (${hobbies}) to explain concepts, but don't force this.
6. The user's mental study score is ${mentalStudyScoreCode} and their topic understanding is ${validTopicsPercentage}%. Use this to further refine question phrasing and complexity.
7. Return the quiz as a JSON object in this exact format:
{
  "quiz": [
    {
      "question": "string",
      "choices": ["string", "string", "string", "string"],
      "answer": "string"
    },
    {
      "question": "string",
      "choices": ["string", "string", "string", "string"],
      "answer": "string"
    },
    {
      "question": "string",
      "choices": ["string", "string", "string", "string"],
      "answer": "string"
    },
    {
      "question": "string",
      "choices": ["string", "string", "string", "string"],
      "answer": "string"
    },
    {
      "question": "string",
      "choices": ["string", "string", "string", "string"],
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
