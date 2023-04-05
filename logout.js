const logoutBtn = document.getElementById('logout-button');

async function logout() {
    sessionStorage.removeItem('JWT');
    alert('Logged out successfuly!');
    window.location.reload();
}

logoutBtn.addEventListener('click', logout);
