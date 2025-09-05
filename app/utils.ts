export function buildFileTree(items) {
  const root = {}

  for (const item of items) {
    const parts = item.path.split("/")
    let currentLevel = root

    parts.forEach((part, index) => {
      const isFile = index === parts.length - 1 && item.type === "blob"
      const id = parts.slice(0, index + 1).join("/")

      if (!currentLevel[part]) {
        currentLevel[part] = {
          id,
          name: part,
          isSelectable: true,
          ...(isFile ? {} : { children: {} }),
        }
      }

      if (currentLevel[part].children && index < parts.length - 1) {
        currentLevel = currentLevel[part].children
      }
    })
  }

  function convertToArray(nodes) {
    return Object.values(nodes).map(node => ({
      ...node,
      children: node.children ? convertToArray(node.children) : undefined,
    }))
  }

  return convertToArray(root)
}