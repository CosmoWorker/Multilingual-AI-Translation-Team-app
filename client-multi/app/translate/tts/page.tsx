'use client'

import { useState } from "react"
import { motion } from "framer-motion";
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
  { value: "arabic", label: "Arabic" },
];

export default function TranslateTTS(){
    const [inputText, setInputText]=useState("");
    const [targetLang, setTargetLang]=useState("english");
    const [audioUrl, setAudioUrl]=useState<string|null>(null);
    const [loading, setLoading]=useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit=async()=>{
        if (!inputText){
            setInputText("Please enter text to hear translation...")
            return;
        }
        setLoading(true);
        setAudioUrl(null);
        setError(null);

        try{
            const response=await fetch("/api/translate/tts/",{
                method: "POST",
                headers:{
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    text: inputText,
                    targetLang: targetLang
                })
            });

            if(!response.ok){
                const e=await response.json();
                console.log("issue getting response",e);
                setError("Failed to generate translation. Please try again.");
                setAudioUrl(null);
                setLoading(false);
                return;
            }
            const audioBlob= await response.blob();
            setAudioUrl(URL.createObjectURL(audioBlob));

        }catch(e){
            console.log("Unexpected error in tts FE", e);
            setError("Unexpected error occurred. Please try again.");
            setAudioUrl(null);
        }finally{
            setLoading(false);
        }
    }

    return (
        <main className="container mx-auto px-4 py-12">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-3xl mx-auto"
            >
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold tracking-tight">
                        AI-Powered Text-to-Speech
                    </h1>
                    <p className="text-muted-foreground">
                        Convert text to natural-sounding speech in multiple languages.
                    </p>
                </div>
                <Card className="p-6 bg-gradient-to-br from-blue-500/5 to-purple-500/5">
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="inputText" className="block text-sm font-medium leading-none mb-2">
                                Enter Text
                            </label>
                            <textarea
                                id="inputText"
                                className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                placeholder="Enter text to be translated"
                                value={inputText}
                                onChange={(e)=>setInputText(e.target.value)}
                            />
                        </div>

                        <div>
                            <label htmlFor="targetLang" className="block text-sm font-medium leading-none mb-2">
                                Language for Translation
                            </label>
                            <Select value={targetLang} onValueChange={(value) => setTargetLang(value)}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select a language" />
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
                            onClick={handleSubmit}
                            disabled={loading}
                        >
                            {loading ? "Synthesizing..." : "Generate Translation"}
                        </Button>

                        {error && (
                            <div className="text-red-500 mt-2">
                                {error}
                            </div>
                        )}

                        {audioUrl && (
                            <div className="mt-4">
                                <audio controls src={audioUrl} className="w-full"/>
                            </div>
                        )}
                    </div>
                </Card>
            </motion.div>
        </main>
    )    
}
