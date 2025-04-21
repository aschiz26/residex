'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Question } from '@/lib/database'
import { getQuestions } from '@/lib/database'

export default function InterviewPage() {
  const [questions, setQuestions] = useState<Question[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('all')

  React.useEffect(() => {
    async function loadQuestions() {
      setLoading(true)
      try {
        const category = selectedCategory === 'all' ? undefined : selectedCategory
        const fetchedQuestions = await getQuestions(category)
        setQuestions(fetchedQuestions)
      } catch (error) {
        console.error('Failed to load questions:', error)
      } finally {
        setLoading(false)
      }
    }

    loadQuestions()
  }, [selectedCategory])

  return (
    <main className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center">Orthopedic Surgery Interview Coach</h1>
      
      <Tabs defaultValue="all" className="w-full max-w-4xl mx-auto" onValueChange={setSelectedCategory}>
        <TabsList className="grid grid-cols-3 mb-8">
          <TabsTrigger value="all">All Questions</TabsTrigger>
          <TabsTrigger value="behavioral">Behavioral</TabsTrigger>
          <TabsTrigger value="clinical">Clinical</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="space-y-4">
          <QuestionList questions={questions} loading={loading} />
        </TabsContent>
        
        <TabsContent value="behavioral" className="space-y-4">
          <QuestionList questions={questions} loading={loading} />
        </TabsContent>
        
        <TabsContent value="clinical" className="space-y-4">
          <QuestionList questions={questions} loading={loading} />
        </TabsContent>
      </Tabs>
    </main>
  )
}

function QuestionList({ questions, loading }: { questions: Question[], loading: boolean }) {
  if (loading) {
    return <div className="text-center py-8">Loading questions...</div>
  }
  
  if (questions.length === 0) {
    return <div className="text-center py-8">No questions found.</div>
  }
  
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {questions.map((question) => (
        <QuestionCard key={question.id} question={question} />
      ))}
    </div>
  )
}

function QuestionCard({ question }: { question: Question }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{question.question_text}</CardTitle>
        <CardDescription>
          {question.category} - {question.subcategory}
          <span className="ml-2 inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
            Difficulty: {question.difficulty}
          </span>
        </CardDescription>
      </CardHeader>
      <CardFooter>
        <Button asChild className="w-full">
          <a href={`/interview/session?questionId=${question.id}`}>Practice This Question</a>
        </Button>
      </CardFooter>
    </Card>
  )
}
