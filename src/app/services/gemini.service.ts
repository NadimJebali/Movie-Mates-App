import { Injectable } from '@angular/core';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class GeminiService {
  private genAI = new GoogleGenerativeAI(environment.geminiApiKey);

  async getCompatibilityScore(profileA: any, profileB: any): Promise<{score: number, summary: string}> {
    try {
      // No model specified — SDK uses the default available one
      const model = this.genAI.getGenerativeModel({
        model: 'gemini-2.0-flash-lite'
      });

      const prompt = `
        You are a compatibility assistant. Compare these two dating profiles and return:
        {
          "score": number (0–100),
          "summary": string (1–2 sentences)
        }

        Your Profile:
        ${JSON.stringify(profileA, null, 2)}

        Their profile:
        ${JSON.stringify(profileB, null, 2)}

      `;

      const result = await model.generateContent(prompt);
      const text = result.response.text();
      console.log('Gemini raw response:', text);

      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return {
          score: Math.min(100, Math.max(0, parsed.score || 0)),
          summary: parsed.summary || 'No summary provided.',
        };
      }

      return { score: 0, summary: 'Could not parse Gemini response.' };
    } catch (error: any) {
      console.error('Gemini error:', error);
      return { score: 0, summary: 'Error during compatibility analysis.' };
    }
  }
}
