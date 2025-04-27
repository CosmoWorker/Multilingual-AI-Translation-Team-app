"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Languages, ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const languages = [
  { value: "english", label: "English" },
  { value: "espanyol", label: "Spanish" },
  { value: "french", label: "French" },
  { value: "german", label: "German" },
];

export default function TranslateText() {
  const [inputText, setInputText] = useState("");
  const [translateText, setTranslateText] = useState("");
  const [targetLang, setTargetLang] = useState("english");
  const [isTranslating, setIsTranslating] = useState(false);

  const handleInputText = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputText(event.target.value);
  };

  const handleLang = (value: string) => {
    setTargetLang(value);
  };

  const handleTranslate = async () => {
    if (!inputText.trim()) return;
    
    setIsTranslating(true);
    setTranslateText("Translating...");
    
    try {
      const response = await fetch("/api/translate/text", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: inputText,
          targetLang: targetLang,
        }),
      });

      if (!response.ok) {
        const err = await response.json();
        console.log("Translation error getting response", err);
        setTranslateText("Error translating after response");
        return;
      }
      
      const data = await response.json();
      setTranslateText(data.translatedText);
    } catch (e) {
      console.log(e);
      setTranslateText("Unexpected error occurred in client");
    } finally {
      setIsTranslating(false);
    }
  };

  return (
    <main className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold tracking-tight mb-4">
            AI-Powered Text Translation
          </h1>
          <p className="text-lg text-muted-foreground">
            Translate text between multiple languages with our advanced language models
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="p-6 bg-gradient-to-br from-blue-500/5 to-purple-500/5">
            <div className="space-y-6">
              <div>
                <label
                  htmlFor="inputText"
                  className="block text-sm font-medium leading-none mb-3"
                >
                  Enter Text
                </label>
                <textarea
                  id="inputText"
                  className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={inputText}
                  onChange={handleInputText}
                  placeholder="Type or paste your text here..."
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-4 items-end">
                <div className="w-full sm:w-[200px]">
                  <label
                    htmlFor="targetLang"
                    className="block text-sm font-medium leading-none mb-3"
                  >
                    Translate to
                  </label>
                  <Select value={targetLang} onValueChange={handleLang}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {languages.map((lang) => (
                        <SelectItem key={lang.value} value={lang.value}>
                          {lang.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  onClick={handleTranslate}
                  disabled={!inputText.trim() || isTranslating}
                  className="w-full sm:w-auto"
                >
                  <Languages className="mr-2 h-4 w-4" />
                  Translate
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>

              {translateText && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  transition={{ duration: 0.3 }}
                >
                  <label
                    htmlFor="translateText"
                    className="block text-sm font-medium leading-none mb-3"
                  >
                    Translated Text
                  </label>
                  <textarea
                    id="translateText"
                    className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    value={translateText}
                    readOnly
                  />
                </motion.div>
              )}
            </div>
          </Card>
        </motion.div>
      </div>
    </main>
  );
}