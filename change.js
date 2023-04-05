let id = -1;

async function change() {
    const form = document.getElementById('form');
    function handleForm(event) { event.preventDefault(); }
    form.addEventListener('submit', handleForm);

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const name = document.getElementById('name').value;
    const surname = document.getElementById('surname').value;
    const url = `http://127.0.0.1:5000/user/${id}`;

    let body = null;
    if (password !== '') {
        body = JSON.stringify({
            first_name: name,
            last_name: surname,
            email,
            password,
        });
    } else {
        body = JSON.stringify({
            first_name: name,
            last_name: surname,
            email,
        });
    }

    const response = await fetch(url,
        {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
                Authorization: `Bearer ${sessionStorage.getItem('JWT')}`,
            },
            body,
        });
    const json = await response.json();
    if (json.error !== undefined) {
        alert(`Error${json.error.code}: ${json.error.message}`);
    } else {
        window.location.href = './users.html';
    }
}

function waitLoad() {
    if (sessionStorage.getItem('JWT') == null) {
        alert('Please login firstly');
        window.location.href = './login.html';
    } else {
        const emailInp = document.getElementById('email');
        const nameInp = document.getElementById('name');
        const surnameInp = document.getElementById('surname');
        const url = 'http://127.0.0.1:5000/user';

        const afunction = async function f() {
            const response = await fetch(url,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json; charset=utf-8',
                        Authorization: `Bearer ${sessionStorage.getItem('JWT')}`,
                    },
                });

            const json = await response.json();
            if (json.msg !== undefined) {
                alert(`Error401: ${json.msg}. Login again`);
                sessionStorage.removeItem('JWT');
                window.location.href = './login.html';
            } else {
                id = json.id;
                emailInp.value = json.email;
                nameInp.value = json.first_name;
                surnameInp.value = json.last_name;
            }
        };

        const start = async function g() {
            afunction();
        };

        start();

        const changeBtn = document.getElementById('change-button');

        changeBtn.addEventListener('click', change);
    }
}

window.onload = setTimeout(waitLoad, 100);
