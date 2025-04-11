import { getToken, getUserId } from './../../js/validateAuth.js';
import { selectedMembers } from './creation_group_front.js';

document.addEventListener("DOMContentLoaded", function () {
    const token = getToken();

    fetch(`http://localhost:8080/api/users`, {
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
        const selectMembers = document.getElementById("selectMembers");

        data.forEach(item => {
            const option = document.createElement("option");
            option.value = JSON.stringify(item);
            option.textContent = item.firstName + " " + item.lastName;
            selectMembers.appendChild(option);
        });  
    })
    .catch(error => {
        console.error('Error:', error);
    });
});

document.getElementById('submitBtn').addEventListener('click', function (e) {
    e.preventDefault();

    const name = document.getElementById('groupName').value;
    const leaderId = getUserId();
    const token = getToken();

    const groupData = {
        name: name,
        leader: {id: leaderId},
    };

    fetch(`http://localhost:8080/api/groups`, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(groupData)
    })
    .then(res => {
        if (!res.ok) throw new Error("No se pudo crear el grupo.");
        return res.json();
    })
    .then(data => {
        const groupId = data.id; 
        selectedMembers.forEach(member => sendMemberRequest(member.id, groupId));
        alert('Grupo creado exitosamente');
    })
    .catch(error => {
        console.error('Error:', error);
    });
});

export function sendMemberRequest(userId, groupId) {
    const token = getToken();
    const groupData = {
        user: {id: userId},
        group: {id: groupId}
    };

    fetch(`http://localhost:8080/api/group-members`, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(groupData)
    })
    .then(res => {
        if (!res.ok) throw new Error("No se pudo asociar el miembro al grupo.");
        return res.json();
    })
    .then(data => {
        console.log('Miembro asociado correctamente:', data);
    })
    .catch(error => {
        console.error('Error:', error);
    });
}
