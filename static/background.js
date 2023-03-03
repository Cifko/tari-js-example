import { Events } from "./comms.js";
import * as index_bg from "./index_bg.js";

const version = 1;

async function run() {
  const importObject = {
    "./index_bg.js": index_bg
  };
  let wasm = await fetch("./index_bg.wasm");
  wasm = await wasm.arrayBuffer();
  let mod = await WebAssembly.compile(wasm);
  try {
    globalThis.wasm = (await WebAssembly.instantiate(mod, importObject)).exports
  } catch (error) {
    console.log('Instantiate error:', error)
  }
  globalThis.tari = index_bg
  index_bg.__wbg_set_wasm(globalThis.wasm);
  index_bg.sayHello();


  var tari;
  let resp = await chrome.storage.local.get(['tari']);
  if (resp?.version !== version) {
    tari = { "logged": false, jrpc_url: "", version: version }
    chrome.storage.local.set({ tari: tari });
  } else {
    tari = resp;
  }

  function logState() {
    console.log("Get log state");
    return { logged: tari.logged };
  }

  function login(password) {
    console.log('Password send', password);
    tari.logged = password === "test";
    chrome.storage.local.set({ tari: tari });
    console.log(tari.logged);
    return { successful: tari.logged };
  }

  function getJrpcUrl() {
    console.log("Get jrpc url");
    console.log(tari);
    return { jrpc_url: tari.jrpc_url };
  }

  function setJrpcUrl(jrpc_url) {
    console.log("Set jrpc url", jrpc_url);
    tari.jrpc_url = jrpc_url;
    chrome.storage.local.set({ tari: tari });
    console.log(tari);
    return true;
  }

  function sayHello() {
    index_bg.sayHello();
    return {};
  }

  chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    console.log(request);
    // Can any other window/page send this request? I don't know yet what will be here. But in my mind it's possible to use this whole think without user knowning.

    switch (request?.event) {
      case Events.LoginState: sendResponse(logState()); break;
      case Events.Login: sendResponse(login(request?.password)); break;
      case Events.GetJrpcUrl: sendResponse(getJrpcUrl()); break;
      case Events.SetJrpcUrl: sendResponse(setJrpcUrl(request?.jrpc_url)); break;
      case Events.SayHello: sendResponse(sayHello()); break;
      default: console.log("Unknown event"); break;
    }
  });

  chrome.runtime
}

run();
