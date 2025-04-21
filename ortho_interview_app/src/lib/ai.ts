// AI utility functions for interview feedback
import { SessionQuestion } from './database';

// This is a simplified mock implementation
// In production, this would connect to OpenAI or another AI service

export interface FeedbackResult {
  feedback: string;
  contentScore: number;
  presentationScore: number;
  strengths: string[];
  improvements: string[];
}

// Knowledge base for evaluating clinical answers
const clinicalKnowledge = {
  'Gustilo classification': [
    'Type I: wound ≤1 cm, minimal contamination',
    'Type II: wound 1-10 cm, moderate soft tissue injury',
    'Type IIIA: extensive soft-tissue damage, adequate tissue for flap coverage',
    'Type IIIB: extensive periosteal stripping, requires soft tissue coverage',
    'Type IIIC: vascular injury requiring repair'
  ],
  'mangled extremity': [
    'vascular status assessment',
    'immediate IV antibiotics',
    'urgent irrigation and debridement',
    'fracture stabilization',
    'soft tissue coverage',
    'MESS score'
  ],
  'hip fracture': [
    'patient age and activity level',
    'fracture pattern (intertrochanteric, femoral neck)',
    'bone quality',
    'implant selection (sliding hip screw, cephalomedullary nail)',
    'timing of surgery (24-48 hours)'
  ],
  'supracondylar fracture': [
    'neurovascular status',
    'Gartland classification',
    'closed reduction',
    'percutaneous pinning',
    'pin configuration'
  ],
  'radius fracture': [
    'radial length',
    'radial inclination',
    'volar tilt',
    'volar plating',
    'external fixation',
    'K-wire fixation'
  ],
  'tibial plateau fracture': [
    'Schatzker classification',
    'soft tissue envelope',
    'CT scan for planning',
    'ORIF',
    'meniscal tears',
    'ligament injuries'
  ]
};

// Generate feedback based on user response and question
export async function generateFeedback(
  question: string,
  response: string
): Promise<FeedbackResult> {
  // In a real implementation, this would call an AI service
  // For now, we'll use a simple keyword-based approach
  
  const lowerResponse = response.toLowerCase();
  const lowerQuestion = question.toLowerCase();
  
  // Default feedback for empty responses
  if (!response || response.trim().length < 10) {
    return {
      feedback: "Your answer was too brief. Please provide a more detailed response.",
      contentScore: 0,
      presentationScore: 0,
      strengths: [],
      improvements: ["Provide a more detailed answer"]
    };
  }
  
  // Calculate content score based on keywords
  let contentScore = 0;
  let relevantKeywords: string[] = [];
  let missingKeywords: string[] = [];
  
  // Check for clinical knowledge keywords
  Object.entries(clinicalKnowledge).forEach(([topic, keywords]) => {
    if (lowerQuestion.includes(topic.toLowerCase())) {
      keywords.forEach(keyword => {
        if (lowerResponse.includes(keyword.toLowerCase())) {
          contentScore += 1;
          relevantKeywords.push(keyword);
        } else {
          missingKeywords.push(keyword);
        }
      });
    }
  });
  
  // Normalize content score to 0-100
  if (relevantKeywords.length + missingKeywords.length > 0) {
    contentScore = Math.min(100, Math.round((relevantKeywords.length / (relevantKeywords.length + missingKeywords.length)) * 100));
  } else {
    // For behavioral questions, use a simpler scoring method
    contentScore = Math.min(100, Math.round(response.length / 10));
  }
  
  // Calculate presentation score based on response structure
  const sentences = response.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const avgSentenceLength = response.length / (sentences.length || 1);
  
  let presentationScore = 0;
  
  // Ideal sentence length is between 10-25 words
  if (avgSentenceLength > 5 && avgSentenceLength < 30) {
    presentationScore += 30;
  }
  
  // Response should have multiple sentences
  if (sentences.length > 3) {
    presentationScore += 30;
  }
  
  // Response should be well-structured
  const hasParagraphs = response.includes('\n\n');
  if (hasParagraphs) {
    presentationScore += 20;
  }
  
  // Response should not be too short or too long
  if (response.length > 100 && response.length < 1000) {
    presentationScore += 20;
  }
  
  // Generate strengths and improvements
  const strengths: string[] = [];
  const improvements: string[] = [];
  
  if (relevantKeywords.length > 0) {
    strengths.push(`You correctly mentioned key concepts: ${relevantKeywords.slice(0, 3).join(', ')}${relevantKeywords.length > 3 ? '...' : ''}`);
  }
  
  if (sentences.length > 3) {
    strengths.push('Your answer was well-structured with multiple points');
  }
  
  if (missingKeywords.length > 0) {
    improvements.push(`Consider including these concepts: ${missingKeywords.slice(0, 3).join(', ')}${missingKeywords.length > 3 ? '...' : ''}`);
  }
  
  if (sentences.length < 3) {
    improvements.push('Try to expand your answer with more detail and examples');
  }
  
  if (avgSentenceLength > 30) {
    improvements.push('Consider using shorter, more concise sentences');
  }
  
  // Generate overall feedback
  let feedback = '';
  
  if (contentScore >= 80) {
    feedback = 'Excellent answer! You demonstrated strong knowledge of the subject matter. ';
  } else if (contentScore >= 60) {
    feedback = 'Good answer. You covered many important points, but there\'s room for improvement. ';
  } else if (contentScore >= 40) {
    feedback = 'Adequate answer, but you missed several key concepts. ';
  } else {
    feedback = 'Your answer needs significant improvement in terms of content. ';
  }
  
  if (presentationScore >= 80) {
    feedback += 'Your presentation was clear and well-structured.';
  } else if (presentationScore >= 60) {
    feedback += 'Your presentation was generally clear, but could be better organized.';
  } else if (presentationScore >= 40) {
    feedback += 'Your presentation needs improvement in terms of structure and clarity.';
  } else {
    feedback += 'Your presentation style needs significant improvement.';
  }
  
  return {
    feedback,
    contentScore,
    presentationScore,
    strengths,
    improvements
  };
}

// Generate a follow-up question based on the current question and response
export async function generateFollowUpQuestion(
  question: string,
  response: string
): Promise<string> {
  // In a real implementation, this would call an AI service
  // For now, we'll use predefined follow-ups based on the question topic
  
  const lowerQuestion = question.toLowerCase();
  
  if (lowerQuestion.includes('gustilo classification')) {
    return 'How would your management differ between a Type II and Type IIIB open fracture?';
  }
  
  if (lowerQuestion.includes('mangled extremity')) {
    return 'What factors would lead you to consider amputation versus limb salvage?';
  }
  
  if (lowerQuestion.includes('hip fracture')) {
    return 'What are the key considerations for postoperative rehabilitation in elderly patients with hip fractures?';
  }
  
  if (lowerQuestion.includes('supracondylar fracture')) {
    return 'What neurovascular complications are you most concerned about with supracondylar fractures?';
  }
  
  if (lowerQuestion.includes('radius fracture')) {
    return 'What are the indications for surgical versus non-surgical management of distal radius fractures?';
  }
  
  if (lowerQuestion.includes('tibial plateau fracture')) {
    return 'How does the Schatzker classification guide your treatment approach?';
  }
  
  if (lowerQuestion.includes('tell me about yourself')) {
    return 'What experiences have shaped your interest in orthopedic surgery specifically?';
  }
  
  if (lowerQuestion.includes('why orthopedics')) {
    return 'What aspects of orthopedic surgery do you find most challenging?';
  }
  
  // Default follow-up
  return 'Can you elaborate more on your approach to this topic?';
}
