async function inject() {
      let injectScript = await chrome.runtime.getURL("inject.js");
      const script = document.createElement("script");
      script.type = 'text/javascript';
      script.src = injectScript;
      document.documentElement.appendChild(script);
}


window.addEventListener("message", function (event) {
      // Accept message only from the injected window
      if (event.source != window)
            return
      // TODO: send message can be a message that expect a response, we should handle that here.
      chrome.runtime.sendMessage(event.data);
})

console.log("inject");
inject();
