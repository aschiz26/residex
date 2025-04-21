'use client'

import React, { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { getQuestion } from '@/lib/database'
import { generateEnhancedFeedback, generateEnhancedFollowUpQuestion } from '@/lib/enhanced-ai'
import { Question } from '@/lib/database'
import { Mic, MicOff, Send, ArrowLeft, ArrowRight } from 'lucide-react'

enum SessionState {
  QUESTION = 'question',
  ANSWERING = 'answering',
  FEEDBACK = 'feedback',
  FOLLOW_UP = 'follow_up'
}

function InterviewSessionContent() {
  const searchParams = useSearchParams()
  const questionId = searchParams.get('questionId')
  
  const [question, setQuestion] = useState<Question | null>(null)
  const [loading, setLoading] = useState(true)
  const [sessionState, setSessionState] = useState<SessionState>(SessionState.QUESTION)
  const [userResponse, setUserResponse] = useState('')
  const [isRecording, setIsRecording] = useState(false)
  const [feedback, setFeedback] = useState<any | null>(null)
  const [followUpQuestion, setFollowUpQuestion] = useState('')
  
  useEffect(() => {
    async function loadQuestion() {
      if (!questionId) return
      
      setLoading(true)
      try {
        const fetchedQuestion = await getQuestion(questionId)
        setQuestion(fetchedQuestion)
      } catch (error) {
        console.error('Failed to load question:', error)
      } finally {
        setLoading(false)
      }
    }
    
    loadQuestion()
  }, [questionId])
  
  const toggleRecording = () => {
    // In a real implementation, this would use the Web Speech API
    // For now, we'll just toggle the state
    setIsRecording(!isRecording)
    
    if (!isRecording) {
      // Simulate recording by updating the response after a delay
      setTimeout(() => {
        setUserResponse(prev => prev + (prev ? ' ' : '') + 'This is a simulated voice recording response.')
        setIsRecording(false)
      }, 3000)
    }
  }
  
  const handleSubmitResponse = async () => {
    if (!question) return
    
    setSessionState(SessionState.FEEDBACK)
    
    try {
      // Generate enhanced feedback with more detailed points
      const feedbackResult = await generateEnhancedFeedback(question.question_text, userResponse)
      setFeedback(feedbackResult)
      
      // Generate follow-up question
      const followUp = await generateEnhancedFollowUpQuestion(question.question_text, userResponse)
      setFollowUpQuestion(followUp)
    } catch (error) {
      console.error('Failed to generate feedback:', error)
    }
  }
  
  const handleContinueToFollowUp = () => {
    setSessionState(SessionState.FOLLOW_UP)
  }
  
  const handleStartNewQuestion = () => {
    // Reset state for a new question
    setUserResponse('')
    setFeedback(null)
    setFollowUpQuestion('')
    setSessionState(SessionState.QUESTION)
  }
  
  if (loading) {
    return <div className="container mx-auto py-16 px-4 text-center">Loading interview session...</div>
  }
  
  if (!question) {
    return <div className="container mx-auto py-16 px-4 text-center">Question not found. <a href="/interview" className="text-blue-600 hover:underline">Return to questions</a></div>
  }
  
  return (
    <main className="container mx-auto py-8 px-4">
      <div className="mb-4">
        <Button variant="outline" size="sm" asChild>
          <a href="/interview"><ArrowLeft className="mr-2 h-4 w-4" /> Back to Questions</a>
        </Button>
      </div>
      
      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle className="text-lg">Interview Coach</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-3xl">👨‍⚕️</span>
              </div>
              <p className="text-center text-sm text-gray-500 mb-4">
                I'll evaluate your responses and provide feedback on both content and presentation.
              </p>
              <div className="space-y-2">
                <div className="text-sm">
                  <span className="font-medium">Category:</span> {question.category}
                </div>
                <div className="text-sm">
                  <span className="font-medium">Subcategory:</span> {question.subcategory}
                </div>
                <div className="text-sm">
                  <span className="font-medium">Difficulty:</span> {question.difficulty}/5
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="md:col-span-2">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>
                {sessionState === SessionState.FOLLOW_UP ? 'Follow-up Question' : 'Question'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg">
                {sessionState === SessionState.FOLLOW_UP ? followUpQuestion : question.question_text}
              </p>
            </CardContent>
          </Card>
          
          {sessionState === SessionState.QUESTION || sessionState === SessionState.ANSWERING ? (
            <Card>
              <CardHeader>
                <CardTitle>Your Response</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Type your answer here..."
                  className="min-h-[200px]"
                  value={userResponse}
                  onChange={(e) => setUserResponse(e.target.value)}
                />
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button 
                  variant={isRecording ? "destructive" : "outline"} 
                  onClick={toggleRecording}
                >
                  {isRecording ? (
                    <><MicOff className="mr-2 h-4 w-4" /> Stop Recording</>
                  ) : (
                    <><Mic className="mr-2 h-4 w-4" /> Start Recording</>
                  )}
                </Button>
                <Button 
                  onClick={handleSubmitResponse}
                  disabled={!userResponse.trim()}
                >
                  <Send className="mr-2 h-4 w-4" /> Submit Response
                </Button>
              </CardFooter>
            </Card>
          ) : null}
          
          {sessionState === SessionState.FEEDBACK && feedback ? (
            <Card>
              <CardHeader>
                <CardTitle>Feedback</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <p>{feedback.feedback}</p>
                
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Content Score</span>
                      <span className="text-sm font-medium">{feedback.contentScore}%</span>
                    </div>
                    <Progress value={feedback.contentScore} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Presentation Score</span>
                      <span className="text-sm font-medium">{feedback.presentationScore}%</span>
                    </div>
                    <Progress value={feedback.presentationScore} className="h-2" />
                  </div>
                </div>
                
                <Tabs defaultValue="strengths">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="strengths">Strengths</TabsTrigger>
                    <TabsTrigger value="improvements">Areas for Improvement</TabsTrigger>
                  </TabsList>
                  <TabsContent value="strengths" className="space-y-2 mt-2">
                    {feedback.strengths.length > 0 ? (
                      <ul className="list-disc pl-5 space-y-2">
                        {feedback.strengths.map((strength, index) => (
                          <li key={index} className="text-sm">{strength}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-gray-500">No specific strengths identified.</p>
                    )}
                  </TabsContent>
                  <TabsContent value="improvements" className="space-y-2 mt-2">
                    {feedback.improvements.length > 0 ? (
                      <ul className="list-disc pl-5 space-y-2">
                        {feedback.improvements.map((improvement, index) => (
                          <li key={index} className="text-sm">{improvement}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-gray-500">No specific improvements identified.</p>
                    )}
                  </TabsContent>
                </Tabs>
              </CardContent>
              <CardFooter>
                <Button onClick={handleContinueToFollowUp} className="w-full">
                  Continue to Follow-up Question <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          ) : null}
          
          {sessionState === SessionState.FOLLOW_UP && (
            <Card>
              <CardHeader>
                <CardTitle>Your Response</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Type your answer to the follow-up question..."
                  className="min-h-[200px]"
                  value={userResponse}
                  onChange={(e) => setUserResponse(e.target.value)}
                />
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button 
                  variant="outline" 
                  onClick={handleStartNewQuestion}
                >
                  End Session
                </Button>
                <Button 
                  onClick={handleSubmitResponse}
                  disabled={!userResponse.trim()}
                >
                  <Send className="mr-2 h-4 w-4" /> Submit Response
                </Button>
              </CardFooter>
            </Card>
          )}
        </div>
      </div>
    </main>
  )
}

export default function InterviewSessionPage() {
  return (
    <Suspense fallback={<div className="container mx-auto py-16 px-4 text-center">Loading interview session...</div>}>
      <InterviewSessionContent />
    </Suspense>
  )
}
