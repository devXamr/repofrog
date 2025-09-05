"use client"

import { useState } from "react"

function FileNode({ node, onSelect }) {
  const [isOpen, setIsOpen] = useState(false)

  const isFolder = !!node.children

  return (
    <div className={`ml-2 border-l`}>
      <div
        className="cursor-pointer px-2 py-1 flex items-center space-x-1 bg-gray-100"
        onClick={() => {
          if (isFolder) setIsOpen(!isOpen)
          else onSelect(node)
        }}
      >
        <span>{isFolder ? (isOpen ? "📂" : "📁") : "📄"}</span>
        <span>{node.name}</span>
      </div>
      {isOpen && isFolder && (
        <div className="ml-4">
          {node.children.map(child => (
            <FileNode key={child.id} node={child} onSelect={onSelect} />
          ))}
        </div>
      )}
    </div>
  )
}

export default function FileTree({ elements, onSelect }) {
  return (
    <div className="border px-4 py-4 w-fit mt-10 rounded-md">
      {elements.map(node => (
        <FileNode key={node.id} node={node} onSelect={onSelect} />
      ))}
    </div>
  )
}