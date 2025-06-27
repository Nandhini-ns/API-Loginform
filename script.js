// document.getElementById("loginForm").addEventListener("submit", myButton);
// async function myButton(e) {
//     e.preventDefault();

//     let userName = document.getElementById("username").value.trim();
//     let password = document.getElementById("password").value.trim();
//     let userNameError = document.getElementById("usernameError");
//     let passwordError = document.getElementById("passwordError");
//     let loginMessage = document.getElementById("loginMessage");
    

//     let valid = true;

//     userNameError.textContent = "";
//     passwordError.textContent = "";
//     loginMessage.textContent = "";

//     if (!userName) {
//         userNameError.textContent = "Username is required";
//         valid = false;
//     }

//     if (!password) {
//         passwordError.textContent = "Password is required";
//         valid = false;
//     }

//     if (!valid) return;

//     const datas = {
//         userName: userName,
//         password: password
//     };

//     try {
//         const response = await fetch('https://hastin-container.com/staging/app/auth/login', {
//             method: 'POST',
//             headers: {
//                 "Content-Type": "application/json"
//             },
//             body: JSON.stringify(datas)
//         });

//         if (response.ok) {
//             const data = await response.json();
//             console.log("Login successful:", data);
//             loginMessage.style.color = "green";
//             loginMessage.textContent = "Login successful!";
//         } else {
//             loginMessage.style.color = "red";
//             loginMessage.textContent = "Invalid username or password.";
//         }
//     } catch (error) {
//         console.error("Fetch failed:", error);
//         loginMessage.style.color = "red";
//         loginMessage.textContent = "Something went wrong. Try again.";
//     }
   
// }

// //password
// function my(){
//     var x= document.getElementById("password");
//     if(x.type==="password"){
//         x.type="text";
//     }else{
//         x.type="password";
//     }
// }


// Form submit event
document.getElementById("loginForm").addEventListener("submit", myButton);

// Login function
async function myButton(e) {
    e.preventDefault(); // page reload aagala

    let userName = document.getElementById("username").value.trim();
    let password = document.getElementById("password").value.trim();
    let userNameError = document.getElementById("usernameError");
    let passwordError = document.getElementById("passwordError");
    let loginMessage = document.getElementById("loginMessage");

    let valid = true;

    // clear previous error messages
    userNameError.textContent = "";
    passwordError.textContent = "";
    loginMessage.textContent = "";

    // validation
    if (!userName) {
        userNameError.textContent = "Username is required";
        valid = false;
    } else if(userName !=="ebrain"){
        userNameError.textContent="Invalid Username";
        valid=false;
    }

    if (!password) {
        passwordError.textContent = "Password is required";
        valid = false;
    }else if (password !== "Ji#993te") {
    passwordError.textContent = "Invalid Password";
    valid = false;
  }

    if (!valid) return;

    const datas = {
        userName: userName,
        password: password
    };

    // API call
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

            const{opaque,accessCode,jwt}=data.data;
            //save to localstorage
            localStorage.setItem("opaque", opaque);
            localStorage.setItem("accessCode", accessCode);
            localStorage.setItem("jwtToken", jwt);
            // Show OTP modal
             showOtpModal(accessCode, opaque);
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

function showOtpModal(accessCode,opaque) {
  document.getElementById("otpModal").style.display = "flex";
  document.getElementById("otpInput").value = accessCode;
 // const opaque = generateOpaque();
  document.getElementById("opaque").textContent = opaque;
  startTimer(30);
}

//close otp modal
function closeOtpModal() {
  document.getElementById("otpModal").style.display = "none";
  clearInterval(timerInterval);
}

// function generateOpaque() {
//   const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
//   let code = "";
//   for (let i = 0; i < 6; i++) {
//     code += chars.charAt(Math.floor(Math.random() * chars.length));
//   }
//   return code;
// }

// Resend OTP
function resendOtp() {
  const newOpaque = generateOpaque();
  document.getElementById("opaque").textContent = newOpaque;
  document.getElementById("otpInput").value = newOpaque;
  startTimer(30);
  alert("OTP Resent!");
}

//timer logic
let timerInterval;
function startTimer(seconds) {
  const timerDisplay = document.getElementById("timer");
  let time = seconds;
  clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    const min = String(Math.floor(time / 60)).padStart(2, "0");
    const sec = String(time % 60).padStart(2, "0");
    timerDisplay.textContent = `${min}:${sec}`;
    time--;
    if (time < 0) {
      clearInterval(timerInterval);
      timerDisplay.textContent = "Expired";
    }
  }, 1000);
}

//submit otp
function submitOTP() {
  const entered = document.getElementById("otpInput").value.trim();
  const opaque = document.getElementById("opaque").textContent.trim();
  const jwtToken=localStorage.getItem("jwtToken");
  const accessCode=entered; //user input

  const payload = {
    accessCode,
    opaque
  };

  console.log("OTP Payload:", payload);

fetch("https://hastin-container.com/staging/app/auth/access-code/validate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "authorization": "BslogiKey " + jwtToken
    },
    body: JSON.stringify(payload)
  })
    .then((res) => res.json())
    .then((data) => {
      console.log("OTP Response:", data);
      if(data?.data?.verified){
      alert("OTP Verified Successfully!");
      closeOtpModal();
      } else{
      }
    })
    .catch((err) => {
      console.error("OTP Error:", err);
      alert("OTP Verification Failed.");
    });
}

// Password show/hide function
function my() {
    var x = document.getElementById("password");
    if (x.type === "password") {
        x.type = "text";
    } else {
        x.type = "password";
    }
}

// Forgot password click handle
function forgotpassword() {
    // alert("Forgot password feature coming soon!");
}

