'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import GameForm from '@/components/GameForm'
import OutputTabs from '@/components/OutputTabs'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { motion } from 'framer-motion'

export default function AppPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [output, setOutput] = useState<Record<string, unknown> | null>(null)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClient()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  const handleGenerate = async (formData: Record<string, unknown>) => {
    setIsLoading(true)
    setError(null)
    setOutput(null)

    const res = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    })

    const json = await res.json()

    if (!res.ok) {
      if (json.error === 'LIMIT_REACHED') {
        setError("You've used your 3 free generations today. Upgrade to Pro for unlimited access.")
      } else {
        setError('Something went wrong. Please try again.')
      }
    } else {
      setOutput(json.data)
    }

    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-background text-foreground">

      {/* Header */}
      <header className="relative z-10 border-b border-border/50 bg-background/80 backdrop-blur-sm px-6 py-4 flex items-center justify-between sticky top-0">
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold text-primary">GGLoadout</span>
          <Badge variant="secondary" className="text-xs">Beta</Badge>
        </div>
        <Button variant="ghost" size="sm" onClick={handleSignOut} className="text-muted-foreground hover:text-foreground">
          Sign out
        </Button>
      </header>

      <main className="relative z-10 max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Form card */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Card className="bg-card border-border/50 shadow-none h-full">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg">Your Game Details</CardTitle>
                <CardDescription>Fill in once, get copy for all platforms.</CardDescription>
              </CardHeader>
              <CardContent>
                <GameForm onGenerate={handleGenerate} isLoading={isLoading} />
              </CardContent>
            </Card>
          </motion.div>

          {/* Output card */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <Card className="bg-card border-border/50 shadow-none h-full">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg">Generated Copy</CardTitle>
                <CardDescription>Ready to paste into your store pages.</CardDescription>
              </CardHeader>
              <CardContent>
                {!output && !error && !isLoading && (
                  <div className="flex flex-col items-center justify-center h-64 text-center text-muted-foreground">
                    <span className="text-4xl mb-3">🎮</span>
                    <p className="text-sm">Fill in your game details and hit Generate to see your copy here.</p>
                  </div>
                )}

                {isLoading && (
                  <div className="flex flex-col items-center justify-center h-64 text-center text-muted-foreground">
                    <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mb-3" />
                    <p className="text-sm">Writing your copy...</p>
                  </div>
                )}

                {error && (
                  <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-4">
                    <p className="text-sm text-destructive">{error}</p>
                    {error.includes('Upgrade') && (
                      <Button className="mt-3 bg-primary hover:bg-primary/90 text-primary-foreground text-sm" size="sm">
                        Upgrade to Pro — $9/mo
                      </Button>
                    )}
                  </div>
                )}

                {output && <OutputTabs data={output as Parameters<typeof OutputTabs>[0]['data']} />}
              </CardContent>
            </Card>
          </motion.div>

        </div>
      </main>
    </div>
  )
}
