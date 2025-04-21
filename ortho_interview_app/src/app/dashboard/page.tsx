'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Clock, Calendar, Award, ArrowUpRight } from 'lucide-react'

// Mock data - would be fetched from API in real implementation
const mockSessions = [
  { id: '1', date: '2025-04-20', topic: 'General', contentScore: 82, presentationScore: 78 },
  { id: '2', date: '2025-04-18', topic: 'Fractures', contentScore: 79, presentationScore: 81 },
  { id: '3', date: '2025-04-15', topic: 'Behavioral', contentScore: 90, presentationScore: 85 },
  { id: '4', date: '2025-04-12', topic: 'Clinical', contentScore: 75, presentationScore: 70 },
  { id: '5', date: '2025-04-10', topic: 'Fractures', contentScore: 77, presentationScore: 72 },
]

const mockPerformanceData = [
  { name: 'Session 1', content: 82, presentation: 78 },
  { name: 'Session 2', content: 79, presentation: 81 },
  { name: 'Session 3', content: 90, presentation: 85 },
  { name: 'Session 4', content: 75, presentation: 70 },
  { name: 'Session 5', content: 77, presentation: 72 },
]

const mockWeakAreas = [
  { topic: 'Tibial Plateau Fractures', score: 65 },
  { topic: 'Mangled Extremity Management', score: 70 },
  { topic: 'Supracondylar Fractures', score: 72 },
]

export default function DashboardPage() {
  const [sessions, setSessions] = useState(mockSessions)
  const [performanceData, setPerformanceData] = useState(mockPerformanceData)
  const [weakAreas, setWeakAreas] = useState(mockWeakAreas)
  const [loading, setLoading] = useState(false)

  // Calculate average scores
  const avgContentScore = Math.round(
    sessions.reduce((sum, session) => sum + session.contentScore, 0) / sessions.length
  )
  
  const avgPresentationScore = Math.round(
    sessions.reduce((sum, session) => sum + session.presentationScore, 0) / sessions.length
  )

  const totalScore = Math.round((avgContentScore + avgPresentationScore) / 2)

  return (
    <main className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Your Dashboard</h1>
      
      <div className="grid gap-6 md:grid-cols-3 mb-8">
        <StatsCard 
          title="Total Sessions" 
          value={sessions.length.toString()} 
          description="Practice sessions completed"
          icon={<Clock className="h-5 w-5 text-blue-500" />}
        />
        <StatsCard 
          title="Average Score" 
          value={`${totalScore}%`} 
          description="Overall performance"
          icon={<Award className="h-5 w-5 text-green-500" />}
        />
        <StatsCard 
          title="Last Session" 
          value={sessions[0]?.date ? new Date(sessions[0].date).toLocaleDateString() : 'N/A'} 
          description={sessions[0]?.topic || 'No sessions yet'}
          icon={<Calendar className="h-5 w-5 text-purple-500" />}
        />
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 mb-8">
        <Card className="col-span-2 md:col-span-1">
          <CardHeader>
            <CardTitle>Performance Metrics</CardTitle>
            <CardDescription>Your scores over time</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={performanceData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Bar dataKey="content" name="Content" fill="#2563EB" />
                <Bar dataKey="presentation" name="Presentation" fill="#10B981" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Areas for Improvement</CardTitle>
            <CardDescription>Topics to focus on</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {weakAreas.map((area, index) => (
              <div key={index}>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">{area.topic}</span>
                  <span className="text-sm font-medium">{area.score}%</span>
                </div>
                <Progress value={area.score} className="h-2" />
              </div>
            ))}
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">
              Practice These Topics
            </Button>
          </CardFooter>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Recent Sessions</CardTitle>
          <CardDescription>Your interview practice history</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="py-3 px-4 text-left font-medium">Date</th>
                  <th className="py-3 px-4 text-left font-medium">Topic</th>
                  <th className="py-3 px-4 text-left font-medium">Content Score</th>
                  <th className="py-3 px-4 text-left font-medium">Presentation Score</th>
                  <th className="py-3 px-4 text-left font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {sessions.map((session) => (
                  <tr key={session.id} className="border-b">
                    <td className="py-3 px-4">{new Date(session.date).toLocaleDateString()}</td>
                    <td className="py-3 px-4">{session.topic}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center">
                        <span className="mr-2">{session.contentScore}%</span>
                        <Progress value={session.contentScore} className="h-2 w-16" />
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center">
                        <span className="mr-2">{session.presentationScore}%</span>
                        <Progress value={session.presentationScore} className="h-2 w-16" />
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <Button variant="ghost" size="sm" asChild>
                        <a href={`/dashboard/session/${session.id}`}>
                          <ArrowUpRight className="h-4 w-4" />
                        </a>
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
        <CardFooter>
          <Button variant="outline" className="w-full">
            View All Sessions
          </Button>
        </CardFooter>
      </Card>
    </main>
  )
}

function StatsCard({ title, value, description, icon }: { 
  title: string, 
  value: string, 
  description: string,
  icon: React.ReactNode
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  )
}
