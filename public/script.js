// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyClB58cNBJzkgCKh7lDHv6AtXHU-Q9LCjU",
  authDomain: "potterheads-cd745.firebaseapp.com",
  projectId: "potterheads-cd745",
  storageBucket: "potterheads-cd745.firebasestorage.app",
  messagingSenderId: "548362852986",
  appId: "1:548362852986:web:be35c4522570eb6e86b9c3"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();

// Function to check authentication status and redirect if not authenticated
function checkAuthState() {
    auth.onAuthStateChanged(function(user) {
        if (!user) {
            // No user is signed in, redirect to login page
            window.location.href = 'login.html';
        }
    });
}

// Apply authentication check to all pages except login and signup
if (window.location.pathname !== '/login.html' && window.location.pathname !== '/signup.html' && window.location.pathname !== '/reset-password.html') {
    checkAuthState();
}

// Login form submission
const loginForm = document.getElementById('login-form');
if (loginForm) {
    loginForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        auth.signInWithEmailAndPassword(email, password)
            .then((userCredential) => {
                // Signed in
                window.location.href = 'index.html';
            })
            .catch(function(error) {
                document.getElementById("message").innerHTML = error.message;
            });
    });
}

// Sign-up form submission
const signupForm = document.getElementById('signup-form');
if (signupForm) {
    signupForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        auth.createUserWithEmailAndPassword(email, password)
            .then((userCredential) => {
                // Signed up
                window.location.href = 'login.html';
            })
            .catch(function(error) {
                document.getElementById("message").innerHTML = error.message;
            });
    });
}

// Logout button
const logoutButton = document.getElementById('logout-button');
if (logoutButton) {
    logoutButton.addEventListener('click', function() {
        auth.signOut()
            .then(function() {
                // Sign-out successful.
                window.location.href = 'login.html'; // Redirect to login page
            })
            .catch(function(error) {
                // An error happened.
                console.error('Logout error:', error);
            });
    });
}

document.addEventListener('DOMContentLoaded', setupHomePage);
function setupHomePage() {
    const userInfo = document.getElementById('userInfo'); //To verify the data can be sent
    auth.onAuthStateChanged(function(user) {
        if (user) {
            const displayName = user.displayName;
            const email = user.email;
            const uid = user.uid;
            const db = firebase.firestore();
            db.collection("users").doc(uid)
                .get()
                .then(function(doc) {
                    if (doc.exists) {
                        const house = doc.data().house;
                        // User is signed in.
                        userInfo.innerHTML = `

 Email: ${email} </br>
 Your house is ${house}!

`;
                        //To render all the names. For each one of them.
                    } else {
                        //Show other Data
                        userInfo.innerHTML = `

Please take the quiz to record your house!

`;
                    }
                }).catch(function(error) {
                // An error happened.
                    console.error('Authentication error:', error);
                });
        } else {
            // No user is signed in.
            userInfo.innerHTML = `
 

Please login to view the Home page

`;
        }
    });
}


const resetPasswordForm = document.getElementById('reset-password-form');
if (resetPasswordForm) {
    resetPasswordForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const email = document.getElementById('email').value;

        firebase.auth().sendPasswordResetEmail(email)
            .then(function() {
                // Password reset email sent.
                document.getElementById("message").innerHTML = "Password reset email sent. Check your inbox.";
            })
            .catch(function(error) {
                // An error happened.
                document.getElementById("message").innerHTML = error.message;
            });
    });
}