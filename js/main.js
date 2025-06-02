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

function buf2hex(buffer) { // buffer is an ArrayBuffer
    return Array.prototype.map.call(new Uint8Array(buffer), x => ('00' + x.toString(16)).slice(-2)).join('');
}

async function get_sha1_hash(text) {
    let hashPwd = await crypto.subtle.digest("SHA-1", new TextEncoder().encode(text))
    return hashPwd
}

async function get_sha256_hash(text) {
    let hashPwd = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text))
    return hashPwd
}

function login() {
    
}

function validate_pwd(pwd_val) {
    console.log(pwd_val);
    // https://plainenglish.io/blog/javascript-check-if-string-contains-uppercase-letters-9a78b69739f6
    valid_password = false;
    if (pwd_val.length >= 8) {
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
    return valid_password
}

async function is_pwd_pawned(pwd_val) {
    let hashPwd = await get_sha1_hash(pwd_val);
    hex_hash = buf2hex(hashPwd);
    const prefix = hex_hash.slice(0, 5);
    const suffix = hex_hash.slice(5);

    const res = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`);
    const text = await res.text();
    return text.includes(suffix)
}

async function save_pwd_username(pwd_val, username) {
    hased_pwd = await get_sha256_hash(pwd_val)

    data = $.csv.toObjects("db.csv")
    console.log(data);
    

}

async function signup() {
    let username = document.getElementById("submit_username");
    let password = document.getElementById("submit_password");
    pwd_val = password.value;
    save_pwd_username(pwd_val, username.value)
    valid_password = validate_pwd(pwd_val);
    if (valid_password) {
        is_pawned = await is_pwd_pawned(pwd_val);
        if (!is_pawned) {
            console.log("Not Pawned");
        }
    }
}
