/**
 * Client-side script to ensure all external links open in new tabs
 * This serves as a backup for any links not processed by the remark plugin
 */
(function () {
  "use strict";

  function makeExternalLinksOpenInNewTab() {
    // Get all links on the page
    const links = document.querySelectorAll("a[href]");

    links.forEach(link => {
      const href = link.getAttribute("href");

      // Check if it's an external link
      const isExternal =
        href &&
        (href.startsWith("http://") ||
          href.startsWith("https://") ||
          href.startsWith("//"));

      // Check if it's not a link to the same domain
      const isNotSameDomain =
        isExternal && !href.includes(window.location.hostname);

      if (isExternal && isNotSameDomain && !link.hasAttribute("target")) {
        link.setAttribute("target", "_blank");
        link.setAttribute("rel", "noopener noreferrer");
      }
    });
  }

  // Run when DOM is ready
  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded",
      makeExternalLinksOpenInNewTab
    );
  } else {
    makeExternalLinksOpenInNewTab();
  }

  // Also run after any dynamic content changes (for SPAs)
  const observer = new MutationObserver(function (mutations) {
    let shouldCheck = false;
    mutations.forEach(function (mutation) {
      if (mutation.type === "childList" && mutation.addedNodes.length > 0) {
        shouldCheck = true;
      }
    });
    if (shouldCheck) {
      makeExternalLinksOpenInNewTab();
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
})();
