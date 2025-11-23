/**
 * Remark plugin to add target="_blank" and rel="noopener noreferrer" to external links
 */
export default function remarkExternalLinks() {
  return (tree: any) => {
    // Simple tree walker function
    function visit(node: any, callback: (node: any) => void) {
      callback(node);
      if (node.children) {
        node.children.forEach((child: any) => visit(child, callback));
      }
    }

    visit(tree, (node: any) => {
      if (node.type === "link") {
        const url = node.url;

        // Check if the link is external (starts with http/https or is a different domain)
        const isExternal =
          url &&
          (url.startsWith("http://") ||
            url.startsWith("https://") ||
            url.startsWith("//")); // Protocol-relative URLs

        // Check if it's not a link to the same domain (if you want to exclude your own domain)
        // You can customize this logic based on your needs
        const isNotSameDomain = isExternal && !url.includes("rajendrasinh.com");

        if (isExternal && isNotSameDomain) {
          // Initialize data object if it doesn't exist
          if (!node.data) {
            node.data = {};
          }

          // Initialize hProperties if it doesn't exist
          if (!node.data.hProperties) {
            node.data.hProperties = {};
          }

          // Add target="_blank" and rel="noopener noreferrer" for security
          node.data.hProperties.target = "_blank";
          node.data.hProperties.rel = "noopener noreferrer";
        }
      }
    });
  };
}
