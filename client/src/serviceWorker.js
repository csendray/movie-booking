const isLocalhost = (() => {
  const hostname = window.location.hostname;
  return (
    hostname === "localhost" ||
    hostname === "[::1]" ||
    /^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/.test(hostname)
  );
})();

export default function registerServiceWorker() {
  if (
    process.env.NODE_ENV !== "production" ||
    !("serviceWorker" in navigator)
  ) {
    return;
  }

  const publicUrl = new URL(process.env.PUBLIC_URL, window.location);
  if (publicUrl.origin !== window.location.origin) {
    return; // Service worker won't work on different origin
  }

  window.addEventListener("load", () => {
    const swUrl = `${process.env.PUBLIC_URL}/service-worker.js`;

    if (isLocalhost) {
      checkValidServiceWorker(swUrl);
      navigator.serviceWorker.ready.then(() => {
        console.log(
          "This web app is served cache-first by a service worker. To learn more, visit https://goo.gl/SC7cgQ"
        );
      });
    } else {
      registerValidSW(swUrl);
    }
  });
}

function registerValidSW(swUrl) {
  navigator.serviceWorker
    .register(swUrl)
    .then((registration) => {
      registration.onupdatefound = () => {
        const installingWorker = registration.installing;
        installingWorker.onstatechange = () => {
          if (installingWorker.state === "installed") {
            const message = navigator.serviceWorker.controller
              ? "New content is available; please refresh."
              : "Content is cached for offline use.";
            console.log(message);
          }
        };
      };
    })
    .catch((error) => {
      console.error("Error during service worker registration:", error);
    });
}

function checkValidServiceWorker(swUrl) {
  fetch(swUrl)
    .then((response) => {
      if (
        response.status === 404 ||
        !response.headers.get("content-type").includes("javascript")
      ) {
        unregisterServiceWorker();
        window.location.reload();
      } else {
        registerValidSW(swUrl);
      }
    })
    .catch(() => {
      console.log(
        "No internet connection found. App is running in offline mode."
      );
    });
}

export function unregisterServiceWorker() {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.ready.then((registration) => {
      registration.unregister();
    });
  }
}
