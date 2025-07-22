

import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

export async function generatePersona(prompt) {
    const apiKey = process.env.GOOGLE_API_KEY;
    if (!apiKey) {
        throw new Error('GOOGLE_API_KEY environment variable is required');
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const systemPrompt = `Generate a detailed user persona based on the provided description.
    
    Return your response as a valid JSON object. Do not include any text or markdown outside of the JSON.
    The JSON structure should be exactly as follows:
    {
        "name": "string (A concise name for the persona, e.g., 'Tech Enthusiast Emily')",
        "age": integer,
        "gender": "string",
        "interests": ["array", "of", "strings"],
        "preferred_colors": ["array", "of", "color", "names"],
        "tone_preference": "string (e.g., fun, serious, professional, casual)",
        "personality_traits": ["array", "of", "traits"],
        "food_preferences": ["array", "of", "food", "preferences"],
        "description": "A comprehensive 2-3 sentence description of this persona"
    }
    
    Make realistic details that align with the description. If specific details aren't mentioned, make reasonable assumptions.
    Ensure all string values in arrays are properly quoted and separated by commas.
    There should be no trailing commas after the last element in any array or object.
    `;

    const fullPrompt = `${systemPrompt}\n\nDescription: ${prompt}`;

    try {
        const result = await model.generateContent(fullPrompt);
        const response = await result.response;

        let content = response.text().trim(); // Trim whitespace

        // 1. Remove Markdown code block wrappers if present
        if (content.startsWith('```json')) {
            content = content.substring(7); // Remove '```json\n'
        }
        if (content.endsWith('```')) {
            content = content.slice(0, -3); // Remove '\n```'
        }
        content = content.trim(); // Trim again after removing wrappers

        // Fallback for cases where it adds "json" after the start of content
        if (content.startsWith('json\n{')) {
            content = content.substring(5);
        }
        content = content.trim();

        // Ensure we only parse the actual JSON object
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            console.error('Gemini response did not contain a valid JSON object:', content);
            throw new Error('No valid JSON object found in Gemini response.');
        }

        const jsonString = jsonMatch[0];

        // Attempt to parse the JSON
        const personaData = JSON.parse(jsonString);

        // Basic validation of the parsed structure (optional but good practice)
        if (typeof personaData.age !== 'number' ||
            typeof personaData.gender !== 'string' ||
            !Array.isArray(personaData.interests) ||
            !Array.isArray(personaData.preferred_colors) ||
            typeof personaData.tone_preference !== 'string' ||
            !Array.isArray(personaData.personality_traits) ||
            !Array.isArray(personaData.food_preferences) ||
            typeof personaData.description !== 'string' ||
            typeof personaData.name !== 'string' // Ensure name is present
        ) {
            console.error('Parsed persona data has incorrect structure:', personaData);
            throw new Error('Gemini response produced an invalid persona data structure.');
        }

        return personaData;
    } catch (error) {
        // More specific error handling
        if (error.message.includes('No valid JSON object found')) {
            throw error; // Re-throw our custom error for clarity
        } else if (error instanceof SyntaxError) {
            // This catches the "Expected ',' or ']'" error specifically
            console.error('Failed to parse JSON from Gemini:', error.message);
            console.error('Faulty JSON content received:', content); // Log the raw content
            throw new Error(`Failed to parse persona JSON from AI: ${error.message}. Raw content might be malformed. Check console for details.`);
        } else {
            console.error('Gemini API communication or other error:', error);
            throw new Error(`Gemini API error: ${error.message || 'An unknown error occurred with the AI.'}`);
        }
    }
}