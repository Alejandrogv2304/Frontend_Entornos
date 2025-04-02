document.getElementById("loginForm").addEventListener("submit", async function(event) {
    event.preventDefault(); // Evita que el formulario recargue la página

    const correo = document.getElementById("email").value;
    const contraseña = document.getElementById("password").value;

    const data = {
        email: correo,
        password: contraseña
    };

    try {
        const response = await fetch("http://localhost:8080/api/users", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (response.ok) {
            
            alert("Login exitoso");
            window.location.href = "projects.html"; // Redirigir a otra página después del login
        } else {
            alert("Error: " + result.message);
        }
    } catch (error) {
        console.error("Error en la petición:", error);
        alert("Error al conectar con el servidor");
    }
});
