import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

export async function enhanceAd(persona, report, adToEnhance) {
  const apiKey = process.env.GOOGLE_API_KEY;
  if (!apiKey) {
    throw new Error('GOOGLE_API_KEY environment variable is required');
  }

  // Get the scores from the winning and losing ads
  const winningAd = adToEnhance === 'Ad A' ? report.ad_a_scores : report.ad_b_scores;
  const losingAd = adToEnhance === 'Ad A' ? report.ad_b_scores : report.ad_a_scores;

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

  const systemPrompt = `You are an expert advertising creative director. Based on the provided insights and performance data, create an enhanced version of the ad that combines the successful elements while improving upon any weaknesses.

PERSONA:
- Age: ${persona.age}
- Gender: ${persona.gender}
- Interests: ${persona.interests.join(', ')}
- Preferred Colors: ${persona.preferred_colors.join(', ')}
- Tone Preference: ${persona.tone_preference}
- Personality Traits: ${persona.personality_traits.join(', ')}
- Food Preferences: ${persona.food_preferences.join(', ')}
- Description: ${persona.description}

WINNING ELEMENTS TO MAINTAIN:
${Object.entries(winningAd)
  .filter(([_, score]) => score >= 8)
  .map(([criterion, score]) => `- ${criterion.replace(/_/g, ' ')}: ${score}/10`)
  .join('\n')}

ELEMENTS TO IMPROVE:
${Object.entries(winningAd)
  .filter(([_, score]) => score < 8)
  .map(([criterion, score]) => `- ${criterion.replace(/_/g, ' ')}: ${score}/10`)
  .join('\n')}

For the ${report.ad_type} ad type, create an enhanced version that:

Return your response as a valid JSON object with this exact structure:
{
    "enhanced_ad": {
        "description": "Detailed description of the enhanced ad design/copy",
        "improvements": ["List of specific improvements made"],
        "expected_impact": "Expected effect on the target audience",
        "test_recommendations": ["List of suggestions for A/B testing the enhanced version"]
    }
}`;

  try {
    const result = await model.generateContent(systemPrompt);
    const response = await result.response;
    const content = response.text();
    
    // Clean the response to extract JSON
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No valid JSON found in response');
    }
    
    const enhancementData = JSON.parse(jsonMatch[0]);
    
    // Calculate predicted scores based on improvements
    const predictedScores = {...winningAd};
    enhancementData.enhanced_ad.improvements.forEach(improvement => {
      // Find criteria mentioned in the improvement and boost their scores
      Object.keys(predictedScores).forEach(criterion => {
        if (improvement.toLowerCase().includes(criterion.replace(/_/g, ' ').toLowerCase())) {
          predictedScores[criterion] = Math.min(10, predictedScores[criterion] + 1);
        }
      });
    });

    return {
      enhancedContent: enhancementData.enhanced_ad.description,
      explanation: enhancementData.enhanced_ad.expected_impact,
      improvementSummary: {
        improvements: enhancementData.enhanced_ad.improvements,
        predictedScores
      }
    };
    
  } catch (error) {
    if (error.name === 'SyntaxError') {
      throw new Error(`Failed to parse enhancement JSON: ${error.message}`);
    } else {
      throw new Error(`Gemini API error: ${error.message}`);
    }
  }
}
