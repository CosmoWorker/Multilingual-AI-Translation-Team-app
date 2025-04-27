'use client';

import { useRef, useState } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import { Upload } from "lucide-react";

const languages = [
    { value: "english", label: "English" },
    { value: "espanyol", label: "Spanish" },
    { value: "french", label: "French" },
    { value: "german", label: "German" },
    { value: "mandarin chinese", label: "Chinese" },
];

const defaultImage = "https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2";

export default function TranslateImage() {
    const [inputText, setInputText] = useState("");
    const [imgUrl, setImgUrl] = useState<string>(defaultImage);
    const [targetLang, setTargetLang] = useState("english");
    const [loading, setLoading] = useState(false);
    const [translatedDesc, setTranslatedDesc] = useState("");
    const fileInp = useRef<HTMLInputElement | null>(null);
    const [error, setError] = useState<string | null>(null);

    const triggerFileInp = () => {
        if (fileInp.current) {
            fileInp.current.click();
        }
    }

    const handleSubmit = async () => {
        if (!imgUrl || imgUrl === defaultImage) {
            setError("Upload the image before submitting");
            return;
        }

        setLoading(true);
        setTranslatedDesc('Processing...');
        setError(null);

        try {
            const response = await fetch("/api/translate/image", {
                method: "POST",
                headers: {
                    'Content-Type': "application/json"
                },
                body: JSON.stringify({
                    image: imgUrl,
                    inpPrompt: inputText,
                    targetLanguage: targetLang
                })
            })

            if (!response.ok) {
                const err = await response.json();
                console.log("issue in the response: ", err);
                setLoading(false);
                setTranslatedDesc("Issue analyzing the response");
                setError("Failed to analyze image. Please try again.");
                return;
            }

            const data = await response.json();
            console.log(data)
            console.log(data.imgDescription)
            if (data && data.imgDescription) {
                setTranslatedDesc(data.imgDescription);
                setLoading(false)
            } else {
                setTranslatedDesc("Issue setting response- FE");
                setError("Failed to analyze image. Please try again.");
            }
        } catch (e) {
            console.log("Unexpected Error in FE", e);
            setTranslatedDesc("Error processing image analysis");
            setError("Unexpected error occurred. Please try again.");
            setLoading(false);
        }
    }

    const handleImg = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            convertToBase64(file);
        }
    }

    const convertToBase64 = (file: File) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            const res = reader.result as string;
            setImgUrl(res);
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
                        AI-Powered Image Translation Analysis
                    </h1>
                    <p className="text-muted-foreground">
                        Upload an image and let AI describe and translate its content.
                    </p>
                </div>
                <Card className="p-6 bg-gradient-to-br from-blue-500/5 to-purple-500/5">
                    <div className="space-y-6">
                        <div>
                            <label htmlFor="inputText" className="block text-sm font-medium leading-none mb-2">
                                Additional Instructions
                            </label>
                            <Textarea
                                id="inputText"
                                placeholder="Enter any specific instructions for image analysis"
                                className="w-full"
                                value={inputText}
                                onChange={(e) => setInputText(e.target.value)}
                            />
                        </div>

                        <div>
                            <label htmlFor="targetLang" className="block text-sm font-medium leading-none mb-2">
                                Preferred Language for Translation
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

                        <div className="flex flex-col items-center justify-center">
                            {imgUrl && (
                                <div className="mb-4">
                                    <img src={imgUrl} alt="preview" className="rounded max-w-md max-h-60 object-cover" />
                                </div>
                            )}
                            <Button variant="outline" onClick={triggerFileInp}>
                                <Upload className="mr-2 h-4 w-4" />
                                Upload Image
                            </Button>
                            <input type="file" accept="image/*" className="hidden" ref={fileInp} onChange={handleImg} />
                        </div>

                        <Button onClick={handleSubmit} disabled={loading} className="w-full">
                            {loading ? "Processing..." : 'Translate Image Content'}
                        </Button>

                        {translatedDesc && (
                            <div>
                                <label htmlFor="translatedDesc" className="block text-sm font-medium leading-none mb-2">
                                    Translated Description
                                </label>
                                <Textarea
                                    id="translatedDesc"
                                    className="w-full min-h-[100px]"
                                    value={translatedDesc}
                                    readOnly
                                />
                            </div>
                        )}

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
