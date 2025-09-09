"use client";

import { useState } from "react";

export type nodeType = {
  children?: nodeType[];
  id: string;
  isSelectable: boolean;
  name: string;
};

type onSelectType = (file: nodeType) => Promise<void>;

function FileNode({
  node,
  onSelect,
}: {
  node: nodeType;
  onSelect: onSelectType;
}) {
  const [isOpen, setIsOpen] = useState(false);

  const isFolder = !!node.children;

  return (
    <div className={`ml-2 border-bl`}>
      <div
        className="cursor-pointer px-2 py-1 flex items-center space-x-1 bg-gray-100"
        onClick={() => {
          if (isFolder) setIsOpen(!isOpen);
          else onSelect(node);
        }}
      >
        <span>{isFolder ? (isOpen ? "📂" : "📁") : "📄"}</span>
        <span>{node.name}</span>
      </div>
      {isOpen && isFolder && (
        <div className="ml-4">
          {node.children &&
            node.children.map((child: nodeType) => (
              <FileNode key={child.id} node={child} onSelect={onSelect} />
            ))}
        </div>
      )}
    </div>
  );
}

type elementsType = nodeType[];

export default function FileTree({
  elements,
  onSelect,
}: {
  elements: elementsType;
  onSelect: onSelectType;
}) {
  return (
    <div className="border px-4 py-4 w-full rounded-md">
      {elements.map((node) => (
        <FileNode key={node.id} node={node} onSelect={onSelect} />
      ))}
    </div>
  );
}
