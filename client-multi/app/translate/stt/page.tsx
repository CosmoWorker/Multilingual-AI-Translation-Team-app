'use client'

import { useRef, useState } from "react"

export default function translateSTT(){
    const [transcript, setTranscript]= useState("");
    const [targetLang, setTargetLang]=useState("english");
    const [isRecording, setIsRecording]=useState(false);
    const speechRecord = useRef<MediaRecorder | null>(null); 
    const audioChunks=useRef<Blob[]>([]);

    const startRecording= async ()=>{
        try{
            const stream= await navigator.mediaDevices.getUserMedia({audio: true});
            speechRecord.current=new MediaRecorder(stream);
            audioChunks.current=[];

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
                return;
            }

            const data= await response.json()
            if (data && data.transcribedText){
                setTranscript(data.transcribedText);
            }else{
                setTranscript("No transcription - issue");
            }

        }catch(e){
            console.log("Error sending audio",e);
            setTranscript("Unexpected Error")
        }
    }
    
    return (
        <main className="p-2 m-2">
            <h1 className="text-shadow-white font-bold text-2xl mx-2 mb-2">STT</h1>
            <button onClick={isRecording ? stopRecording : startRecording} className={`rounded p-2 mx-2 bg-blue-400 mb-2 cursor-pointer ${isRecording ? 'bg-red-600 animate-pulse': 'bg-blue-400 hover:shadow-zinc-500'}`}> 
                {isRecording ? 'Stop Recording' : "Start Recording"}
            </button>
            <div className="mx-1">
                <label htmlFor="targetLang" className="block font-semibold mb-2">Language for Translation</label>
                <select value={targetLang} onChange={(e)=>setTargetLang(e.target.value)} className="w-60 border-none outline-none rounded h-10 bg-gray-800">
                    <option value="english">English</option>
                    <option value="espanyol">Spanish</option>
                    <option value="french">French</option>
                    <option value="german">German</option>
                    <option value="arabic">Arabic</option>
                    <option value="hindi">Hindi</option>
                </select>
            </div>
            <div className="mx-2">
                <label htmlFor="transcript" className="block font-semibold text-amber-50 my-1">Transcribed Text: </label>
                <textarea value={transcript} readOnly className="w-lg bg-gray-700 rounded h-24 p-2 outline-none focus:shadow-amber-50"/>
            </div>
        </main>
    )    
}