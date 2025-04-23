'use client'

import { FeedbackResult } from '@/lib/ai'

// Define the OpenAI API response structure
interface OpenAIResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: {
    index: number;
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }[];
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

// Parse the OpenAI response to extract feedback components
function parseFeedbackResponse(responseText: string): {
  feedback: string;
  contentScore: number;
  presentationScore: number;
  strengths: string[];
  improvements: string[];
} {
  try {
    // The response should be in JSON format
    const parsedResponse = JSON.parse(responseText);
    
    return {
      feedback: parsedResponse.feedback || "Feedback not available",
      contentScore: parsedResponse.contentScore || 50,
      presentationScore: parsedResponse.presentationScore || 50,
      strengths: parsedResponse.strengths || [],
      improvements: parsedResponse.improvements || []
    };
  } catch (error) {
    console.error("Error parsing OpenAI response:", error);
    // Return default values if parsing fails
    return {
      feedback: "There was an error generating feedback. Please try again.",
      contentScore: 50,
      presentationScore: 50,
      strengths: ["Your answer contained relevant information"],
      improvements: ["Consider providing more specific details"]
    };
  }
}

// Generate feedback using OpenAI API
export async function generateOpenAIFeedback(question: string, response: string): Promise<FeedbackResult> {
  // Construct the prompt for OpenAI
  const prompt = {
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content: `You are an expert medical residency interview coach specializing in orthopedic surgery. 
        Your task is to evaluate a candidate's response to an interview question and provide detailed feedback.
        
        Analyze both the content (accuracy, relevance, completeness) and presentation (structure, clarity, conciseness).
        
        Return your evaluation in the following JSON format:
        {
          "feedback": "Brief overall assessment of the response",
          "contentScore": <number between 0-100>,
          "presentationScore": <number between 0-100>,
          "strengths": [
            "Detailed strength point 1",
            "Detailed strength point 2",
            "Detailed strength point 3",
            "Detailed strength point 4",
            "Detailed strength point 5"
          ],
          "improvements": [
            "Detailed improvement suggestion 1",
            "Detailed improvement suggestion 2",
            "Detailed improvement suggestion 3",
            "Detailed improvement suggestion 4",
            "Detailed improvement suggestion 5",
            "Detailed improvement suggestion 6",
            "Detailed improvement suggestion 7"
          ]
        }
        
        Ensure your feedback is specific, actionable, and tailored to orthopedic surgery residency interviews.`
      },
      {
        role: "user",
        content: `Question: ${question}\n\nCandidate's Response: ${response}`
      }
    ]
  };

  try {
    // Make the API call to OpenAI
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY || ''}`
      },
      body: JSON.stringify(prompt)
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`);
    }

    const data: OpenAIResponse = await response.json();
    
    // Extract the content from the response
    const content = data.choices[0]?.message?.content || '';
    
    // Parse the feedback from the response
    const parsedFeedback = parseFeedbackResponse(content);
    
    return parsedFeedback;
  } catch (error) {
    console.error("Error calling OpenAI API:", error);
    
    // Return a fallback response in case of error
    return {
      feedback: "There was an error generating feedback. Please try again.",
      contentScore: 50,
      presentationScore: 50,
      strengths: [
        "Your answer contained some relevant information",
        "You attempted to address the question asked",
        "Your response showed interest in orthopedic surgery",
        "You maintained a professional tone",
        "You demonstrated some knowledge of the topic"
      ],
      improvements: [
        "Provide more specific examples from your experience",
        "Structure your answer with a clear introduction and conclusion",
        "Include more specific details about orthopedic principles",
        "Work on conciseness - some parts were unnecessarily verbose",
        "Address potential follow-up questions in your initial response",
        "Incorporate more evidence-based information",
        "Practice more confident delivery with fewer hesitations"
      ]
    };
  }
}

// Generate follow-up question using OpenAI API
export async function generateOpenAIFollowUpQuestion(question: string, response: string): Promise<string> {
  // Construct the prompt for OpenAI
  const prompt = {
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content: `You are an expert medical residency interviewer specializing in orthopedic surgery. 
        Your task is to generate a relevant follow-up question based on a candidate's response to an interview question.
        
        The follow-up question should:
        1. Probe deeper into the candidate's knowledge or experience
        2. Be related to their response
        3. Be challenging but fair
        4. Focus on orthopedic surgery concepts, clinical scenarios, or professional development
        5. Be concise and clear
        
        Return only the follow-up question with no additional text or explanation.`
      },
      {
        role: "user",
        content: `Original Question: ${question}\n\nCandidate's Response: ${response}\n\nGenerate a follow-up question:`
      }
    ]
  };

  try {
    // Make the API call to OpenAI
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY || ''}`
      },
      body: JSON.stringify(prompt)
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`);
    }

    const data: OpenAIResponse = await response.json();
    
    // Extract the content from the response
    const followUpQuestion = data.choices[0]?.message?.content || '';
    
    return followUpQuestion;
  } catch (error) {
    console.error("Error calling OpenAI API:", error);
    
    // Return a fallback follow-up question in case of error
    return "Based on your interest in orthopedic surgery, can you describe a challenging case you've observed and what you learned from it?";
  }
}
