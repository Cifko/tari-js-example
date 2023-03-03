console.log("popup");

const Pages = {
  Login: "login",
  Settings: "settings"
}

var lastPage = null;

function setPage(page) {
  console.log(page);
  if (page != lastPage) {
    if (lastPage) {
      document.getElementById(lastPage).hidden = true;
    }
    document.getElementById(page).hidden = false;
    lastPage = page;
  }
}


async function run() {
  const { Events } = await import("./comms.js")

  function showSettings() {
    let jrpc_url_tag = document.getElementById("jrpc_url");
    jrpc_url_tag.onchange = () => {
      console.log("jrpc_url change");
      chrome.runtime.sendMessage({ event: Events.SetJrpcUrl, jrpc_url: jrpc_url_tag.value }, (response) => {
        // Possibly some error handling
      })
    };
    chrome.runtime.sendMessage({ event: Events.GetJrpcUrl }, (response) => {
      jrpc_url_tag.value = response?.jrpc_url;
    });
    setPage(Pages.Settings);
  }

  function showLogin() {
    let password_tag = document.getElementById("password");
    password_tag.onchange = () => {
      chrome.runtime.sendMessage({ event: Events.Login, password: password_tag.value }, (response) => {
        if (response?.successful) {
          showSettings();
        }
      })
    };
    setPage(Pages.Login);
  }

  function responseFromBackground(payload) {
    console.log(payload)
    if (payload?.logged) {
      showSettings();
    } else {
      showLogin();
    }
  }

  console.log(Events.LoginState);
  chrome.runtime.sendMessage({ event: Events.LoginState }, responseFromBackground);
}

run();
