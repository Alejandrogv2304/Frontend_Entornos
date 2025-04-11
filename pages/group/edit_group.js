import {token, userId} from './../../js/validateAuth.js';
import {selectedMembers} from './creation_group_front.js';
let prevSelectedMembers;

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
        return res.text().then(text => text ? JSON.parse(text) : {});
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
        const selectEditGroup = document.getElementById("selectEditGroup");
        data.forEach(item => {
            const option = document.createElement("option");
            option.value = item.id; // Convert the item object to JSON for the value
            option.textContent = item.name; // Assuming 'name' is the display text
            if (item.leader != null) item.leader.id === userId ? selectEditGroup.appendChild(option) : null;
        });  
    })
    .catch(error => {
        console.error('Error:', error);
    });

   
});

document.getElementById('selectEditGroup').addEventListener('change', function (e) {
    
    let groupId = document.getElementById('selectEditGroup').value;

    fetch(`http://localhost:8080/api/group-members/group/${groupId}`, {
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

        const groupNameInput = document.getElementById("groupName");
        groupNameInput.value = data[0]?.group?.name || ""; // Set the group name if available

        const membersList = document.getElementById("membersList");
        membersList.innerHTML = ""; // Clear the list before adding new members
        selectedMembers.length = 0;
        data.forEach(member => {
            const listItem = document.createElement("li");
            listItem.textContent = `${member.user.firstName} ${member.user.lastName}`; // Assuming 'firstName' and 'lastName' are the member's properties
            membersList.appendChild(listItem);
            listItem.addEventListener('click', function () {
                membersList.removeChild(listItem);
                const index = selectedMembers.indexOf(member.user);
                if (index > -1) {
                    selectedMembers.splice(index, 1);
                }
            });
            selectedMembers.push(member.user);
        });

        prevSelectedMembers = selectedMembers.map(member => ({ ...member }));
    })
    .catch(error => {
        console.error('Error:', error);
    });

});

document.getElementById('submitBtn').addEventListener('click', function (e) {
    e.preventDefault();
    const groupName = document.getElementById('groupName').value;
    const groupId = document.getElementById('selectEditGroup').value;

    const parsedId = parseInt(groupId);
    if (isNaN(parsedId)) {
        alert("Por favor selecciona un grupo válido para editar.");
        return;
    }

    const groupData = {
        id: parsedId,
        name: groupName,
        leader: { id: userId }
    };

    console.log('Grupo a actualizar:', groupData);

    fetch(`http://localhost:8080/api/groups`, {
        method: 'PUT',
        headers: {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(groupData)
    })
    .then(res => {
        if (!res.ok) throw new Error("No se pudo actualizar el grupo.");
        return res.json();
    })
    .then(data => {
        deleteMemeberRequest();
        addNewMembersToGroup();

        setTimeout(() => window.location.reload(), 1000);
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Error al actualizar el grupo.');
    });
});



function deleteMemeberRequest() {
    const groupId = document.getElementById('selectEditGroup').value;
    const membersToDelete = prevSelectedMembers.filter(member => 
        !selectedMembers.some(selectedMember => selectedMember.id === member.id)
    );
    

    membersToDelete.forEach(member => {
        fetch(`http://localhost:8080/api/group-members/user/${member.id}/group/${groupId}`, {
            method: 'DELETE',
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${token}`
            }
        })
        .then(res => {
            if (!res.ok) throw new Error("No se pudo eliminar el miembro del grupo.");
            return res.json();
        })
        .then(data => {
            console.log('Miembro eliminado:', data);
        })
        .catch(error => {
            console.error('Error:', error);
        });
    });
    console.log('Miembros eliminados:', membersToDelete);
}

function sendMemberRequest(userId, groupId) {
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

function addNewMembersToGroup() {
    const groupId = parseInt(document.getElementById('selectEditGroup').value);
    
    const membersToAdd = selectedMembers.filter(member => 
        !prevSelectedMembers.some(prev => prev.id === member.id)
    );

    membersToAdd.forEach(member => {
        sendMemberRequest(member.id, groupId);
    });

    console.log('Miembros agregados:', membersToAdd);
}


document.getElementById('deleteBtn').addEventListener('click', function (e) {
    e.preventDefault();
    const groupId = document.getElementById('selectEditGroup').value;

    fetch(`http://localhost:8080/api/groups/${groupId}`, {
        method: 'DELETE',
        headers: {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
            id: parseInt(groupId)
        })
    })
    .then(res => {
        if (!res.ok) throw new Error("No se pudo eliminar el grupo.");
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
