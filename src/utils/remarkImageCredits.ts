import { visit } from "unist-util-visit";

/**
 * Remark plugin to parse image credits from HTML comments
 *
 * Usage in markdown:
 * ![alt text](image.png)
 * <!-- credit: Photo by John Doe on Unsplash -->
 */
export default function remarkImageCredits() {
  return (tree: any) => {
    visit(tree, "html", (node: any, index: number, parent: any) => {
      // Look for HTML comments with credit pattern
      if (typeof node.value === "string") {
        const match = node.value.match(/<!--\s*credit:\s*(.+?)\s*-->/i);
        if (match) {
          const creditText = match[1].trim();

          // Check if previous sibling is an image or paragraph containing an image
          const prevSibling = parent.children[index - 1];
          let imageNode = null;

          // Case 1: Direct image
          if (prevSibling && prevSibling.type === "image") {
            imageNode = prevSibling;
          }
          // Case 2: Image inside a paragraph
          else if (
            prevSibling &&
            prevSibling.type === "paragraph" &&
            prevSibling.children
          ) {
            // Look for image in paragraph children
            for (const child of prevSibling.children) {
              if (child.type === "image") {
                imageNode = child;
                break;
              }
            }
          }

          if (imageNode) {
            // Attach credit to image via hProperties (transfers to rehype)
            if (!imageNode.data) imageNode.data = {};
            if (!imageNode.data.hProperties) imageNode.data.hProperties = {};
            imageNode.data.hProperties["data-credit"] = creditText;
          }
        }
      }
    });
  };
}
