import Groq from "groq-sdk";
import { NextResponse } from "next/server";

const groq= new Groq({
    apiKey: process.env.GROQ_API_KEY
});

export const POST=async( req: Request)=>{
    const {image, inpPrompt, targetLanguage}= await req.json();
    if(!image && !inpPrompt && !targetLanguage){
        return NextResponse.json({
            error: "Missing parameters for request"
        }, {status: 400})
    }

    try{
        const userPrompt=`Answer the following descrption:${inpPrompt} in language:${targetLanguage}`
        const systemPrompt='You are a highly accurate descriptor/translator and follow what is asked. Your sole purpose is to translate/analyze the image with the given user description of what he wants without any fluff or notes, and by sounding natural.'
        const response=await groq.chat.completions.create({
            'messages':[
                {
                    "role":"system",
                    "content": systemPrompt
                },
                {
                    "role": "user",
                    "content":[
                        {
                            "type":"text",
                            "text": userPrompt
                        },
                        {
                            "type":"image_url",
                            "image_url":{
                                "url": image
                            }
                        },
                    ],
                },
            ],
            "model": "meta-llama/llama-4-maverick-17b-128e-instruct",
            "temperature": 0.9,
        });

        const imgTextResponse= response.choices[0].message.content;
        if(imgTextResponse){
            return NextResponse.json({
                imgDescription: imgTextResponse
            }, {status: 200});
        }else{
            return NextResponse.json({
                error: "Error with the text response"
            }, {status: 400})
        }

    }catch(e){
        console.log("Error in Analyzing/translating image", e);
        return NextResponse.json({
            error: "Image Translation Failed"
        }, {status: 500})
    }
}

