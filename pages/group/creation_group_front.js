export let selectedMembers = [];

document.getElementById('addMemberBtn').addEventListener('click', function (e) {
    e.preventDefault(); // Prevent the page from reloading on button click

    const selectElement = document.getElementById('selectMembers');
    const selectedValue = selectElement.value;

    if (selectedValue) {
        const member = JSON.parse(selectedValue);
        selectedMembers.push(member);

        const membersList = document.getElementById('membersList');
        const li = document.createElement('li');
        li.textContent = member.firstName + ' ' + member.lastName;
        membersList.appendChild(li);

        li.addEventListener('click', function () {
            membersList.removeChild(li);
            const index = selectedMembers.indexOf(member);
            if (index > -1) {
                selectedMembers.splice(index, 1);
            }
        });

        selectElement.value = '';
    } else {
        alert('Please select a member.');
    }
});