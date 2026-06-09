const greetingMessage = document.getElementById("greeting-message");
const userInfo = document.getElementById("user-info");

if (greetingMessage && userInfo) {
    const loggedUser = JSON.parse(sessionStorage.getItem("loggedInUser"));
    const hour = new Date().getHours();
    let greeting;
    if (hour < 12) {
        greeting = "Selamat pagi";
    } else if (hour < 17) {
        greeting = "Selamat siang";
    } else {
        greeting = "Selamat sore";
    }
    greetingMessage.textContent = `${greeting}, ${loggedUser ? loggedUser.nama : 'Pengguna'}`;
    userInfo.textContent = loggedUser ? `pengguna SITTA (${loggedUser.role} - ${loggedUser.lokasi})` : 'Pengguna SITTA';
}

const logoutBtn = document.getElementById("logout-btn");
const logoutPopup = document.getElementById("logout-popup");
const cancelLogout = document.getElementById("cancel-logout");
const confirmLogout = document.getElementById("confirm-logout");

if (logoutBtn && logoutPopup) {
    logoutBtn.addEventListener("click", function() {
        logoutPopup.style.display = "flex";
    });
}

if (cancelLogout) {
    cancelLogout.addEventListener("click", function() {
        logoutPopup.style.display = "none";
    });
}

if (confirmLogout) {
    confirmLogout.addEventListener("click", function() {
        sessionStorage.removeItem("loggedInUser");
        window.location.href = "login.html";
    });
}