document.getElementById("loginForm").addEventListener("submit", myButton);
async function myButton(e) {
    e.preventDefault();

    let userName = document.getElementById("username").value.trim();
    let password = document.getElementById("password").value.trim();
    let userNameError = document.getElementById("usernameError");
    let passwordError = document.getElementById("passwordError");
    let loginMessage = document.getElementById("loginMessage");
    

    let valid = true;

    userNameError.textContent = "";
    passwordError.textContent = "";
    loginMessage.textContent = "";

    if (!userName) {
        userNameError.textContent = "Username is required";
        valid = false;
    }

    if (!password) {
        passwordError.textContent = "Password is required";
        valid = false;
    }

    if (!valid) return;

    const datas = {
        userName: userName,
        password: password
    };

    try {
        const response = await fetch('https://hastin-container.com/staging/app/auth/login', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(datas)
        });

        if (response.ok) {
            const data = await response.json();
            console.log("Login successful:", data);
            loginMessage.style.color = "green";
            loginMessage.textContent = "Login successful!";
        } else {
            loginMessage.style.color = "red";
            loginMessage.textContent = "Invalid username or password.";
        }
    } catch (error) {
        console.error("Fetch failed:", error);
        loginMessage.style.color = "red";
        loginMessage.textContent = "Something went wrong. Try again.";
    }
}


