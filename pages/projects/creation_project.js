import {token, userId} from './../../js/validateAuth.js';
let groups;
document.addEventListener("DOMContentLoaded", function () {

    
    fetch(`http://localhost:8080/api/groups`, {
        method: 'GET',
        headers: {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${token}`
        }
    })
    .then(res => {
        if (!res.ok) throw new Error("No se pudo obtener la información de los grupos.");
        return res.json();
    })
    .then(data => {
        if (!data) {
            console.log('No existe ningún grupo');
            return;
        }

        const selectGroup = document.getElementById("selectGroup");

        console.log('Grupos obtenidos:', data);
        data.forEach(item => {
            const option = document.createElement("option");
            option.value = JSON.stringify(item); // Convert the item object to JSON for the value
            option.textContent = item.name; // Assuming 'name' is the display text
            selectGroup.appendChild(option);
        });
        groups = data; // Assign the entire data array to groups
  
    })
    .catch(error => {
        console.error('Error:', error);
    });
});

document.getElementById('submitBtn').addEventListener('click', function (e) {
    e.preventDefault();
    
    const projectTitle = document.getElementById('projectTitle').value;
    const projectDescription = document.getElementById('projectDescription').value;
    const projectRepo = document.getElementById('projectLinkRepo').value;
    const projectGroup = document.getElementById('selectGroup').value;
    const projectStatus = document.getElementById('selectStatus').value;
    const projectData = {
        title: projectTitle,
        description: projectDescription,
        repo_link: projectRepo,
        group: JSON.parse(projectGroup),
        status: projectStatus,
    };


    fetch(`http://localhost:8080/api/projects`, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(projectData)
    })
    .then(res => {
        if (!res.ok) throw new Error("No se pudo crear el proyecto.");
        return res.json();
    })
    .then(data => {
        console.log('Proyecto creado:', data);
        alert("Proyecto creado exitosamente");
        window.location.reload();
    })
    .catch(error => {
        console.error('Error:', error);
        alert("Error al crear el proyecto");
    });
});