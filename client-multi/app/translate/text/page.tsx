'use client';

import React, { useState } from "react";

export default function TranslateText(){
  const [inputText, setInputText]=useState("");
  const [translateText, setTranslateText]=useState("")
  const [targetLang, setTargetLang]=useState("english");

  const handleInputText=(event: React.ChangeEvent<HTMLTextAreaElement>)=>{
    setInputText(event.target.value);
  }

  const handleLang=(event: React.ChangeEvent<HTMLSelectElement>)=>{
    setTargetLang(event.target.value);
  }

  const handleTranslate = async() => {
    setTranslateText("Translating...")
    try{
      const response= await fetch('/api/translate/text', {
        method: "POST",
        headers:{
          'Content-Type': "application/json"
        },
        body: JSON.stringify({
          text: inputText,
          targetLang: targetLang
        })
      })

      if(!response.ok){
        const err=await response.json();
        console.log("Translation error getting response", err);
        setTranslateText("Error translating after response");
        return;
      }
      const data=await response.json();
      setTranslateText(data.translatedText);
    }catch(e){ 
      console.log(e);
      setTranslateText("Unexpected error occured in client");
    }
  }

  return(
    <main>
      <h1 className="text-2xl mb-5 ml-5">Multilingual AI translator</h1>
      <div className="mx-2.5">
        <label htmlFor="inputText" className="block text-zinc-400 text-sm font-semibold mb-2">
          Enter Text: 
        </label>
        <textarea
          id="inputText"
          className="shadow appearance-none rounded w-full bg-gray-800 px-2 py-1.5 border-none outline-none text-gray-100 focus:shadow-gray-200"
          rows={4}
          value={inputText}
          onChange={handleInputText}
        />
      </div>
      <div className="mb-3 mx-2.5">
        <label htmlFor="targetLang" className="block text-zinc-400 text-sm font-semibold mb-1.5"> Translate to </label>
        <select id="targetLang" className="w-md bg-gray-800 border-none rounded outline-none focus:shadow-gray-400 h-7"
          onChange={handleLang}
          value={targetLang}
        >
          <option value="english">English</option>
          <option value="espanyol">Spanish</option>
          <option value="french">French</option>
          <option value="german">German</option>
        </select>
      </div>
      <button className="bg-blue-700 rounded-md p-1.5 border-solid mx-2 hover:shadow-blue-400" onClick={handleTranslate}>
        Translate
      </button>
      {translateText && (
        <div className="mx-2.5 mt-3">
          <label htmlFor="translateText" className="block text-zinc-400 text-sm font-semibold">Translated Text :</label>
          <textarea id="translateText" className="bg-gray-800 rounded p-2 w-full outline-none focus:shadow-gray-300" value={translateText} readOnly/>
        </div>
      )}
    </main>
  )
}