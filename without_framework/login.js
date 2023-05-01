function waitLoad() {
    if (sessionStorage.getItem('JWT') != null) {
        alert('You are already logged in');
        window.location.href = './wallets.html';
    }
}

window.onload += setTimeout(waitLoad, 100);

const loginBtn = document.getElementById('login-button');

async function login() {
    const form = document.getElementById('form');
    function handleForm(event) { event.preventDefault(); }
    form.addEventListener('submit', handleForm);

    if (sessionStorage.getItem('JWT') !== null) {
        alert('Already logged in. Logout first');
    } else {
        const email = document.getElementById('login').value;
        const password = document.getElementById('password').value;
        const url = 'http://127.0.0.1:5000/user/login';
        const response = await fetch(url,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json; charset=utf-8',
                },
                body: JSON.stringify({
                    email,
                    password,
                }),
            });
        const json = await response.json();
        if (json.error !== undefined) {
            alert(`Error${json.error.code}: ${json.error.message}`);
        } else {
            sessionStorage.setItem('JWT', json.access_token);
            window.location.href = './wallets.html';
        }
    }
}

loginBtn.addEventListener('click', login);
