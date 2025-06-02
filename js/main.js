document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("loginForm").addEventListener("submit", async (e) => {
        e.preventDefault();
        await login();
    });

    document.getElementById("submitForm").addEventListener("submit", async (e) => {
        e.preventDefault();
        await signup();
    });
});

async function login() {
    const username = document.getElementById("login_username").value;
    const password = document.getElementById("login_password").value;
    const token = grecaptcha.getResponse();

    if (!token) {
        alert("Bitte CAPTCHA ausfüllen");
        return;
    }

    try {
        const encodedToken = encodeURIComponent(token);
        const res = await fetch("http://130.61.19.194:8080/api/register?token=" + encodedToken, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password })
        });

        const text = await res.text();
        alert("Login-Ergebnis: " + text);
    } catch (error) {
        console.error("Fehler beim Login:", error);
        alert("Fehler beim Login");
    }

    grecaptcha.reset();
}

async function signup() {
    const username = document.getElementById("submit_username").value;
    const password = document.getElementById("submit_password").value;
    const token = grecaptcha.getResponse();

    if (!token) {
        alert("Bitte CAPTCHA ausfüllen");
        return;
    }

    try {
        const encodedToken = encodeURIComponent(token);
        const res = await fetch("http://130.61.19.194:8080/api/register?token=" + encodedToken, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password })
        });

        const text = await res.text();
        alert("Registrierungsergebnis: " + text);
    } catch (error) {
        console.error("Fehler bei der Registrierung:", error);
        alert("Fehler bei der Registrierung");
    }

    grecaptcha.reset();
}
