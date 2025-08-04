(function () {
    // Wait for the DOM to be ready
    window.addEventListener("DOMContentLoaded", () => {
      const iframe = document.querySelector("iframe");
  
      if (!iframe) {
        console.warn("❌ No iframe found on the page.");
        return;
      }
  
      iframe.addEventListener("load", () => {
        const src = iframe.getAttribute("src");
        console.log("✅ iframe loaded with src:", src);
  
        // Send message to background/popup
        chrome.runtime.sendMessage({ type: "READY_TO_FILL", iframeSrc: src });
      });
    });
  })();
  