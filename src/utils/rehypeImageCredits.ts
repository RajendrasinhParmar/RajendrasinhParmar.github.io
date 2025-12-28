import { h } from "hastscript";
import { visit } from "unist-util-visit";

/**
 * Rehype plugin to wrap images with credits in figure elements
 * and add figcaption for credits
 *
 * Processes images that have data-credit attribute set by remarkImageCredits
 */
export default function rehypeImageCredits() {
  return (tree: any) => {
    const nodesToReplace: Array<{
      parent: any;
      index: number;
      newNode: any;
    }> = [];
    const commentsToRemove: Array<{ parent: any; index: number }> = [];

    visit(tree, (node: any, index: any, parent: any) => {
      // First, identify and mark comments for removal
      let creditMatch = null;
      if (node.type === "html" && typeof node.value === "string") {
        creditMatch = node.value.match(/<!--\s*credit:\s*(.+?)\s*-->/i);
      } else if (node.type === "comment" && typeof node.value === "string") {
        creditMatch = node.value.match(/credit:\s*(.+)/i);
      }

      if (creditMatch && parent && typeof index === "number") {
        // Check if the previous sibling is an image (direct or inside a paragraph)
        const prevSibling = parent.children[index - 1];
        let imageNode = null;

        if (
          prevSibling &&
          prevSibling.type === "element" &&
          prevSibling.tagName === "img"
        ) {
          imageNode = prevSibling;
        } else if (
          prevSibling &&
          prevSibling.type === "element" &&
          prevSibling.tagName === "p" &&
          prevSibling.children
        ) {
          // If the previous sibling is a paragraph, check its children for an image
          const imgInParagraph = prevSibling.children.find(
            (child: any) => child.type === "element" && child.tagName === "img"
          );
          if (imgInParagraph) {
            imageNode = imgInParagraph;
          }
        }

        if (
          imageNode &&
          imageNode.properties &&
          imageNode.properties["data-credit"]
        ) {
          commentsToRemove.push({ parent, index });
        }
      }

      // Second, identify images with data-credit and prepare for wrapping
      if (
        node.type === "element" &&
        node.tagName === "img" &&
        node.properties &&
        typeof node.properties["data-credit"] === "string" &&
        parent &&
        typeof index === "number" &&
        parent.tagName !== "figure" // Don't wrap if already inside a figure
      ) {
        const credit = node.properties["data-credit"] as string;

        // Determine the node to be replaced
        let replaceParent = parent;
        let replaceIndex = index;

        // If the image is inside a paragraph with only the image as child
        if (
          parent.tagName === "p" &&
          parent.children.length === 1 &&
          parent.parent
        ) {
          replaceParent = parent.parent;
          replaceIndex = parent.parent.children.indexOf(parent);
        }

        // Create the figure element
        const figure = h("figure", { className: "image-with-credit" }, [
          h("img", { ...node.properties, "data-credit": undefined }), // Clone image properties, remove data-credit
          h("figcaption", { className: "image-credit" }, credit),
        ]);

        nodesToReplace.push({
          parent: replaceParent,
          index: replaceIndex,
          newNode: figure,
        });
      }
    });

    // Perform replacements and removals in reverse order to avoid index issues
    for (let i = commentsToRemove.length - 1; i >= 0; i--) {
      const { parent, index } = commentsToRemove[i];
      parent.children.splice(index, 1);
    }

    for (let i = nodesToReplace.length - 1; i >= 0; i--) {
      const { parent, index, newNode } = nodesToReplace[i];
      if (parent && parent.children) {
        parent.children[index] = newNode;
      }
    }
  };
}
