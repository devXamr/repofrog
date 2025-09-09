"use client";
import axios from "axios";
import { useState } from "react";
import { buildFileTree } from "./utils";

import FileTree, { nodeType } from "@/components/file-tree-own";

import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Settings, X } from "lucide-react";

export default function Home() {
  const [repoURL, setRepoURL] = useState("");
  const [fileTree, setFileTree] = useState<nodeType[] | undefined>(undefined);
  const [content, setContent] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [repoName, setRepoName] = useState("");

  const [isHelperOpen, setIsHelperOpen] = useState(false);

  async function handleURLSubmit() {
    setIsHelperOpen(false);
    // fetch details from github url here.
    console.log("This URL is being sent by the user:", repoURL);
    const url = new URL(repoURL);
    const ownerName = url.pathname.split("/")[1];
    setOwnerName(ownerName);
    console.log("Owner name:", ownerName);
    const repoName = url.pathname.split("/")[2];
    setRepoName(repoName);
    console.log("Repo name:", repoName);

    const repoData = await axios.get(
      `https://api.github.com/repos/${ownerName}/${repoName}`
    );

    console.log("Data returned from github (Repo Metadata)", repoData);

    const recursiveFileTree = await axios.get(
      `https://api.github.com/repos/${ownerName}/${repoName}/git/trees/main?recursive=1`
    );

    console.log(
      "Returned file tree (branch main): ",
      recursiveFileTree.data.tree
    );

    const formattedTree = buildFileTree(recursiveFileTree.data.tree);

    console.log("This is the formatted tree", formattedTree);
    setFileTree(formattedTree);
    setRepoURL("");
  }

  async function handleSelect(file: nodeType) {
    console.log("Some element has been selected:", file);

    // only fetch if it's a file (GitHub marks them as blob)
    if (!file.id.endsWith("/")) {
      // fetch blob contents
      const blobRes = await fetch(
        `https://api.github.com/repos/${ownerName}/${repoName}/contents/${file.id}`
      );
      const blobData = await blobRes.json();

      console.log("blobData", blobData);

      // decode base64
      const decoded = atob(blobData.content);

      console.log("DecodedContent", decoded);

      setContent(decoded);
    }
  }

  return (
    <div>
      {!isHelperOpen && (
        <div
          className="text-gray-700 text-lg ml-4 mt-4"
          onClick={() => setIsHelperOpen((prev) => !prev)}
        >
          <Settings />
        </div>
      )}
      {isHelperOpen && (
        <div className="border bg-gray-100 py-10 px-4 z-10 shadow-md">
          <div
            className="text-gray-700 mb-4 absolute left-4 top-4 cursor-pointer"
            onClick={() => setIsHelperOpen(false)}
          >
            <X />
          </div>

          <div className="mt-10">Paste repository link here:</div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleURLSubmit();
            }}
          >
            <input
              value={repoURL}
              onChange={(e) => {
                setRepoURL(e.target.value);
              }}
              type="text"
              required
              className="border py-2 px-2 bg-white rounded-md"
            />
            <button
              type="submit"
              className="bg-black text-white px-4 py-2 rounded-sm ml-2 text-sm cursor-pointer"
            >
              View
            </button>
          </form>
        </div>
      )}

      <div className="h-[800px] mt-2">
        {fileTree && (
          <ResizablePanelGroup
            direction="horizontal"
            className="w-full min-w-[full]"
          >
            <ResizablePanel defaultSize={25} className="border" minSize={20}>
              <div className="w-full">
                <FileTree
                  elements={fileTree} // output of buildFileTree
                  onSelect={(node: nodeType) => handleSelect(node)}
                />
              </div>
            </ResizablePanel>

            <ResizableHandle withHandle />

            <ResizablePanel defaultSize={50} minSize={50}>
              <div className="border mx-2 rounded-md h-full">
                {!content && (
                  <div className="text-center text-lg mt-20">
                    Select a file to be opened here.
                  </div>
                )}

                {content && (
                  <SyntaxHighlighter
                    language="typescript"
                    style={oneDark}
                    className="w-full h-[100%]"
                  >
                    {content}
                  </SyntaxHighlighter>
                )}
              </div>
            </ResizablePanel>
            <ResizableHandle withHandle />

            <ResizablePanel defaultSize={25} minSize={20}>
              <div>Chat window component here.</div>
            </ResizablePanel>
          </ResizablePanelGroup>
        )}
      </div>
    </div>
  );
}
