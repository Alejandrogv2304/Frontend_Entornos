import {token, userId} from './../../js/validateAuth.js';

document.addEventListener("DOMContentLoaded", function () {
    fetch(`http://localhost:8080/api/projects`, {
        method: 'GET',
        headers: {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${token}`
        }
    })
    .then(res => {
        if (!res.ok) throw new Error("No se pudo obtener la información de los proyectos.");
        return res.text().then(text => text ? JSON.parse(text) : {});
    })
    .then(data => {
        if (!data) {
            console.log('No existe ningún proyecto');
            return;
        }

        const selectEditProject = document.getElementById("selectEditProject");
        data.forEach(item => {
            const option = document.createElement("option");
            option.value = item.id; // Convert the item object to JSON for the value
            option.textContent = item.title; // Assuming 'name' is the display text
            selectEditProject.appendChild(option);
        });  


    })
    .catch(error => {
        console.error('Error:', error);
    });

    fetch(`http://localhost:8080/api/groups`, {
        method: 'GET',
        headers: {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${token}`
        }
    })
    .then(res => {
        if (!res.ok) throw new Error("No se pudo obtener la información de los usuarios.");
        return res.json();
    })
    .then(data => {
        if (!data) {
            console.log('No existe ningún usuario');
            return;
        }
        const selectEditProject = document.getElementById("selectGroup");
        data.forEach(item => {
            const option = document.createElement("option");
            option.value = item.id; // Convert the item object to JSON for the value
            option.textContent = item.name; // Assuming 'name' is the display text
            selectEditProject.appendChild(option);
        });  

       
    })
    .catch(error => {
        console.error('Error:', error);
    });

   
});

document.getElementById('selectEditProject').addEventListener('change', function (e) {
    
    let projectId = document.getElementById('selectEditProject').value;
    fetch(`http://localhost:8080/api/projects/${projectId}`, {
        method: 'GET',
        headers: {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${token}`
        }
    })
    .then(res => {
        if (!res.ok) throw new Error("No se pudo obtener la información de los usuarios.");
        return res.json();
    })
    .then(data => {
        if (!data) {
            console.log('No existe ningún usuario');
            return;
        }

        const proyectTitle = document.getElementById("projectTitle");
        const proyectDescription = document.getElementById("projectDescription");
        const proyectRepo = document.getElementById("projectLinkRepo");
        const proyectStatus = document.getElementById("selectStatus");
        const proyectGroup = document.getElementById("selectGroup");
        
        proyectTitle.value = data?.title || "";
        proyectDescription.value = data?.description || "";
        proyectRepo.value = data?.repo_link || "";
        proyectStatus.value = data?.status || "";
        proyectGroup.value = data?.group?.id || "";
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
    let projectId = document.getElementById('selectEditProject').value;
    projectId = parseInt(projectId);

    const projectData = {
        id: projectId,
        title: projectTitle,
        description: projectDescription,
        repo_link: projectRepo,
        group: {id: projectGroup},
        status: projectStatus,
    };
    let leaderId = userId;
    fetch(`http://localhost:8080/api/projects`, {
        method: 'PUT',
        headers: {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(projectData)
    })
    .then(res => {
        if (!res.ok) throw new Error("No se pudo actualizar el grupo.");
        return res.json();
    })
    .then(data => {
        console.log('Proyecto actualizado:', data);
        window.location.reload();
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Error al actualizar el grupo.');
    });

});


document.getElementById('deleteBtn').addEventListener('click', function (e) {
    e.preventDefault();
    const projectId = document.getElementById('selectEditProject').value;

    fetch(`http://localhost:8080/api/projects/${projectId}`, {
        method: 'DELETE',
        headers: {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
            id: parseInt(projectId)
        })
    })
    .then(res => {
        console.log(res.status); // Log status code
        console.log(res.headers);
        if (!res.ok) throw new Error("No se pudo eliminar el proyecto.");
        if (res.status === 204) {
            return null;  // Return null for 204 No Content responses
        }

        return res.json();
    })
    .then(data => {
        window.location.reload();
    })
    .catch(error => {
        console.error('Error:', error);
    });
});

