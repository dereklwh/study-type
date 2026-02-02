import OpenAI from 'openai';

let openaiClient: OpenAI | null = null;

export function initializeOpenAI(apiKey: string): void {
  openaiClient = new OpenAI({
    apiKey,
    dangerouslyAllowBrowser: true,
  });
}

export async function optimizeTextForLearning(text: string): Promise<string> {
  if (!openaiClient) {
    throw new Error('OpenAI client not initialized. Please set your API key.');
  }

  const response = await openaiClient.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: `You are a learning optimization assistant. Your task is to extract and reformat text for a typing test that maximizes learning retention.

Guidelines:
- Extract key concepts, definitions, and important facts
- Remove filler words and redundant phrases
- Keep sentences concise but meaningful
- Preserve technical terms and their definitions
- Format as clean, typable text (no bullet points or special formatting)
- Separate distinct concepts with periods
- Aim for 500-1000 characters of optimized content`,
      },
      {
        role: 'user',
        content: `Please optimize this study material for a typing test:\n\n${text.slice(0, 4000)}`,
      },
    ],
    max_tokens: 1000,
  });

  return response.choices[0]?.message?.content || text;
}

export function isOpenAIInitialized(): boolean {
  return openaiClient !== null;
}
