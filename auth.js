// auth.js
const auth = firebase.auth();

document.addEventListener('DOMContentLoaded', () => {
  // Login
  const loginButton = document.getElementById('login-button');
  if (loginButton) {
    loginButton.addEventListener('click', () => {
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;

      auth.signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
          // Redirect to dashboard
          window.location.href = 'index.html';
        })
        .catch((error) => {
          document.getElementById('error-message').textContent = 'Login Failed';
          alert('Login Failed');
        });
    });
  }

  // Register
  const registerButton = document.getElementById('register-button');
  if (registerButton) {
    registerButton.addEventListener('click', () => {
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;

      auth.createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
          // Show registration success message
          alert('Registration successful');
          // Redirect to login
          window.location.href = 'login.html';
        })
        .catch((error) => {
          document.getElementById('error-message').textContent = error.message;
        });
    });
  }

  // Logout
  const logoutButton = document.getElementById('logout-button');
  if (logoutButton) {
    logoutButton.addEventListener('click', () => {
      auth.signOut().then(() => {
        window.location.href = 'login.html';
      }).catch((error) => {
        console.error('Logout error:', error);
      });
    });
  }
});
