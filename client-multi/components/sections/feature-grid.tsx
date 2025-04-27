"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Mic, Languages, Image, Sparkles, Layers, Globe, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

type Feature = {
  title: string;
  description: string;
  icon: React.ReactNode;
  bgClass: string;
  path: string;
};

const features: Feature[] = [
  {
    title: 'Text to Speech',
    description: 'Convert any text into natural-sounding speech with multiple voices and languages.',
    icon: <MessageSquare className="h-6 w-6" />,
    bgClass: 'bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-900/10',
    path: '/text-to-speech',
  },
  {
    title: 'Speech to Text',
    description: 'Transcribe speech to text with high accuracy in multiple languages and dialects.',
    icon: <Mic className="h-6 w-6" />,
    bgClass: 'bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-900/10',
    path: '/speech-to-text',
  },
  {
    title: 'Text to Text',
    description: 'Translate between multiple languages & paraphrase text with our advanced language models seamlessly.',
    icon: <Languages className="h-6 w-6" />,
    bgClass: 'bg-gradient-to-br from-teal-50 to-teal-100 dark:from-teal-900/20 dark:to-teal-900/10',
    path: '/text-to-text',
  },
  {
    title: 'Image to Text',
    description: 'Extract text from images or get detailed descriptions with translations of image content.',
    icon: <Image className="h-6 w-6" />,
    bgClass: 'bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-900/10',
    path: '/image-to-text',
  },
];

const additionalFeatures = [
  {
    title: 'AI-Powered',
    description: 'State-of-the-art AI models provide exceptional accuracy and natural results.',
    icon: <Sparkles className="h-5 w-5 text-amber-500" />,
  },
  {
    title: 'Multi-Modal',
    description: 'Seamlessly convert between different communication formats in one platform.',
    icon: <Layers className="h-5 w-5 text-blue-500" />,
  },
  {
    title: '100+ Languages',
    description: 'Support for over 100 languages across all our communication tools.',
    icon: <Globe className="h-5 w-5 text-green-500" />,
  },
  {
    title: 'Lightning Fast',
    description: 'State of the art models with incredibly fast inference & compute speed.',
    icon: <Zap className="h-5 w-5 text-purple-500" />,
  },
];

export function FeatureGrid() {
  const [activeTab, setActiveTab] = useState('features');

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <section className="py-16 md:py-24">
      <div className="container">
        <div className="flex flex-col items-center text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl mb-4">
            Powerful Communication Tools
          </h2>
          <p className="text-muted-foreground text-lg max-w-[700px]">
            Discover our suite of AI-powered tools designed to transform how you communicate, 
            translate, and interpret content.
          </p>
        </div>

        <Tabs defaultValue="features" className="mx-auto max-w-4xl" 
          onValueChange={(value) => setActiveTab(value)}>
          <div className="flex justify-center mb-8">
            <TabsList>
              <TabsTrigger value="features">Core Features</TabsTrigger>
              <TabsTrigger value="use-cases">Use Cases</TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="features">
            <motion.div 
              variants={container}
              initial="hidden"
              animate={activeTab === 'features' ? "show" : "hidden"}
              className="grid gap-6 md:grid-cols-2"
            >
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  variants={item}
                  className={cn(
                    "rounded-xl border shadow-sm overflow-hidden transition-all hover:shadow-md",
                    feature.bgClass
                  )}
                >
                  <div className="p-6">
                    <div className="rounded-full w-12 h-12 flex items-center justify-center bg-background mb-4">
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground mb-4">{feature.description}</p>
                    <Button variant="outline" size="sm" className="mt-2">
                      Learn more
                    </Button>
                  </div>
                </motion.div>
              ))}
            </motion.div>
            
            <div className="mt-16">
              <h3 className="text-xl font-semibold text-center mb-8">Additional Capabilities</h3>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {additionalFeatures.map((feature, index) => (
                  <div
                    key={index}
                    className="flex flex-col items-center text-center p-4"
                  >
                    <div className="rounded-full w-10 h-10 flex items-center justify-center bg-muted mb-4">
                      {feature.icon}
                    </div>
                    <h4 className="font-medium mb-1">{feature.title}</h4>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="use-cases">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <UseCaseCard
                title="Content Creation"
                description="Create voiceovers for videos, podcasts, and presentations in multiple languages."
                industries={["Media", "Marketing", "Education"]}
              />
              <UseCaseCard
                title="Accessibility"
                description="Make content accessible to people with visual or hearing impairments."
                industries={["Education", "Government", "Healthcare"]}
              />
              <UseCaseCard
                title="Language Learning"
                description="Practice pronunciation and comprehension in foreign languages."
                industries={["Education", "Travel", "Personal"]}
              />
              <UseCaseCard
                title="Business Communication"
                description="Transcribe meetings and translate international communications."
                industries={["Corporate", "Legal", "Finance"]}
              />
              <UseCaseCard
                title="Image Processing"
                description="Extract text from scanned documents and images for further processing."
                industries={["Legal", "Finance", "Administrative"]}
              />
              <UseCaseCard
                title="Customer Support"
                description="Provide multilingual support and transcribe customer calls."
                industries={["Retail", "Technology", "Services"]}
              />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}

interface UseCaseCardProps {
  title: string;
  description: string;
  industries: string[];
}

function UseCaseCard({ title, description, industries }: UseCaseCardProps) {
  return (
    <div className="rounded-xl border bg-card p-6 shadow-sm">
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground mb-4">{description}</p>
      <div className="flex flex-wrap gap-2 mt-auto pt-2">
        {industries.map((industry, index) => (
          <span
            key={index}
            className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground"
          >
            {industry}
          </span>
        ))}
      </div>
    </div>
  );
}