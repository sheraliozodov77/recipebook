/*
 * Author: Igor, John, Sherali, Khamdam
 * Date: 12/06/2023
 * Class: CSC 337
 * Instructor: Benjamin Dicken
 *
 * Description: This script is responsible for setting up
 * the client side of the Recipe Sharing application.
 * Allowing the client to send requests to create users,
 * login etc.
 */


document.addEventListener('DOMContentLoaded', function() {
  const loginForm = document.getElementById('userForm');
  if (loginForm) {
     /**
      * Description: Sets up an event listener for the login form. On form submission,
      * it sends the user's credentials to the server for authentication. If 
      * successful, redirects to the home page, else displays an error message.
      *
      * Parameters: None
      * Return: None
     */
      loginForm.addEventListener('submit', function(event) {
          event.preventDefault();
          const username = document.getElementById('usernameLogin').value;
          const password = document.getElementById('passwordLogin').value;

          fetch('/login', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ username, password }),
              credentials: 'same-origin'
          })
          .then(response => response.json())
          .then(data => {
              if (data.success) {
                  localStorage.setItem('sessionId', data.sessionId);
                  window.location.href = '/home.html';
              } else {
                  alert('Login failed: ' + data.message);
              }
          })
          .catch(error => {
              console.error('Error:', error);
          });
      });
  }

  const createAccountForm = document.getElementById('createForm');
  if (createAccountForm) {
      /**
       * Description: Sets up an event listener for the account creation form. 
       * On submission, it sends the new account's details to the server. If account
       * creation is successful, redirects to the login page,
       * otherwise displays an error message.
       *
       * Parameters: None
       * Return: None
       */
      createAccountForm.addEventListener('submit', function(event) {
          event.preventDefault();
          const username = document.getElementById('usernameCreate').value;
          const password = document.getElementById('passwordCreate').value;
          const firstName = document.getElementById('firstNameCreate').value;
          const lastName = document.getElementById('lastNameCreate').value;
          const createAccountForm = document.getElementById('createForm');

          fetch('/create-account', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ username, password, firstName, lastName })
          })
          .then(response => response.json())
          .then(data => {
              if (data.success) {
                  alert('Account created successfully!');
                  window.location.href = '/signin.html';
              } else {
                  alert('Account creation failed: ' + data.message);
              }
          })
          .catch(error => {
              console.error('Error:', error);
          });
      });
  }
});

const logoutButton = document.getElementById('logout');
if (logoutButton) {
    logoutButton.addEventListener('click', function() {
        fetch('/logout', {
            method: 'POST',
            credentials: 'same-origin'
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Redirect to the login page or index page after successful logout
                window.location.href = '/index.html';
            } else {
                alert('Logout failed: ' + data.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    });
}

document.addEventListener('DOMContentLoaded', function() {
    const profileForm = document.getElementById('profileForm');
    if (profileForm) {
        profileForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const formData = new FormData(this);
            fetch('/update-profile', {
                method: 'PUT',
                credentials: 'include',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                // Check if the update was successful
                if (data.success) {
                    alert('Profile updated successfully.');
                    window.location.href = '/myprofile.html';
                } else {
                    // Handle cases where 'success' is false
                    alert('Failed to update profile: ' + (data.message || 'Unknown error'));
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('An error occurred while updating your profile.');
            });
        });
    }

    const imageUpload = document.getElementById('imageUpload');
    if (imageUpload) {
        imageUpload.addEventListener('change', function(e) {
            const reader = new FileReader();
            reader.onload = function(event) {
                document.getElementById('profileImage').src = event.target.result;
            };
            reader.readAsDataURL(e.target.files[0]);
        });
    }
});

document.addEventListener('DOMContentLoaded', function() {
    // Fetch user profile data
    fetch('/get-user-profile', {
        method: 'GET',
        credentials: 'include'
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        const profileImage = document.getElementById('profileImage');
        const userName = document.getElementById('userName');
        const userBio = document.getElementById('userBio');
        const firstNameInput = document.getElementById('firstName');
        const lastNameInput = document.getElementById('lastName');
        const bioInput = document.getElementById('bio');

        // Update profile image, name, and bio display
        if (data.profileImage) {
            profileImage.src = data.profileImage;
        } else {
            profileImage.src = '/default_profile.png';
        }
        if (userName) {
            userName.textContent = `${data.firstName} ${data.lastName}`;
        }
        if (userBio) {
            userBio.textContent = data.bio;
        }

        // Set form fields values for editing
        if (firstNameInput) {
            firstNameInput.value = data.firstName || '';
        }
        if (lastNameInput) {
            lastNameInput.value = data.lastName || '';
        }
        if (bioInput) {
            bioInput.value = data.bio || '';
        }
    })
    .catch(error => {
        console.error('Error fetching user data:', error);
    });
});

document.addEventListener('DOMContentLoaded', function() {
    const recipeForm = document.getElementsByClassName('recipeForm')[0];
    if (recipeForm) {
      recipeForm.addEventListener('submit', function(event) {
        event.preventDefault();
  
        const formData = new FormData(recipeForm);
  
        fetch('/add/recipe', {
          method: 'POST',
          body: formData,
          credentials: 'include'
        })
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then(data => {
          if (data.success) {
            alert('Recipe posted successfully!');
            window.location.href = '/home.html';
          } else {
            alert('Failed to post recipe: ' + data.message);
          }
        })
        .catch(error => {
          console.error('Error:', error);
          alert('An error occurred while posting the recipe.');
        });
      });
    }
  });
  