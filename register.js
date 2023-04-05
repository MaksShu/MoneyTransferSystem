function waitLoad() {
    if (sessionStorage.getItem('JWT') != null) {
        alert('You are already logged in');
        window.location.href = './wallets.html';
    }
}

window.onload = setTimeout(waitLoad, 100);

const registerBtn = document.getElementById('register-button');

async function register() {
    const form = document.getElementById('form');
    function handleForm(event) { event.preventDefault(); }
    form.addEventListener('submit', handleForm);

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const name = document.getElementById('name').value;
    const surname = document.getElementById('surname').value;
    const url = 'http://127.0.0.1:5000/user';
    const response = await fetch(url,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
            },
            body: JSON.stringify({
                first_name: name,
                last_name: surname,
                email,
                password,
            }),
        });
    const json = await response.json();
    if (json.error !== undefined) {
        alert(`Error${json.error.code}: ${json.error.message}`);
    } else {
        alert('Successful registeration!');
        window.location.href = './login.html';
    }
}

registerBtn.addEventListener('click', register);
