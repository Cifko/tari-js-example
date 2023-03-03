async function run() {
  const { Events } = await import("./comms.js")
  class Tari {
    sayHello() {
      window.postMessage({ event: Events.SayHello }, "*")
    }
  }
  window.tari = new Tari();
  console.log("injected");
}

try {
  run();
}
catch (error) {
  console.log(error)
}
