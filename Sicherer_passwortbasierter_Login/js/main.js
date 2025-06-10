document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("loginForm");
    if (loginForm) {
        loginForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            await login();
        });
    }

    const submitForm = document.getElementById("submitForm");
    if (submitForm) {
        submitForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            await signup();
        });
    }
});

async function login() {
    const username = document.getElementById("login_username").value;
    const password = document.getElementById("login_password").value;
    const token = grecaptcha.getResponse();

    if (!token) {
        alert("Bitte CAPTCHA ausfüllen");
        return;
    }
        const res = await fetch("http://localhost:8080/api/login?token=" + token, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password })
        });

        const result = await res.text();

        switch (result) {
            case 'recaptcha_failed':
            alert('reCAPTCHA-Verifizierung fehlgeschlagen.');
            break;
            case 'success':
            alert('Login erfolgreich!');
            break;
            case 'invalid':
            alert('Benutzername oder Passwort ist falsch.');
            break;
            default:
            alert('Unbekannter Fehler: ' + result);
            break;
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
        const res = await fetch("http://localhost:8080/api/register?token=" + token, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password })
        });
        const result = await res.text(); 

        switch (result) {
            case 'recaptcha_failed':
            alert('reCAPTCHA-Verifizierung fehlgeschlagen.');
            break;
            case 'password_too_short':
            alert('Das Passwort muss mindestens 8 Zeichen lang sein.');
            break;
            case 'missing_uppercase':
            alert('Das Passwort muss mindestens einen Großbuchstaben enthalten.');
            break;
            case 'missing_lowercase':
            alert('Das Passwort muss mindestens einen Kleinbuchstaben enthalten.');
            break;
            case 'missing_number':
            alert('Das Passwort muss mindestens eine Zahl enthalten.');
            break;
            case 'missing_special_char':
            alert('Das Passwort muss mindestens ein Sonderzeichen enthalten (z. B. @, #, !, etc.).');
            break;
            case 'password_pwned':
            alert('Dieses Passwort wurde bereits in einem Datenleck gefunden. Bitte wähle ein anderes.');
            break;
            case 'success':
            alert('Registrierung erfolgreich!');
            break;
            default:
            alert('Unbekannter Fehler: ' + result);
            break;
        }

    grecaptcha.reset();
}
