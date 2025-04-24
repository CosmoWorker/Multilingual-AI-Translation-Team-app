'use client';

import { useRef, useState } from "react";

export default function TranslateImage(){
    const [inputText, setInputText]= useState("");
    const [imgUrl, setImgUrl]=useState<string>("");
    const [targetLang, setTargetLang]=useState("english");
    const [loading, setLoading]=useState(false);
    const [translatedDesc, setTranslatedDesc]=useState("");
    const fileInp=useRef<HTMLInputElement| null>(null);

    const triggerFileInp=()=>{
        if(fileInp.current){
            fileInp.current.click();
        }
    }

    const handleSubmit=async()=>{
        if (!imgUrl){
            alert("Upload the image before submitting");
            return;
        }

        setLoading(true);
        setTranslatedDesc('processing...')

        try{
            const response= await fetch("/api/translate/image", {
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

            if (!response.ok){
                const err=await response.json();
                console.log("issue in the response: ", err);
                setLoading(false);
                setTranslatedDesc("Issue analyzing the response");
                return;
            }

            const data=await response.json();
            console.log(data)
            console.log(data.imgDescription)
            if(data && data.imgDescription){
                setTranslatedDesc(data.imgDescription);
                setLoading(false)
            }else{
                setTranslatedDesc("Issue setting response- FE");
            }
        }catch(e){
            console.log("Unexpected Error in FE", e);
            setTranslatedDesc("Error processing image analysis");
            setLoading(false);
        }
    }

    const handleImg=(event: React.ChangeEvent<HTMLInputElement>)=>{
        const file=event.target.files?.[0];
        if(file){
            convertToBase64(file);
        }
    }

    const convertToBase64=(file: File)=>{
        const reader= new FileReader();
        reader.readAsDataURL(file);
        reader.onload=()=>{
            const res=reader.result as string;
            setImgUrl(res);
        }
    }

    return (
        <main className="px-1">
            <h1 className="text-2xl font-bold my-1.5">Image Translation Analysis</h1>
            <textarea
                className="mx-0.75 w-md h-20 my-0.5 bg-gray-700 p-2"
                placeholder="Enter text for any info"
                value={inputText}
                onChange={(e)=>setInputText(e.target.value)}
            />
            <div className="m-2">
                <label htmlFor="targetLang" className="block my-0.75">Preferred Langauge for translation: </label>
                <select className="w-60 border-none outline-none rounded h-10 bg-gray-700" value={targetLang} onChange={(e)=>setTargetLang(e.target.value)}>
                    <option value="english">English</option>
                    <option value="espanyol">Spanish</option>
                    <option value="french">French</option>
                    <option value="german">German</option>
                    <option value="mandarin chinese">Chinese</option>
                </select>
            </div>
            {imgUrl && (
                <div className="m-2">
                    <img src={imgUrl} alt="preview" className="rounded m-1 max-w-md max-h-30"/>
                </div>
            )}
            <div className="flex m-2">
                <button onClick={triggerFileInp} className="rounded border-1 p-2 opacity-85 m-2 hover:cursor-pointer w-50 hover:opacity-55">Upload the Image</button>
                <input type="file" accept="image/*" className="hidden" ref={fileInp} onChange={handleImg}/>
            </div>

            <button onClick={handleSubmit} className="rounded border-none bg-blue-500 p-2 hover:cursor-pointer m-2">{loading? "Processing...": 'Translate Image Content'}</button>
            {translatedDesc && (
                <textarea 
                    className="w-md rounded border-none outline-none bg-gray-700 block m-1 p-2 h-30"
                    value={translatedDesc}
                    readOnly
                />
            )}
        </main> 
    )
} 