import { showView } from "./dom.js";
import { getRecipeById, showRecipeDetails } from "./details.js";

const section = document.getElementById('edit');
section.remove();

export async function showEdit(id) {
    showView(section);
    const recipeId = id;
    const recipe = await getRecipeById(recipeId);

    section.querySelector('[name="name"]').value = recipe.name;
    section.querySelector('[name="img"]').value = recipe.img;
    section.querySelector('[name="ingredients"]').value = recipe.ingredients.join('\n');
    section.querySelector('[name="steps"]').value = recipe.steps.join('\n');

    const form = document.querySelector('form');
    form.addEventListener('submit', onSubmit);

    async function onSubmit(event) {
        event.preventDefault();

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
            const response = await fetch('http://localhost:3030/data/recipes/' + recipeId, {
                method: 'put',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Authorization': userData.token
                },
                body: JSON.stringify({ name, img, ingredients, steps })
            });

            if (response.status == 200) {
                showRecipeDetails(recipeId);
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
