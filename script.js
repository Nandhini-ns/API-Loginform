const form=document.getElementById("loginForm");
const usernameInput=document.getElementById("username");
const passwordInput=document.getElementById("password");
const usernameError=document.getElementById("usernameError");
const passwordError=document.getElementById("passwordError");
const loginMessage=document.getElementById("loginMessage");


const otpBox=document.getElementById("otpBox");
const otpDisplay=document.getElementById("otpDisplay");
const timerDisplay=document.getElementById("timer");

//Correct login credentials(You can connect API here)
//const validCredentials={
 //   username:"ebrain",
 //   password:"Ji#993te"
//};
//Login Submit Event
form.addEventListener("submit",function(e){
    e.preventDefault();

    //clear previous errors
    usernameError.textContent="";
    passwordError.textContent="";
    loginMessage.textContent="";
    otpBox.style.display = "none";

    const username=usernameInput.value.trim();
    const password=passwordInput.value.trim();

    let valid = true;

  if (!username) {
    usernameError.textContent = "Username is required";
    valid = false;
  }

  if (!password) {
    passwordError.textContent = "Password is required";
    valid = false;
  }

  if(!valid) return;

   loginWithAPI(username,password)
   .then((data)=>{
    //login success
    if (username === "ebrain" && password === "Ji#993te") {
    loginMessage.innerHTML=`Welcome, <strong>${data.username}</strong>!`;
    const otp = generateOTP();
    otpDisplay.textContent=otp;
    otpBox.style.display="block";
    startOTPTimer(30);
     } else {
        usernameError.textContent = "Invalid username or password";
      }
   }) 
//    .catch((err)=>{
//     // if (err.message=== "Invalid credentials"){
//     //     usernameError.textContent="Invalid username or password";
//     // } else{
//         loginMessage.textContent="Login faild. Please try again.";
//     }
//    });
.catch(() => {
      loginMessage.textContent = "Login failed. Please try again.";
    });
});

//API call using fetch()
function loginWithAPI(username,password){
    return fetch("https://hastin-container.com/staging/app/auth/login", {
        //Replace with your real API Url
        method:"POST",
        headers:{
            "Content-Type":"application/json"
        },
        body:JSON.stringify({
            username: username,
            password:password
        })
    })
    .then(Response =>{
        if(!Response.ok){
            throw new Error("API failed");   //Invalid credentials
        }
        return Response.json(); //example:{username:"ebrain"}
    });
}

//Generate random 6-digit OTP
function generateOTP(){
    return Math.floor(100000+Math.random()*900000);
}


//Start OTP countdown timer
function startOTPTimer(seconds){
    let timeLeft = seconds;
timerDisplay.textContent=timeLeft;

    const interval=setInterval(()=>{
        timeLeft--;
        timerDisplay.textContent=timeLeft;

        if(timeLeft<=0){
          clearInterval(interval);
      otpBox.innerHTML = `<h3>OTP Expired</h3><p>Please login again to get a new OTP.</p>`;  
        }
    },1000);
}