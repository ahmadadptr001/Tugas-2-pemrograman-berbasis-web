var app = new Vue({
    el: '#app',
    data: {
        email: "",
        password: "",
        showPassword: false,
        showForgotModal: false,
        showRegisterModal: false,
        showSuccessPopup: false,
        loggedInUser: {}
    },
    methods: {
        async login() {
            const user = await API.login(this.email, this.password);
            if (user) {
                sessionStorage.setItem("loggedInUser", JSON.stringify(user));
                this.loggedInUser = user;
                this.showSuccessPopup = true;
            } else {
                alert("Email atau password salah!");
            }
        },
        togglePassword() {
            this.showPassword = !this.showPassword;
        },
        goDashboard() {
            window.location.href = "dashboard.html";
        }
    }
});