import {token, userId} from './../../js/validateAuth.js';

document.addEventListener("DOMContentLoaded", function () {
    
    fetch(`http://localhost:8080/api/users/${userId}`, {
        method: 'GET',
        headers: {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${token}`
        }
    })
    .then(res => {
        if (!res.ok) throw new Error("No se pudo obtener la información del usuario.");
        return res.json();
    })
    .then(data => {
        if (!data) {
            console.log('No user data found');
            return;
        }

        document.getElementById('firstName').value = data.firstName || '';
        document.getElementById('lastName').value = data.lastName || '';
        document.getElementById('email').value = data.email || '';
        document.getElementById('program').value = data.program || '';
        document.getElementById('description').value = data.description || '';

        document.getElementById('resume-name').innerHTML = `${data.firstName} ${data.lastName} <img src="./../../assets/logo_alterno.svg" alt="logo">` || '';
        document.getElementById('resume-email').textContent = data.email || '';
        document.getElementById('resume-program').textContent = data.program || '';
        document.getElementById('resume-description').textContent = data.description || '';
        document.getElementById('resume-userSince').textContent = `Usuario desde: ${new Date(data.createdAt).getFullYear()}` || ''; // Assuming the backend sends `createdAt` field
  
    })
    .catch(error => {
        console.error('Error:', error);
    });
});

document.getElementById('submitBtn').addEventListener('click', function (e) {
    e.preventDefault();
    
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const program = document.getElementById('program').value;
    const description = document.getElementById('description').value;
    
    const userData = {
        id: userId, 
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: password,
        program: program,
        description: description
    };

    console.log('Sending userData:', userData);

    fetch(`http://localhost:8080/api/users/${userId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(userData)
    })
    .then(response => {
        if (response.ok) {
            return response.json();
        } else {
            throw new Error('Failed to update user');
        }
    })
    .then(data => {
        console.log('User updated:', data);
        let errors = [];

        const firstName = document.getElementById('firstName').value;
        const lastName = document.getElementById('lastName').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password') ? document.getElementById('password').value : '';
        const confirmPassword = document.getElementById('confirmPassword') ? document.getElementById('confirmPassword').value : '';
        const program = document.getElementById('program').value;
        const description = document.getElementById('description').value;

        if (firstName.trim() === "") {
            errors.push("El nombre es obligatorio.");
        }

        if (lastName.trim() === "") {
            errors.push("El apellido es obligatorio.");
        }

        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (email.trim() === "") {
            errors.push("El correo electrónico es obligatorio.");
        } else if (!emailRegex.test(email)) {
            errors.push("El correo electrónico no es válido.");
        }

        if (password.trim() === "") {
            errors.push("La contraseña es obligatoria.");
        }

        if (confirmPassword.trim() === "") {
            errors.push("La confirmación de la contraseña es obligatoria.");
        } else if (password !== confirmPassword) {
            errors.push("Las contraseñas no coinciden.");
        }

        if (!program) {
            errors.push("Selecciona un programa.");
        }

        if (description.trim() === "") {
            errors.push("La descripción es obligatoria.");
        }

        const errorMessagesContainer = document.getElementById('errorMessages');
        if (errors.length > 0) {
            if (errorMessagesContainer) {
                errorMessagesContainer.innerHTML = '';
                const ul = document.createElement('ul');
                errors.forEach(error => {
                    const li = document.createElement('li');
                    li.textContent = error;
                    ul.appendChild(li);
                });
                errorMessagesContainer.appendChild(ul);
            } else {
                console.error("Error: 'errorMessages' container not found in the DOM.");
            }
            return; 
        }

        openSuccessModal();
    })
    .catch(error => {
        console.error('Error:', error);
    });
});

function openSuccessModal() {
  const modal = document.getElementById('successModal');
  modal.style.display = "block"; // Show the modal

  document.getElementById('closeModalBtn').onclick = function () {
      modal.style.display = "none";
      window.location.reload();
  }

  // Close the modal when the user clicks anywhere outside of it
  window.onclick = function (event) {
      if (event.target === modal) {
          modal.style.display = "none";
          window.location.reload();
      }
  }
}
