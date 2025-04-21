'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Plus, Edit, Trash2, Search } from 'lucide-react'
import { Question, getQuestions } from '@/lib/database'

export default function AdminPage() {
  const [questions, setQuestions] = useState<Question[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null)

  useEffect(() => {
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

  const filteredQuestions = questions.filter(question => 
    question.question_text.toLowerCase().includes(searchQuery.toLowerCase()) ||
    question.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    question.subcategory.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleAddQuestion = (newQuestion: Omit<Question, 'id'>) => {
    // In a real implementation, this would call an API to add the question
    // For now, we'll just update the local state
    const mockId = `q${questions.length + 1}`
    const questionWithId = { ...newQuestion, id: mockId } as Question
    setQuestions([...questions, questionWithId])
    setIsAddDialogOpen(false)
  }

  const handleEditQuestion = (updatedQuestion: Question) => {
    // In a real implementation, this would call an API to update the question
    // For now, we'll just update the local state
    const updatedQuestions = questions.map(q => 
      q.id === updatedQuestion.id ? updatedQuestion : q
    )
    setQuestions(updatedQuestions)
    setIsEditDialogOpen(false)
    setCurrentQuestion(null)
  }

  const handleDeleteQuestion = (id: string) => {
    // In a real implementation, this would call an API to delete the question
    // For now, we'll just update the local state
    const updatedQuestions = questions.filter(q => q.id !== id)
    setQuestions(updatedQuestions)
  }

  return (
    <main className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Add Question
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <QuestionForm onSubmit={handleAddQuestion} onCancel={() => setIsAddDialogOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="grid gap-6 md:grid-cols-4 mb-8">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Filters</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger id="category">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="behavioral">Behavioral</SelectItem>
                  <SelectItem value="clinical">Clinical</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="search">Search</Label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Search questions..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="md:col-span-3">
          <CardHeader>
            <CardTitle>Question Management</CardTitle>
            <CardDescription>
              {filteredQuestions.length} questions found
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">Loading questions...</div>
            ) : filteredQuestions.length === 0 ? (
              <div className="text-center py-8">No questions found.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="py-3 px-4 text-left font-medium">Question</th>
                      <th className="py-3 px-4 text-left font-medium">Category</th>
                      <th className="py-3 px-4 text-left font-medium">Subcategory</th>
                      <th className="py-3 px-4 text-left font-medium">Difficulty</th>
                      <th className="py-3 px-4 text-left font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredQuestions.map((question) => (
                      <tr key={question.id} className="border-b">
                        <td className="py-3 px-4 max-w-xs truncate">{question.question_text}</td>
                        <td className="py-3 px-4">{question.category}</td>
                        <td className="py-3 px-4">{question.subcategory}</td>
                        <td className="py-3 px-4">{question.difficulty}/5</td>
                        <td className="py-3 px-4">
                          <div className="flex space-x-2">
                            <Dialog open={isEditDialogOpen && currentQuestion?.id === question.id} onOpenChange={(open) => {
                              setIsEditDialogOpen(open)
                              if (!open) setCurrentQuestion(null)
                            }}>
                              <DialogTrigger asChild>
                                <Button variant="outline" size="sm" onClick={() => setCurrentQuestion(question)}>
                                  <Edit className="h-4 w-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="sm:max-w-[600px]">
                                {currentQuestion && (
                                  <QuestionForm 
                                    initialData={currentQuestion} 
                                    onSubmit={handleEditQuestion} 
                                    onCancel={() => {
                                      setIsEditDialogOpen(false)
                                      setCurrentQuestion(null)
                                    }} 
                                  />
                                )}
                              </DialogContent>
                            </Dialog>
                            <Button variant="outline" size="sm" className="text-red-500" onClick={() => handleDeleteQuestion(question.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  )
}

interface QuestionFormProps {
  initialData?: Question
  onSubmit: (question: any) => void
  onCancel: () => void
}

function QuestionForm({ initialData, onSubmit, onCancel }: QuestionFormProps) {
  const [formData, setFormData] = useState({
    question_text: initialData?.question_text || '',
    category: initialData?.category || 'behavioral',
    subcategory: initialData?.subcategory || '',
    difficulty: initialData?.difficulty || 3
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: name === 'difficulty' ? parseInt(value) : value
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (initialData) {
      onSubmit({ ...formData, id: initialData.id })
    } else {
      onSubmit(formData)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <DialogHeader>
        <DialogTitle>{initialData ? 'Edit Question' : 'Add New Question'}</DialogTitle>
        <DialogDescription>
          {initialData 
            ? 'Update the question details below.' 
            : 'Fill in the details to add a new interview question.'}
        </DialogDescription>
      </DialogHeader>
      <div className="grid gap-4 py-4">
        <div className="space-y-2">
          <Label htmlFor="question_text">Question</Label>
          <Textarea
            id="question_text"
            name="question_text"
            placeholder="Enter the interview question"
            value={formData.question_text}
            onChange={handleChange}
            className="min-h-[100px]"
            required
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select 
              value={formData.category} 
              onValueChange={(value) => setFormData({...formData, category: value})}
            >
              <SelectTrigger id="category">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="behavioral">Behavioral</SelectItem>
                <SelectItem value="clinical">Clinical</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="subcategory">Subcategory</Label>
            <Input
              id="subcategory"
              name="subcategory"
              placeholder="E.g., fractures, motivation"
              value={formData.subcategory}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="difficulty">Difficulty (1-5)</Label>
          <Select 
            value={formData.difficulty.toString()} 
            onValueChange={(value) => setFormData({...formData, difficulty: parseInt(value)})}
          >
            <SelectTrigger id="difficulty">
              <SelectValue placeholder="Select difficulty" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">1 - Very Easy</SelectItem>
              <SelectItem value="2">2 - Easy</SelectItem>
              <SelectItem value="3">3 - Moderate</SelectItem>
              <SelectItem value="4">4 - Difficult</SelectItem>
              <SelectItem value="5">5 - Very Difficult</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {initialData ? 'Save Changes' : 'Add Question'}
        </Button>
      </DialogFooter>
    </form>
  )
}
