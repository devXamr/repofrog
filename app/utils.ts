import { nodeType } from "@/components/file-tree-own";

type singleItemType = {
  mode: string;
  path: string;
  sha: string;
  size: number;
  type: "blob" | "tree";
  url: string;
};

type itemsType = singleItemType[];

type NodeBuilder = {
  id: string;
  name: string;
  isSelectable: boolean;
  children?: Record<string, NodeBuilder>;
};

export function buildFileTree(items: itemsType): nodeType[] {
  const root: Record<string, NodeBuilder> = {};

  for (const item of items) {
    const parts = item.path.split("/");
    let currentLevel: Record<string, NodeBuilder> = root;

    parts.forEach((part, index) => {
      const isFile = index === parts.length - 1 && item.type === "blob";
      const id = parts.slice(0, index + 1).join("/");

      if (!currentLevel[part]) {
        currentLevel[part] = {
          id,
          name: part,
          isSelectable: true,
          ...(isFile ? {} : { children: {} }),
        };
      }

      if (currentLevel[part].children && index < parts.length - 1) {
        currentLevel = currentLevel[part].children;
      }
    });
  }

  function convertToArray(nodes: Record<string, NodeBuilder>): nodeType[] {
    return Object.values(nodes).map((node) => ({
      ...node,
      children: node.children ? convertToArray(node.children) : undefined,
    }));
  }

  return convertToArray(root);
}
