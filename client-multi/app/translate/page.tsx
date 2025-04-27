"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Languages, MessageSquare, Mic, Image, ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useAuth } from "@clerk/nextjs";

const translateOptions = [
  {
    href: "/translate/text",
    icon: <Languages className="h-6 w-6" />,
    title: "Text ↔ Text",
    description: "Translate text between multiple languages with our advanced language models",
    color: "from-blue-500/10 to-blue-500/5 hover:from-blue-500/20 hover:to-blue-500/10",
    iconColor: "text-blue-500",
  },
  {
    href: "/translate/tts",
    icon: <MessageSquare className="h-6 w-6" />,
    title: "Text ↔ Speech",
    description: "Convert text to natural-sounding speech or transcribe audio to text",
    color: "from-purple-500/10 to-purple-500/5 hover:from-purple-500/20 hover:to-purple-500/10",
    iconColor: "text-purple-500",
  },
  {
    href: "/translate/stt",
    icon: <Mic className="h-6 w-6" />,
    title: "Speech ↔ Text",
    description: "Real-time speech recognition and transcription in multiple languages",
    color: "from-teal-500/10 to-teal-500/5 hover:from-teal-500/20 hover:to-teal-500/10",
    iconColor: "text-teal-500",
  },
  {
    href: "/translate/image",
    icon: <Image className="h-6 w-6" />,
    title: "Image ↔ Text",
    description: "Extract and translate text from images with advanced OCR technology",
    color: "from-amber-500/10 to-amber-500/5 hover:from-amber-500/20 hover:to-amber-500/10",
    iconColor: "text-amber-500",
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function TranslateHome() {
    const {isLoaded, isSignedIn}= useAuth();

    if(!isLoaded){
        return <div className="container py-8">
            Loading...
        </div>
    }

    if (!isSignedIn){
        window.location.href="/sign-in"
        return;
    } 

  return (
    <main className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto text-center mb-12">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold tracking-tight mb-4"
        >
          Multilingual AI Translation Hub
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-lg text-muted-foreground"
        >
          Choose your preferred translation mode and experience the power of AI-driven communication
        </motion.p>
      </div>

      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid gap-6 md:grid-cols-2 max-w-4xl mx-auto"
      >
        {translateOptions.map((option) => (
          <motion.div key={option.href} variants={item}>
            <Link href={option.href} className="block">
              <Card className={`relative h-full p-6 transition-all duration-300 bg-gradient-to-br ${option.color} hover:shadow-lg group`}>
                <div className={`rounded-full w-12 h-12 flex items-center justify-center bg-background mb-4 ${option.iconColor}`}>
                  {option.icon}
                </div>
                <h2 className="text-xl font-semibold mb-2 group-hover:text-primary">
                  {option.title}
                </h2>
                <p className="text-muted-foreground mb-4">
                  {option.description}
                </p>
                <ArrowRight className="h-5 w-5 text-muted-foreground/50 group-hover:text-primary transition-transform group-hover:translate-x-1" />
              </Card>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </main>
  );
}