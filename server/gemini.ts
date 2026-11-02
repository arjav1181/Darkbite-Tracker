import * as fs from "fs";
import { GoogleGenAI } from "@google/genai";

// Integration with javascript_gemini blueprint
// Note that the newest Gemini model series is "gemini-2.5-flash" or gemini-2.5-pro"
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export interface FoodAnalysis {
  name: string;
  description?: string;
  calories: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  confidence?: number;
}

export async function analyzeImageFile(imagePath: string): Promise<FoodAnalysis> {
  try {
    const imageBytes = fs.readFileSync(imagePath);

    const systemPrompt = `You are a nutrition expert and food recognition AI. 
Analyze the food in the image and provide:
1. The name of the food/dish
2. A brief description
3. Estimated calories for the portion shown
4. Estimated macronutrients (protein, carbs, fat in grams)
5. Confidence score (0-1) in your analysis

Be as accurate as possible. If multiple items are visible, provide the total for all items combined.
Respond with JSON in this exact format:
{
  "name": "Food name",
  "description": "Brief description",
  "calories": number,
  "protein": number,
  "carbs": number,
  "fat": number,
  "confidence": number
}`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
        responseSchema: {
          type: "object",
          properties: {
            name: { type: "string" },
            description: { type: "string" },
            calories: { type: "number" },
            protein: { type: "number" },
            carbs: { type: "number" },
            fat: { type: "number" },
            confidence: { type: "number" },
          },
          required: ["name", "calories"],
        },
      },
      contents: [
        {
          inlineData: {
            data: imageBytes.toString("base64"),
            mimeType: "image/jpeg",
          },
        },
        "Analyze this food image and provide nutritional information",
      ],
    });

    const rawJson = response.text;
    if (!rawJson) {
      throw new Error("Empty response from Gemini");
    }

    const analysis: FoodAnalysis = JSON.parse(rawJson);
    return analysis;
  } catch (error) {
    console.error("Failed to analyze image:", error);
    throw new Error(`Failed to analyze food image: ${error}`);
  }
}

export async function analyzeTextDescription(description: string): Promise<FoodAnalysis> {
  try {
    const systemPrompt = `You are a nutrition expert. 
Based on the food description provided, estimate:
1. The name of the food/dish
2. A brief description
3. Estimated calories
4. Estimated macronutrients (protein, carbs, fat in grams)
5. Confidence score (0-1) in your analysis

Be as accurate as possible. If multiple items are mentioned, provide the total for all items combined.
Respond with JSON in this exact format:
{
  "name": "Food name",
  "description": "Brief description",
  "calories": number,
  "protein": number,
  "carbs": number,
  "fat": number,
  "confidence": number
}`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
        responseSchema: {
          type: "object",
          properties: {
            name: { type: "string" },
            description: { type: "string" },
            calories: { type: "number" },
            protein: { type: "number" },
            carbs: { type: "number" },
            fat: { type: "number" },
            confidence: { type: "number" },
          },
          required: ["name", "calories"],
        },
      },
      contents: description,
    });

    const rawJson = response.text;
    if (!rawJson) {
      throw new Error("Empty response from Gemini");
    }

    const analysis: FoodAnalysis = JSON.parse(rawJson);
    return analysis;
  } catch (error) {
    console.error("Failed to analyze text:", error);
    throw new Error(`Failed to analyze food description: ${error}`);
  }
}
