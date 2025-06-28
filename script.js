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
  } else if (userName !== "ebrain") {
    userNameError.textContent = "Invalid Username";
    valid = false;
  }

  if (!password) {
    passwordError.textContent = "Password is required";
    valid = false;
  } else if (password !== "Ji#993te") {
    passwordError.textContent = "Invalid Password";
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

      const { opaque, accessCode, jwt } = data.data;
      localStorage.setItem("opaque", opaque);
      localStorage.setItem("accessCode", accessCode);
      localStorage.setItem("jwtToken", jwt);

      showOtpModal(accessCode, opaque);

      document.getElementById("username").value = "";
      document.getElementById("password").value = "";
      loginMessage.style.color = "green";
    } else {
      loginMessage.style.color = "red";
    }
  } catch (error) {
    console.error("Fetch failed:", error);
  }
}

function showOtpModal(accessCode, opaque) {
  document.getElementById("otpModal").style.display = "flex";
  document.getElementById("otpInput").value = accessCode;
  document.getElementById("opaque").textContent = opaque;
  startTimer(30);
}

function closeOtpModal() {
  document.getElementById("otpModal").style.display = "none";
  clearInterval(timerInterval);
}

function submitOTP() {
  const entered = document.getElementById("otpInput").value.trim();
  const opaque = document.getElementById("opaque").textContent.trim();
  const jwtToken = localStorage.getItem("jwtToken");
  const accessCode = entered;

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
      if (data?.data?.isValidAccessCode) {
        alert("OTP Verified Successfully!");
        closeOtpModal();
      }
      else {
        alert("Invalid OTP. Please try again.");
      }
    })
    .catch((err) => {
      console.error("OTP Error:", err);
      alert("OTP Verification Failed.");
    });
}

function resendOtp() {
  const jwtToken = localStorage.getItem("jwtToken");
  const opaque = localStorage.getItem("opaque");
  const accessCode = localStorage.getItem("accessCode");

  const payload = {
    opaque: opaque,
    accessCode: accessCode
  };

  fetch("https://hastin-container.com/staging/app/auth/access-code/resend", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "authorization": "BslogiKey " + jwtToken
    },
    body: JSON.stringify(payload)
  })
    .then((res) => {
      if (!res.ok) {
        throw new Error("Invalid response");
      }
      return res.json();
    })
    .then((data) => {
      console.log("Resend OTP Response:", data);

      const { opaque, accessCode } = data.data;

      document.getElementById("opaque").textContent = opaque;
      document.getElementById("otpInput").value = accessCode;

      localStorage.setItem("opaque", opaque);
      localStorage.setItem("accessCode", accessCode);

      startTimer(30);
      alert("OTP Resent Successfully!");
    })
    .catch((err) => {
      console.error("Resend OTP Error:", err);
      alert("Failed to resend OTP. Try again.");
    });
}



let timerInterval;

function startTimer(seconds) {
  const timerDisplay = document.getElementById("timer");
  const submitBtn = document.getElementById("otpSubmitBtn");
  const resendBtn = document.getElementById("resendBtn");
  let time = seconds;

  clearInterval(timerInterval);

  submitBtn.style.display = "inline-block";
  resendBtn.style.display = "none";
  submitBtn.disabled = false;
  submitBtn.style.opacity = "1";

  timerInterval = setInterval(() => {
    const min = String(Math.floor(time / 60)).padStart(2, "0");
    const sec = String(time % 60).padStart(2, "0");
    timerDisplay.textContent = `${min}:${sec}`;
    time--;

    if (time < 0) {
      clearInterval(timerInterval);
      timerDisplay.textContent = "00:00";

      // Hide Submit, show Resend
      submitBtn.style.display = "none";
      resendBtn.style.display = "inline-block";

      // Clear OTP values
      document.getElementById("opaque").textContent = "";
      document.getElementById("otpInput").value = "";
      localStorage.removeItem("opaque");
      localStorage.removeItem("accessCode");
    }
  }, 1000);
}



// Show/hide password toggle
function my() {
  const x = document.getElementById("password");
  x.type = x.type === "password" ? "text" : "password";
}

// Clear validation error on focus
document.getElementById("username").addEventListener("focus", () => {
  document.getElementById("usernameError").textContent = "";
});

document.getElementById("password").addEventListener("focus", () => {
  document.getElementById("passwordError").textContent = "";
});
