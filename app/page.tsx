'use client'
import Image from "next/image";
import { useState } from "react";

export default function Home() {
  const [repoURL, setRepoURL] = useState('')


  function handleURLSubmit(){
    // fetch details from github url here.
    console.log("This URL is being sent by the user:", repoURL)

    setRepoURL('')
  }

  return (
    <div>
      <div>Hello There, paste in a repo url below</div>

      <form onSubmit={(e) => {
             e.preventDefault()
             handleURLSubmit()
      }}>
        <div>Enter URL here:</div>
        <input value={repoURL} onChange={(e) => {setRepoURL(e.target.value)}} type="text" required className="border py-2 px-2 rounded-md"/>
        <button type="submit">Search</button>


      </form>
    </div>
  );
}
