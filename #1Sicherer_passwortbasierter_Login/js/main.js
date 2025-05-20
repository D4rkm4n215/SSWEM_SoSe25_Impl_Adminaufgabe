let loginForm = document.getElementById("loginForm");

loginForm.addEventListener("submit", (e) => {
    e.preventDefault();

    let username = document.getElementById("login_username");
    let password = document.getElementById("login_password");
    console.log(password);
    console.log(username);
    
    if (username.value == "" || password.value == "") {
        // throw error
    } else {
        // perform operation with form input
    }
});


let submitForm = document.getElementById("submitForm");

function containsUppercase(str) {
  return /[A-Z]/.test(str);
}

function containsLowercase(str) {
  return /[a-z]/.test(str);
}

function containsNumber(str) {
  return /\d/.test(str);
}

function containsSpecialCaracter(str) {
  return /[-+_!@#$%^&*.,?]/.test(str);
}

async function get_sha1_hash(text) {
    let hashPwd = await crypto.subtle.digest("SHA-1", new TextEncoder().encode(text))
    return hashPwd
}

submitForm.addEventListener("submit", (e) => {
    e.preventDefault();
    let username = document.getElementById("submit_username");
    let password = document.getElementById("submit_password");
    pwd_val = password.value
    console.log(pwd_val);
    // https://plainenglish.io/blog/javascript-check-if-string-contains-uppercase-letters-9a78b69739f6
    valid_password = false
    if (pwd_val.lengt >= 8) {
        if (containsUppercase(pwd_val)) {
            if (containsLowercase(pwd_val)) {
                if (containsNumber(pwd_val)) {
                    if (containsSpecialCaracter(pwd_val)) {
                        valid_password = true
                        console.log("All good!");
                    } else {
                        console.log("The password must contain at least one special character");
                    }
                } else {
                    console.log("The password must contain at least one Number");
                }
            } else {
                console.log("The password must contain at least one lowercase letter");
            }
        } else {
            console.log("The password must contain at least one uppercase letter");
        }
    } else {
        console.log("The password must be at least 8 characters long");
    }

    hashPwd = get_sha1_hash("test")
    console.log(hashPwd);
    //https://api.pwnedpasswords.com/range/
});
