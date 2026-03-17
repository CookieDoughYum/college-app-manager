import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY || '' });

export async function askClaude(prompt: string): Promise<string> {
  const msg = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 1024,
    messages: [{ role: 'user', content: prompt }],
  });
  const block = msg.content[0];
  return block.type === 'text' ? block.text : '';
}
