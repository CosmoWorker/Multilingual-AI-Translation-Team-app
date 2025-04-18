'use client'

export default function TranslateHome(){
    return (
        <main>
            <h1 className="items-center p-3 m-2 text-2xl">Multilingual AI translators Options</h1>
            <p className="mx-2 px-3">Choose a translation mode: </p>
            <ul className="p-3 rounded mx-3 mt-2 gap-1 border w-2xs border-zinc-400 bg-gray-700">
                <li><a href="/translate/text" className="text-blue-500">Text ↔ Text</a></li>
                <li><a href="/translate/tts" className="text-blue-500">Text ↔ Speech</a></li>
                <li><a href="/translate/sst" className="text-blue-500">Speech ↔ Text</a></li>
            </ul>
        </main>
    )
}