import { setUserNav } from "./app.js";
import { showCatalog } from "./catalog.js";
import { showView } from "./dom.js";

const section = document.getElementById('login');
const form = document.querySelector('form');
form.addEventListener('submit', onLogin);
section.remove();

export function showLogin() {
    showView(section);
}

async function onLogin(event) {
    event.preventDefault();
    const formData = new FormData(event.target);

    const email = formData.get('email');
    const password = formData.get('password');

    try {
        const response = await fetch('http://localhost:3030/users/login', {
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
    } catch (err) {
        console.error(err.message);
    }
}