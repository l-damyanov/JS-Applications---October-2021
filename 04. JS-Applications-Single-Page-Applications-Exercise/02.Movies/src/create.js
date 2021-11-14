import { showView } from "./dom.js";
import { showHome } from "./home.js";



const section = document.getElementById('add-movie');
const form = document.querySelector('#createForm');
form.addEventListener('submit', onCreate);
section.remove();

export function showCreate() {
    showView(section);
}

async function onCreate(event) {
    event.preventDefault();
    const userData = JSON.parse(sessionStorage.getItem('userData'));
    console.log(userData);
    const formData = new FormData(event.target);

    const title = formData.get('title');
    const description = formData.get('description');
    const img = formData.get('imageUrl');

    if (title == '' || description == '' || img == '') {
        alert('All fields must be filled!');
        throw new Error('All fields must be filled!');
    }

    try {
        const res = await fetch('http://localhost:3030/data/movies', {
            method: 'post',
            headers: {
                'Content-Type': 'application-json',
                'X-Authorization': userData.token
            },
            body: JSON.stringify({ title, description, img })
        });

        if (res.ok != true) {
            const error = await res.json();
            throw new Error(error.message);
        }

        form.reset();
        showHome();
        

    } catch(err) {
        alert(err.message);
        form.reset();
    }
}