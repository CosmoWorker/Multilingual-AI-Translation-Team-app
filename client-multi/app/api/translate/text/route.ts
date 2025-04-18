import Groq from "groq-sdk";
import { NextResponse } from "next/server";

const groq=new Groq({
    apiKey: process.env.GROQ_API_KEY
});

export const POST=async(req: Request)=>{
    const {text, targetLang}= await req.json();
    
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
        const response= await groq.chat.completions.create({
            messages:[
                {
                    role:"system",
                    content: systemPrompt
                },
                {
                    role: "user",
                    content: prompt
                }
            ],
            model: 'llama-3.3-70b-versatile',
            temperature: 0.2,
        });
        
        const translatedText=response.choices[0].message.content;
        if (translatedText){
            return NextResponse.json({
                translatedText
            },
            {
                status: 200
            })
        }
        else{
            return NextResponse.json({
                error: "Translation failed with no output"
            },
                {status: 500}
            )
        }
    }catch(e){
        console.log("Error during translation: ", e);
        return NextResponse.json({
            error: "Translation Failed"
        }, 
        {
            status: 500
        })
    }
    
}   

