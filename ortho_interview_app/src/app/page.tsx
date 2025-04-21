'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowRight } from 'lucide-react'

export default function HomePage() {
  return (
    <main className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="flex-1 flex flex-col items-center justify-center py-12 px-4 bg-gradient-to-b from-white to-blue-50">
        <div className="container max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-gray-900">
            Orthopedic Surgery Interview Coach
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-600 max-w-3xl mx-auto">
            AI-powered practice for your orthopedic surgery residency interviews. Get real-time feedback on both content and presentation skills.
          </p>
          <Button size="lg" asChild className="text-lg px-8 py-6">
            <a href="/interview">
              Start Practice Interview <ArrowRight className="ml-2 h-5 w-5" />
            </a>
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-white">
        <div className="container max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center">Features</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard 
              title="Mock Interviews" 
              description="Practice with realistic orthopedic surgery residency interview questions, including both behavioral and clinical topics."
              icon="🎯"
            />
            <FeatureCard 
              title="Real-time Feedback" 
              description="Receive instant feedback on both your content knowledge and presentation skills after each response."
              icon="📊"
            />
            <FeatureCard 
              title="Specialized Content" 
              description="Focus on orthopedic-specific topics like fracture classifications, surgical planning, and management of complex cases."
              icon="🦴"
            />
            <FeatureCard 
              title="Track Progress" 
              description="Monitor your improvement over time with detailed performance metrics and session history."
              icon="📈"
            />
            <FeatureCard 
              title="Follow-up Questions" 
              description="Experience realistic interview flow with dynamic follow-up questions based on your responses."
              icon="🔄"
            />
            <FeatureCard 
              title="Customizable" 
              description="Focus on specific areas of orthopedic surgery that you want to improve."
              icon="⚙️"
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-blue-50">
        <div className="container max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to ace your orthopedic surgery interview?</h2>
          <p className="text-xl mb-8 text-gray-600">
            Start practicing now and build confidence for your residency interviews.
          </p>
          <Button size="lg" asChild>
            <a href="/interview">Begin Practice</a>
          </Button>
        </div>
      </section>
    </main>
  )
}

function FeatureCard({ title, description, icon }: { title: string, description: string, icon: string }) {
  return (
    <Card className="h-full">
      <CardHeader>
        <div className="text-4xl mb-4">{icon}</div>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-base">{description}</CardDescription>
      </CardContent>
    </Card>
  )
}
