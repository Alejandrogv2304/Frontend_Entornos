document.getElementById("loginForm").addEventListener("submit", async function(event) {
    event.preventDefault(); // Evita que el formulario recargue la página

    const correo = document.getElementById("email").value;
    const contraseña = document.getElementById("password").value;

    const data = {
        email: correo,
        password: contraseña
    };
  

    try {
        const response = await fetch("http://localhost:8080/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                
            },
            body: JSON.stringify(data)
        });

        const result = await response.text();

        if (response.ok) {
            localStorage.setItem("token", result); // Guarda el token en el navegador
            alert("Login exitoso");
            window.location.href = "./../pages/projects/projects.html";
        } else {
            alert("Error al iniciar sesión");
        }
        
    } catch (error) {
        console.error("Error en la petición:", error);
        alert("Error al conectar con el servidor");
    }
});