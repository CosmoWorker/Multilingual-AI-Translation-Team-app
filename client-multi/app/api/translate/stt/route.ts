import Groq from "groq-sdk";
import { NextResponse } from "next/server";

const groq= new Groq({
    apiKey: process.env.GROQ_API_KEY
});

export const POST= async(req: Request)=>{
    try{
        const formData= await req.formData();
        const audioFile= formData.get("audio") as Blob | null;
        const targetLang=formData.get("targetLang") as string | null;

        if(!audioFile){
            return NextResponse.json({
                error: "Missing audio file"
            }, {status: 400});
        }

        if(!targetLang){
            return NextResponse.json({
                error: "Missing target language"
            }, {status: 400});
        }

        const groqFormData= new FormData();
        groqFormData.append('file', audioFile, 'audio.webm');
        groqFormData.append('model', "whisper-large-v3");
        groqFormData.append('response_format', 'json');

        const txtResp= await fetch('https://api.groq.com/openai/v1/audio/transcriptions', {
            method: "POST",
            headers: {
                'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
            },
            body: groqFormData,
        });

        if(!txtResp.ok){
            const err=await txtResp.json();
            console.log("groq error in response", err);
            return NextResponse.json({
                error: err
            }, {status: txtResp.status});
        }

        const transcriptTxtResp= await txtResp.json();
        const  transcriptedText=transcriptTxtResp?.text;
        if (transcriptTxtResp){
            console.log("Transcript text received is : ", transcriptTxtResp);
        }else{
            console.log("Some issue with transcripted text");
        }

        const prompt= `Translate the following text to ${targetLang} : ${transcriptedText}`
        const systemPrompt="You are a highly accurate and concise translator. Your sole purpose is to translate the user's text to the specified language. Do not add any extra elements, notes, or explanations. Just provide the translated text with the given context."
        const translationResp= await groq.chat.completions.create({
            messages: [
                {
                    role: 'system',
                    content: systemPrompt
                },
                {
                    role: 'user',
                    content: prompt
                }
            ],
            model: 'llama-3.3-70b-versatile',
            temperature: 0.2
        });

        const translatedText=translationResp.choices[0].message.content;

        if(translatedText){
            console.log("Transated text received is: ",translatedText);
            return NextResponse.json({
                translatedText: translatedText  
            }, {status: 200})
        }else{
            console.log("Somme issue with translated text");
        }   

    }catch(e){
        console.log("SST error", e);
        return NextResponse.json({
            error: "Error in Translation audio failed"
        },{ status: 500 });
    }
}