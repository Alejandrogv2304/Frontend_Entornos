
export let token = null;
export let userId = null;

document.addEventListener("DOMContentLoaded", function () {
    const tokenData = localStorage.getItem('token');
    
    if (tokenData) {
        const parsedData = JSON.parse(tokenData);
        userId = parsedData.userId;
        token = parsedData.token;
        
    } else {
        window.location.href = './../landing.html';
        return;
    }});