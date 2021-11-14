import { showView } from "./dom.js";

const section = document.getElementById('form-sign-up');
const form = section.querySelector('#registerForm');
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
    const repeatPassword = formData.get('repeatPassword');

    
}