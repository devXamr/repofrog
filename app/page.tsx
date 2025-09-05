'use client'
import Image from "next/image";
import axios from "axios";
import { useState } from "react";
import { buildFileTree } from "./utils";

import FileTree from "@/components/file-tree-own";



export default function Home() {
  const [repoURL, setRepoURL] = useState('')
  const [fileTree, setFileTree] = useState()






  async function handleURLSubmit(){
    // fetch details from github url here.
    console.log("This URL is being sent by the user:", repoURL)
    const url = new URL(repoURL)
    const ownerName = url.pathname.split('/')[1]
    console.log("Owner name:", ownerName)
    const repoName = url.pathname.split('/')[2]
    console.log('Repo name:', repoName)

    const repoData = await axios.get(`https://api.github.com/repos/${ownerName}/${repoName}`)

    console.log("Data returned from github (Repo Metadata)", repoData)

    const recursiveFileTree = await axios.get(`https://api.github.com/repos/${ownerName}/${repoName}/git/trees/main?recursive=1`)

    console.log("Returned file tree (branch main): ", recursiveFileTree.data.tree)

    const formattedTree = buildFileTree(recursiveFileTree.data.tree)

    console.log("This is the formatted tree", formattedTree)
    setFileTree(formattedTree)
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


      <div>
        {fileTree && fileTree.map(each => <div>{each.path}</div>)}

        {fileTree && <FileTree
  elements={fileTree} // output of buildFileTree
  onSelect={(node) => {console.log("Some element has been selected", node)}}
/>}

      </div>
    </div>
  );
}


