const params = new URLSearchParams(window.location.search);

document.getElementById("fname").textContent =
params.get("fname") || "N/A";

document.getElementById("lname").textContent =
params.get("lname") || "N/A";

document.getElementById("email").textContent =
params.get("email") || "N/A";

document.getElementById("phone").textContent =
params.get("phone") || "N/A";

document.getElementById("business").textContent =
params.get("business") || "N/A";

document.getElementById("timestamp").textContent =
params.get("timestamp") || "N/A";
