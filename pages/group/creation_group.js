import {token, userId} from './../../js/validateAuth.js';
import {selectedMembers} from './creation_group_front.js';

document.addEventListener("DOMContentLoaded", function () {
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
        if (!data) {
            console.log('No existe ningún usuario');
            return;
        }
        const selectMembers = document.getElementById("selectMembers");

        data.forEach(item => {
            const option = document.createElement("option");
            option.value = JSON.stringify(item); // Convert the item object to JSON for the value
            option.textContent = item.firstName + " " + item.lastName; // Assuming 'name' is the display text
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
    const leaderId = userId;

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
        if (!res.ok) throw new Error("No se pudo obtener la información de los usuarios.");
        return res.json();
    })
    .then(data => {
        if (!data) {
            console.log('No se pudo crear el grupo');
            return;
        }

        const groupId = data.id; 

        selectedMembers.forEach(member => sendMemberRequest(member.id, groupId));
        window.location.reload();
    })
    .catch(error => {
        console.error('Error:', error);
    });
});

export function sendMemberRequest(userId, groupId) {
    const groupData = {
        user: {id: userId},
        group: {id: groupId}
    };
    console.log('Enviando solicitud para asociar miembro al grupo:', JSON.stringify(groupData));

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
        if (!data) {
            console.log('No se pudo asociar el miembro');
            return;
        }

        console.log('Miembro asociado correctamente:', data);
    })
    .catch(error => {
        console.error('Error:', error);
    });
}