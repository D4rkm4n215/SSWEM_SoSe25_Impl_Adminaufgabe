document.getElementById("loginForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    await login();
});

document.getElementById("submitForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    await signup();
});

async function login() {
    const username = document.getElementById("login_username").value;
    const password = document.getElementById("login_password").value;
    const token = grecaptcha.getResponse();

    if (!token) {
        alert("Please complete the CAPTCHA");
        return;
    }

    const res = await fetch("/login?token=" + token, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
    });

    const text = await res.text();
    alert("Login result: " + text);
    grecaptcha.reset();
}

async function signup() {
    const username = document.getElementById("submit_username").value;
    const password = document.getElementById("submit_password").value;
    const token = grecaptcha.getResponse();

    if (!token) {
        alert("Please complete the CAPTCHA");
        return;
    }

    const res = await fetch("/register?token=" + token, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
    });

    const text = await res.text();
    alert("Signup result: " + text);
    grecaptcha.reset();
}