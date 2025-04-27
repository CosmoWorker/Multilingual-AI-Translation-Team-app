'use client'

import { useRef, useState } from "react"
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
import { Mic, MicOff } from "lucide-react";

const languages = [
    { value: "english", label: "English" },
    { value: "espanyol", label: "Spanish" },
    { value: "french", label: "French" },
    { value: "german", label: "German" },
    { value: "arabic", label: "Arabic" },
    { value: "hindi", label: "Hindi" },
];

export default function TranslateSTT(){
    const [transcript, setTranscript]= useState("");
    const [targetLang, setTargetLang]=useState("english");
    const [isRecording, setIsRecording]=useState(false);
    const speechRecord = useRef<MediaRecorder | null>(null); 
    const audioChunks=useRef<Blob[]>([]);
    const [error, setError] = useState<string | null>(null);

    const startRecording= async ()=>{
        try{
            const stream= await navigator.mediaDevices.getUserMedia({audio: true});
            speechRecord.current=new MediaRecorder(stream);
            audioChunks.current=[];
            setError(null);

            speechRecord.current.ondataavailable=(event)=>{
                if(event.data.size > 0){
                    audioChunks.current.push(event.data);
                }
            };

            speechRecord.current.onstop=async()=>{
                const audioBlob=new Blob(audioChunks.current, 
                    {
                        type: 'audio/webm'
                    });
                await sendAudioToBE(audioBlob);
            }

            speechRecord.current.start();
            setIsRecording(true);
        }catch(e){  
            console.log("Error accessing audio through mic FE", e);
            setError("Error accessing microphone. Please check your permissions.");
            setIsRecording(false);
        };
    }

    const stopRecording = ()=>{
        if(speechRecord.current && speechRecord.current.state === "recording"){
            speechRecord.current.stop();
            setIsRecording(false);
        }
    };

    const sendAudioToBE= async (audioBlob: Blob)=>{
        setTranscript("Translating...");
        const formData= new FormData();
        formData.append('audio', audioBlob, 'audio.webm');
        formData.append('targetLang', targetLang);

        try{
            const response= await fetch('/api/translate/stt', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok){
                const err=await response.json();
                console.log("Error in response FE", err);
                setTranscript("Response Error");
                setError("Failed to transcribe audio. Please try again.");
                return;
            }

            const data= await response.json()
            if (data && data.translatedText){
                setTranscript(data.translatedText);
            }else{
                setTranscript("Transcription translation - issue");
                setError("Failed to transcribe audio. Please try again.");
            }

        }catch(e){
            console.log("Error sending audio",e);
            setTranscript("Unexpected Error");
            setError("Unexpected error occurred. Please try again.");
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
                        AI-Powered Speech-to-Text
                    </h1>
                    <p className="text-muted-foreground">
                        Real-time speech recognition and transcription in multiple languages.
                    </p>
                </div>
                <Card className="p-6 bg-gradient-to-br from-blue-500/5 to-purple-500/5">
                    <div className="space-y-4">
                        <Button
                            onClick={isRecording ? stopRecording : startRecording}
                            className="w-full"
                        >
                            {isRecording ? (
                                <>
                                    <MicOff className="mr-2 h-4 w-4 animate-pulse" />
                                    Stop Recording
                                </>
                            ) : (
                                <>
                                    <Mic className="mr-2 h-4 w-4" />
                                    Start Recording
                                </>
                            )}
                        </Button>

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

                        <div>
                            <label htmlFor="transcript" className="block text-sm font-medium leading-none mb-2">
                                Transcribed Text
                            </label>
                            <textarea
                                id="transcript"
                                className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                value={transcript}
                                readOnly
                                placeholder="Your transcribed text will appear here..."
                            />
                        </div>

                        {error && (
                            <div className="text-red-500 mt-2">
                                {error}
                            </div>
                        )}
                    </div>
                </Card>
            </motion.div>
        </main>
    )    
}
