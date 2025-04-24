'use client'

import { useState } from "react"

export default function TranslateTTS(){
    const [inputText, setInputText]=useState("");
    const [targetLang, setTargetLang]=useState("english");
    const [audioUrl, setAudioUrl]=useState<string|null>(null);
    const [loading, setLoading]=useState(false);

    const handleSubmit=async()=>{
        if (!inputText){
            setInputText("Please enter text to hear translation...")
            return;
        }
        setLoading(true);
        setAudioUrl(null);

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
                setAudioUrl(null);
                setLoading(false);
                return;
            }
            const audioBlob= await response.blob();
            setAudioUrl(URL.createObjectURL(audioBlob));

        }catch(e){
            console.log("Unexpected error in tts FE", e);
            setAudioUrl(null);
        }finally{
            setLoading(false);
        }
    }

    return (
        <main className="p-2 m-2">
            <h1 className="text-2xl font-bold mx-4 my-2 self-center">TTS</h1>
            <textarea 
                className="w-2xl h-20 bg-gray-800 rounded p-2"
                placeholder="Enter text to be translated"
                value={inputText}
                onChange={(e)=>setInputText(e.target.value)}
            />

            <div className="m-2">
                <label htmlFor="targetLang" className="block font-semibold mb-2">Language for Translation</label>
                <select value={targetLang} onChange={(e)=>setTargetLang(e.target.value)} id="targetLang" className="w-60 border-none outline-none rounded h-10 bg-gray-800">
                    <option value="english">English</option>
                    <option value="espanyol">Spanish</option>
                    <option value="french">French</option>
                    <option value="german">German</option>
                    <option value="arabic">Arabic</option>
                </select>
            </div>

            <button
                onClick={handleSubmit}
                className="bg-blue-400 rounded p-2 hover:shadow-zinc-500 text-shadow-amber-50 m-2 cursor-pointer"
                disabled={loading}
            >
                {loading ? "Synthesizing..." : "Generate Translation"}
            </button>

            {audioUrl && (
                <div className="m-3">
                    <audio controls src={audioUrl}/>
                </div>
            )}

        </main>
    )    
}