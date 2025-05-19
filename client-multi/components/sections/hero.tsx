"use client";

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Mic, MessageSquare, Languages, Image } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export function HeroSection() {
  return (
    <section className="py-12 md:py-20">
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
          <div className="flex flex-col justify-center space-y-4">
            <div className="space-y-2">
              <Badge variant="outline" className="mb-2 border-primary/20 bg-primary/10 text-primary">
                Introducing PolyComm
              </Badge>
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                  Communication
                </span>{" "}
                Without Boundaries
              </h1>
              <p className="max-w-[600px] text-muted-foreground md:text-xl">
                Transform how you communicate with our powerful AI-driven tools for text-to-speech, 
                speech-to-text, translation, and image description and much more.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Button size="lg" asChild>
                <Link href="/translate">Get Started</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="https://www.loom.com/share/9c187edad4ad4406b546a6ceee313bca?sid=a0400c92-c45c-4642-a07c-ea6d8d7a81a3">See Demo</Link>
              </Button>
            </div>
          </div>
          <div className="relative hidden md:block">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 opacity-20 blur-3xl rounded-[32px]" />
            <div className="relative flex items-center justify-center rounded-[32px] border bg-background p-6 shadow-lg">
              <div className="grid gap-8 grid-cols-2">
                <FeatureCard
                  icon={<MessageSquare className="h-10 w-10 text-blue-500" />}
                  title="Text to Speech"
                  description="Convert text to natural-sounding speech in multiple languages and voices."
                  delay={0.1}
                />
                <FeatureCard
                  icon={<Mic className="h-10 w-10 text-purple-500" />}
                  title="Speech to Text"
                  description="Transcribe spoken words to text with high accuracy in real-time."
                  delay={0.2}
                />
                <FeatureCard
                  icon={<Languages className="h-10 w-10 text-teal-500" />}
                  title="Text to Text"
                  description="Translate and transform text between multiple languages."
                  delay={0.3}
                />
                <FeatureCard
                  icon={<Image className="h-10 w-10 text-amber-500" />}
                  title="Image to Text"
                  description="Extract and describe text content from images with precision."
                  delay={0.4}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay: number;
}

function FeatureCard({ icon, title, description, delay }: FeatureCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      className="rounded-xl border bg-card p-4 shadow-sm"
    >
      <div className="mb-2">{icon}</div>
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </motion.div>
  );
}