const butInstall = document.getElementById("buttonInstall");

// Logic for installing the PWA
// Add an event handler to the `beforeinstallprompt` event
let deferredPrompt;

window.addEventListener("beforeinstallprompt", (event) => {
  // Prevent Chrome 67 and earlier from automatically showing the prompt
  event.preventDefault();

  // Stash the event so it can be triggered later
  deferredPrompt = event;

  // Show the install button
  butInstall.style.display = "block";
});

// Implement a click event handler on the `butInstall` element
butInstall.addEventListener("click", async () => {
  // Hide the install button
  butInstall.style.display = "none";

  // Show the prompt
  deferredPrompt.prompt();

  // Wait for the user to respond to the prompt
  const choiceResult = await deferredPrompt.userChoice;

  // Dispose the deferredPrompt variable
  deferredPrompt = null;

  // Log the result of the installation
  console.log(`User response: ${choiceResult.outcome}`);
});

// Add a handler for the `appinstalled` event
window.addEventListener("appinstalled", (event) => {
  console.log("App installed successfully!");
});
