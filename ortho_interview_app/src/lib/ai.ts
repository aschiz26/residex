'use client'

// Define the structure for feedback results
export interface FeedbackResult {
  feedback: string;
  contentScore: number;
  presentationScore: number;
  strengths: string[];
  improvements: string[];
}

// Simulated feedback generation (fallback if OpenAI integration fails)
export async function generateFeedback(question: string, response: string): Promise<FeedbackResult> {
  // Simulate processing time
  await new Promise(resolve => setTimeout(resolve, 1500))
  
  return {
    feedback: "Your answer demonstrates understanding of the topic, but could be more comprehensive. Consider structuring your response more clearly.",
    contentScore: 65,
    presentationScore: 70,
    strengths: [
      "You demonstrated good basic knowledge of the topic",
      "Your answer included relevant examples",
      "You maintained a professional tone throughout your answer",
      "You effectively communicated your interest in orthopedic surgery",
      "Your response showed awareness of clinical implications"
    ],
    improvements: [
      "Expand on your clinical experiences with more specific examples",
      "Structure your answer with a clear introduction, body, and conclusion",
      "Include more specific details about orthopedic principles",
      "Work on conciseness - some parts were unnecessarily verbose",
      "Consider addressing potential follow-up questions in your initial response",
      "Incorporate more evidence-based information",
      "Practice more confident delivery with fewer hesitations"
    ]
  }
}

// Simulated follow-up question generation (fallback if OpenAI integration fails)
export async function generateFollowUpQuestion(question: string, response: string): Promise<string> {
  // Simulate processing time
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  return "Based on your previous answer, how would you approach a complex case involving both traumatic injury and underlying degenerative joint disease in a young athlete?"
}
