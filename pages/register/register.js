document.getElementById("registerForm").addEventListener("submit", async function(event) {
    event.preventDefault();

    const program = document.getElementById("program").value;
    const description = document.getElementById("description").value;
    const firstName = document.getElementById("firstname").value;
    const lastName = document.getElementById("lastname").value;
    const correo = document.getElementById("email").value;
    const contraseña = document.getElementById("password").value;

     // Validaciones previas
     if (!firstName || !lastName || !correo || !contraseña || !program) {
        alert("Todos los campos son obligatorios.");
        return;
    }

    const data = {
        program: program,
        firstName: firstName,
        lastName: lastName,
        password: contraseña,
        email: correo,
        description: description
    };

    try {
        const response = await fetch("http://localhost:8080/auth/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (response.ok) {
            
            alert("Registro exitoso");
            window.location.href = "../login/login.html"; // Redirigir al login después del registro
        } else {
            alert("Error: " + result.message);
        }
    } catch (error) {
        console.error("Error en la petición:", error);
        alert("Error al conectar con el servidor");
    }
});
