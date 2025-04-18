import Groq from "groq-sdk";
import { NextResponse } from "next/server";

const groq=new Groq({
    apiKey: process.env.GROQ_API_KEY
});

const voices=[];

export const POST=async(req: Request)=>{
    const {text, targetLang}=await req.json();

    if(!text || !targetLang){
        return NextResponse.json({
            error: "Missing text or target Language"
        },
            {status: 400}
        )
    }

    try{
        const prompt= `Translate the following text to ${targetLang} : ${text}`
        const systemPrompt="You are a highly accurate and concise translator. Your sole purpose is to translate the user's text to the specified language. Do not add any extra elements, notes, or explanations. Just provide the translated text with the given context."
        const txtResp= await groq.chat.completions.create({
            messages:[
                {
                    role: "system",
                    content: systemPrompt
                },
                {
                    role: "user",
                    content: prompt
                }   
            ],
            model: "llama-3.3-70b-versatile",
            temperature: 0.3,
        });
        const translatedText=txtResp.choices[0].message.content;
        if (translatedText){
            console.log("Translated Text:",translatedText);
        }else{
            console.log("Translation text not generated")
        }
        
        const audioResp= await fetch('https://api.groq.com/openai/v1/audio/speech', {
            method: "POST",
            headers:{
                'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: "playai-tts",
                input: translatedText,
                voice: "Chip-PlayAI",
            })
        });

        if(!audioResp.ok){
            const err=await audioResp.json();
            console.log('tts response issue', err);
            return;
        }
        const audioBuffer=await audioResp.arrayBuffer();

        return new NextResponse(audioBuffer, {
            headers:{
                'Content-Type': 'audio/mpeg',
                'Content-Length': audioBuffer.byteLength.toString(),
            },
        })

    }catch(e){
        console.log("TTS error",e);
        return NextResponse.json({
            error: "Translation Failed in TTS"
        }, 
        {
            status: 500
        })
    }
}
