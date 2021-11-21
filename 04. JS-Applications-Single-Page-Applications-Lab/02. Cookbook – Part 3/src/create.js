import { showCatalog } from "./catalog.js";
import { showView } from "./dom.js";

const section = document.getElementById('create');
section.remove();

export function showCreate() {
    showView(section);

    const form = document.querySelector('form');
    form.addEventListener('submit', onSubmit);

    async function onSubmit(event) {
        const formData = new FormData(event.target);

        const name = formData.get('name');
        const img = formData.get('img');
        const ingredients = formData.get('ingredients').split('\n').map(l => l.trim()).filter(l => l != '');
        const steps = formData.get('steps').split('\n').map(l => l.trim()).filter(l => l != '');

        const userData = JSON.parse(sessionStorage.getItem('userData'));
        if (!userData) {
            return alert('You\'re not logged in!');
        }

        try {
            const response = await fetch('http://localhost:3030/data/recipes', {
                method: 'post',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Authorization': userData.token
                },
                body: JSON.stringify({ name, img, ingredients, steps })
            });

            if (response.status == 200) {
                showCatalog();
            } else {
                const error = await response.json();
                throw new Error(error.message);
            }
        } catch (err) {
            alert(err.message);
            console.error(err.message);
        }

    }
}

// const form = document.querySelector('form');

// form.addEventListener('submit', (ev => {
//     ev.preventDefault();
//     const formData = new FormData(ev.target);
//     onSubmit([...formData.entries()].reduce((p, [k, v]) => Object.assign(p, { [k]: v }), {}));
// }));

// async function onSubmit(data) {
//     const body = JSON.stringify({
//         name: data.name,
//         img: data.img,
//         ingredients: data.ingredients.split('\n').map(l => l.trim()).filter(l => l != ''),
//         steps: data.steps.split('\n').map(l => l.trim()).filter(l => l != '')
//     });

//     const token = sessionStorage.getItem('authToken');
//     if (token == null) {
//         return window.location.pathname = 'index.html';
//     }

//     try {
//         const response = await fetch('http://localhost:3030/data/recipes', {
//             method: 'post',
//             headers: {
//                 'Content-Type': 'application/json',
//                 'X-Authorization': token
//             },
//             body
//         });
        
//         if (response.status == 200) {
//             window.location.pathname = 'index.html';
//         } else {
//             throw new Error(await response.json());
//         }
//     } catch (err) {
//         console.error(err.message);
//     }
// }