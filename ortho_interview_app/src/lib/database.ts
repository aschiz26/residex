// Database utility functions
import { nanoid } from 'nanoid';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
}

export interface Question {
  id: string;
  category: string;
  subcategory: string;
  question_text: string;
  difficulty: number;
}

export interface Session {
  id: string;
  user_id: string;
  start_time: string;
  end_time?: string;
  feedback_summary?: string;
  content_score?: number;
  presentation_score?: number;
}

export interface SessionQuestion {
  id: string;
  session_id: string;
  question_id: string;
  user_response?: string;
  feedback?: string;
  content_score?: number;
  presentation_score?: number;
}

// Mock database functions for initial development
// These will be replaced with actual D1 database calls later

let mockQuestions: Question[] = [
  {
    id: 'q1',
    category: 'behavioral',
    subcategory: 'general',
    question_text: 'Tell me about yourself.',
    difficulty: 1
  },
  {
    id: 'q2',
    category: 'behavioral',
    subcategory: 'motivation',
    question_text: 'Why orthopedics?',
    difficulty: 2
  },
  {
    id: 'q3',
    category: 'behavioral',
    subcategory: 'future',
    question_text: 'How do you view yourself as a practicing orthopedic surgeon?',
    difficulty: 2
  },
  {
    id: 'q4',
    category: 'clinical',
    subcategory: 'fractures',
    question_text: 'Describe the Gustilo classification for open fractures.',
    difficulty: 3
  },
  {
    id: 'q5',
    category: 'clinical',
    subcategory: 'fractures',
    question_text: 'How would you manage a mangled extremity?',
    difficulty: 4
  },
  {
    id: 'q6',
    category: 'clinical',
    subcategory: 'fractures',
    question_text: 'Describe your surgical planning approach for a hip fracture.',
    difficulty: 3
  },
  {
    id: 'q7',
    category: 'clinical',
    subcategory: 'fractures',
    question_text: 'What is your approach to a supracondylar fracture?',
    difficulty: 3
  },
  {
    id: 'q8',
    category: 'clinical',
    subcategory: 'fractures',
    question_text: 'How would you manage a distal radius fracture?',
    difficulty: 2
  },
  {
    id: 'q9',
    category: 'clinical',
    subcategory: 'fractures',
    question_text: 'Describe the classification and management of tibial plateau fractures.',
    difficulty: 4
  }
];

let mockSessions: Session[] = [];
let mockSessionQuestions: SessionQuestion[] = [];

export async function getQuestions(category?: string): Promise<Question[]> {
  if (category) {
    return mockQuestions.filter(q => q.category === category);
  }
  return mockQuestions;
}

export async function getQuestion(id: string): Promise<Question | null> {
  return mockQuestions.find(q => q.id === id) || null;
}

export async function createSession(userId: string): Promise<Session> {
  const session: Session = {
    id: nanoid(),
    user_id: userId,
    start_time: new Date().toISOString()
  };
  mockSessions.push(session);
  return session;
}

export async function endSession(sessionId: string, feedback: string, contentScore: number, presentationScore: number): Promise<Session> {
  const session = mockSessions.find(s => s.id === sessionId);
  if (!session) {
    throw new Error('Session not found');
  }
  
  session.end_time = new Date().toISOString();
  session.feedback_summary = feedback;
  session.content_score = contentScore;
  session.presentation_score = presentationScore;
  
  return session;
}

export async function addQuestionToSession(sessionId: string, questionId: string): Promise<SessionQuestion> {
  const sessionQuestion: SessionQuestion = {
    id: nanoid(),
    session_id: sessionId,
    question_id: questionId
  };
  mockSessionQuestions.push(sessionQuestion);
  return sessionQuestion;
}

export async function saveResponse(sessionQuestionId: string, response: string): Promise<SessionQuestion> {
  const sessionQuestion = mockSessionQuestions.find(sq => sq.id === sessionQuestionId);
  if (!sessionQuestion) {
    throw new Error('Session question not found');
  }
  
  sessionQuestion.user_response = response;
  return sessionQuestion;
}

export async function saveFeedback(
  sessionQuestionId: string, 
  feedback: string, 
  contentScore: number, 
  presentationScore: number
): Promise<SessionQuestion> {
  const sessionQuestion = mockSessionQuestions.find(sq => sq.id === sessionQuestionId);
  if (!sessionQuestion) {
    throw new Error('Session question not found');
  }
  
  sessionQuestion.feedback = feedback;
  sessionQuestion.content_score = contentScore;
  sessionQuestion.presentation_score = presentationScore;
  
  return sessionQuestion;
}

export async function getSessionQuestions(sessionId: string): Promise<Array<SessionQuestion & { question: Question }>> {
  const sessionQuestions = mockSessionQuestions.filter(sq => sq.session_id === sessionId);
  return Promise.all(
    sessionQuestions.map(async sq => {
      const question = await getQuestion(sq.question_id);
      return {
        ...sq,
        question: question!
      };
    })
  );
}
