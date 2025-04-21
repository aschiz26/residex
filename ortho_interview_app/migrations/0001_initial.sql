-- Initialize database tables for Orthopedic Interview Coach

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  password_hash TEXT NOT NULL,
  role TEXT DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Questions table
CREATE TABLE IF NOT EXISTS questions (
  id TEXT PRIMARY KEY,
  category TEXT NOT NULL,
  subcategory TEXT,
  question_text TEXT NOT NULL,
  difficulty INTEGER,
  created_by TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (created_by) REFERENCES users(id)
);

-- Sessions table
CREATE TABLE IF NOT EXISTS sessions (
  id TEXT PRIMARY KEY,
  user_id TEXT,
  start_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  end_time TIMESTAMP,
  feedback_summary TEXT,
  content_score REAL,
  presentation_score REAL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Session_Questions table
CREATE TABLE IF NOT EXISTS session_questions (
  id TEXT PRIMARY KEY,
  session_id TEXT,
  question_id TEXT,
  user_response TEXT,
  feedback TEXT,
  content_score REAL,
  presentation_score REAL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (session_id) REFERENCES sessions(id),
  FOREIGN KEY (question_id) REFERENCES questions(id)
);

-- Insert some initial orthopedic interview questions
INSERT INTO questions (id, category, subcategory, question_text, difficulty) VALUES
('q1', 'behavioral', 'general', 'Tell me about yourself.', 1),
('q2', 'behavioral', 'motivation', 'Why orthopedics?', 2),
('q3', 'behavioral', 'future', 'How do you view yourself as a practicing orthopedic surgeon?', 2),
('q4', 'clinical', 'fractures', 'Describe the Gustilo classification for open fractures.', 3),
('q5', 'clinical', 'fractures', 'How would you manage a mangled extremity?', 4),
('q6', 'clinical', 'fractures', 'Describe your surgical planning approach for a hip fracture.', 3),
('q7', 'clinical', 'fractures', 'What is your approach to a supracondylar fracture?', 3),
('q8', 'clinical', 'fractures', 'How would you manage a distal radius fracture?', 2),
('q9', 'clinical', 'fractures', 'Describe the classification and management of tibial plateau fractures.', 4);
