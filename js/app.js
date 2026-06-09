/**
 * SITTA UT - Aplikasi Pemesanan Bahan Ajar
 * File utama untuk fungsi global dan inisialisasi
 */

// ========== FUNGSI UTILITY ==========

// Format angka ke Rupiah
function formatRupiah(angka) {
  return "Rp " + angka.toLocaleString("id-ID");
}

// Format tanggal ke format lokal Indonesia
function formatTanggal(dateString) {
  if (!dateString) return "-";
  const date = new Date(dateString);
  return date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

// Format datetime lokal
function formatDateTime(dateTimeString) {
  if (!dateTimeString) return "-";
  const date = new Date(dateTimeString);
  return date.toLocaleString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// Bersihkan HTML untuk tooltip
function stripHtml(html) {
  if (!html) return "";
  const temp = document.createElement("div");
  temp.innerHTML = html;
  return temp.textContent || temp.innerText || "";
}

// Tampilkan notifikasi toast (opsional, jika tidak pakai popup)
function showToast(message, type = "success") {
  const toast = document.createElement("div");
  toast.className = `toast-notif ${type}`;
  toast.textContent = message;
  toast.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: ${type === "success" ? "#4CAF50" : "#f44336"};
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        z-index: 9999;
        font-size: 14px;
        box-shadow: 0 2px 5px rgba(0,0,0,0.2);
        animation: fadeInOut 3s ease;
    `;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

// ========== VALIDASI LOGIN ==========

// Cek apakah user sudah login, jika belum redirect ke login
function checkAuth() {
  const loggedInUser = sessionStorage.getItem("loggedInUser");
  if (!loggedInUser && !window.location.href.includes("login.html")) {
    window.location.href = "templates/login.html";
  }
  return loggedInUser ? JSON.parse(loggedInUser) : null;
}

// Ambil data user yang login
function getCurrentUser() {
  const user = sessionStorage.getItem("loggedInUser");
  return user ? JSON.parse(user) : null;
}

// Logout
function logout() {
  sessionStorage.removeItem("loggedInUser");
  window.location.href = "templates/login.html";
}

// ========== INISIALISASI HEADER & NAVIGASI ==========

// Setup dropdown menu (untuk halaman yang tidak pakai Vue)
function setupDropdown() {
  const dropbtn = document.querySelector(".dropbtn");
  const dropdownContent = document.querySelector(".dropdown-content");
  if (dropbtn && dropdownContent) {
    dropbtn.addEventListener("click", (e) => {
      e.stopPropagation();
      dropdownContent.classList.toggle("show");
    });
    window.addEventListener("click", () => {
      dropdownContent.classList.remove("show");
    });
  }
}

// Set greeting di dashboard (jika ada)
function setGreeting() {
  const greetingEl = document.getElementById("greeting-message");
  const userInfoEl = document.getElementById("user-info");
  if (greetingEl) {
    const hour = new Date().getHours();
    let greeting = "";
    if (hour < 12) greeting = "Selamat pagi";
    else if (hour < 17) greeting = "Selamat siang";
    else greeting = "Selamat sore";
    const user = getCurrentUser();
    greetingEl.textContent = `${greeting}, ${user ? user.nama : "Pengguna"}`;
    if (userInfoEl) {
      userInfoEl.textContent = user
        ? `pengguna SITTA (${user.role} - ${user.lokasi})`
        : "Pengguna SITTA";
    }
  }
}

// Setup logout button (untuk halaman non-Vue)
function setupLogoutButton() {
  const logoutBtn = document.getElementById("logout-btn");
  const logoutPopup = document.getElementById("logout-popup");
  const cancelLogout = document.getElementById("cancel-logout");
  const confirmLogoutBtn = document.getElementById("confirm-logout");
  if (logoutBtn && logoutPopup) {
    logoutBtn.addEventListener("click", () => {
      logoutPopup.style.display = "flex";
    });
    if (cancelLogout) {
      cancelLogout.addEventListener("click", () => {
        logoutPopup.style.display = "none";
      });
    }
    if (confirmLogoutBtn) {
      confirmLogoutBtn.addEventListener("click", () => {
        logout();
      });
    }
  }
}

// ========== EKSPOR GLOBAL (UNTUK AKSES DI KONSOLE) ==========
window.SITTA = {
  formatRupiah,
  formatTanggal,
  formatDateTime,
  stripHtml,
  showToast,
  checkAuth,
  getCurrentUser,
  logout,
  setupDropdown,
  setGreeting,
  setupLogoutButton,
};

// ========== OTOMATIS JALANKAN INISIALISASI UNTUK HALAMAN TERTENTU ==========
document.addEventListener("DOMContentLoaded", () => {
  // Cek auth untuk semua halaman kecuali login
  if (!window.location.href.includes("login.html")) {
    checkAuth();
  }
  // Setup dropdown jika ada
  setupDropdown();
  // Set greeting jika di dashboard
  setGreeting();
  // Setup logout button
  setupLogoutButton();
});
