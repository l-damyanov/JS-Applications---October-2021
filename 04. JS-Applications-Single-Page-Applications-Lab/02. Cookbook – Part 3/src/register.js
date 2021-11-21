import { setUserNav } from "./app.js";
import { showCatalog } from "./catalog.js";
import { showView } from "./dom.js";

const section = document.getElementById('register');
const form = document.querySelector('form');
form.addEventListener('submit', onRegister);
section.remove();

export function showRegister() {
    showView(section);
}

async function onRegister(event) {
    event.preventDefault();
    const formData = new FormData(event.target);

    const email = formData.get('email');
    const password = formData.get('password');
    const rePassword= formData.get('rePass');

    if (password != rePassword) {
        throw new Error('Passwords do not match!');
    }

    try {
        const response = await fetch('http://localhost:3030/users/register', {
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();
        if (response.status == 200) {
            const userData = {
                email: data.email,
                id: data._id,
                token: data.accessToken
            };
            sessionStorage.setItem('userData', JSON.stringify(userData));
            event.target.reset()
            setUserNav();
            showCatalog();
        } else {
            throw new Error(data.message);
        }
    } catch(err) {
        console.log(err.message);
    }
}
// const form = document.querySelector('form');

// form.addEventListener('submit', (ev => {
//     ev.preventDefault();
//     const formData = new FormData(ev.target);
//     onSubmit([...formData.entries()].reduce((p, [k, v]) => Object.assign(p, { [k]: v }), {}));
// }));

// async function onSubmit(data) {
//     if (data.password != data.rePass) {
//         return console.error('Passwords don\'t match');
//     }

//     const body = JSON.stringify({
//         email: data.email,
//         password: data.password,
//     });

//     try {
//         const response = await fetch('http://localhost:3030/users/register', {
//             method: 'post',
//             headers: {
//                 'Content-Type': 'application/json'
//             },
//             body
//         });
//         const data = await response.json();
//         if (response.status == 200) {
//             sessionStorage.setItem('authToken', data.accessToken);
//             window.location.pathname = 'index.html';
//         } else {
//             throw new Error(data.message);
//         }
//     } catch (err) {
//         console.error(err.message);
//     }
// }