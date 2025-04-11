// Define logout function globally

function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');

    window.location.reload();
}

document.addEventListener("DOMContentLoaded", function () {
    const navbarLinks = document.getElementById("navbar__links-list");
    const tokenData = localStorage.getItem('token');
    console.log(tokenData);
    
    if (tokenData) {
        navbarLinks.innerHTML += `<li><button id="logoutBtn">Logout</button></li>`;
        
        document.getElementById('logoutBtn').addEventListener('click', function () {
            logout();
        });
    } else {
        navbarLinks.innerHTML += `<li><a href="./../index.html">Login</a></li>`;
    }
});
