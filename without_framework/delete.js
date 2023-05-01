const deleteBtn = document.getElementById('delete-button');

async function deleteUser() {
    if (sessionStorage.getItem('JWT') == null) {
        alert('You are not logged in');
        window.location.href = './login.html';
    } else {
        const url = 'http://127.0.0.1:5000/user';
        const response = await fetch(url,
            {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json; charset=utf-8',
                    Authorization: `Bearer ${sessionStorage.getItem('JWT')}`,
                },
            });

        const json = await response.json();
        if (json.error === undefined) {
            alert('Deleted successfully');
            sessionStorage.removeItem('JWT');
            window.location.href = './login.html';
        } else {
            alert(`Error${json.error.code}: ${json.error.message}`);
        }
    }
}

deleteBtn.addEventListener('click', deleteUser);
