export function getToken() {
    return localStorage.getItem('token');
}

export function getUserId() {
    const tokenData = localStorage.getItem('token');
    if (tokenData) {
        try {
            const parsedData = JSON.parse(tokenData);
            return parsedData.userId;
        } catch (err) {
            console.error('Token malformado:', err);
            window.location.href = './../index.html';
        }
    } else {
        window.location.href = './../index.html';
    }
}
