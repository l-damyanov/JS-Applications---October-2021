import { showView, e } from "./dom.js";
import { showEdit } from "./edit.js";

const section = document.getElementById('details');
section.remove();

export function showDetails() {

    showView(section);
}

function createRecipeCard(recipe) {
    const result = e('article', {},
        e('h2', {}, recipe.name),
        e('div', { className: 'band' },
            e('div', { className: 'thumb' }, e('img', { src: recipe.img })),
            e('div', { className: 'ingredients' },
                e('h3', {}, 'Ingredients:'),
                e('ul', {}, recipe.ingredients.map(i => e('li', {}, i))),
            )
        ),
        e('div', { className: 'description' },
            e('h3', {}, 'Preparation:'),
            recipe.steps.map(s => e('p', {}, s))
        ),
    );

    const userData = JSON.parse(sessionStorage.getItem('userData'));
    let userId = null;
    if (userData) {
        userId = userData.id;
    }
    if (userId != null && recipe._ownerId == userId) {
        result.appendChild(e('div', { className: 'controls' },
            e('button', { onClick: () => showEdit(recipe._id) }, '\u270E Edit'),
            e('button', { onClick: onDelete }, '\u2716 Delete'),
        ));
    }

    return result;

    function onDelete() {
        const confirmed = confirm(`Are you sure you want to delete ${recipe.name}?`);
        if (confirmed) {
            deleteRecipeById(recipe._id);
        }
    }
}

export async function getRecipeById(id) {
    const response = await fetch('http://localhost:3030/data/recipes/' + id);
    const recipe = await response.json();

    return recipe;
}

export async function showRecipeDetails(id) {
    showDetails();
    const recipe = await getRecipeById(id);
    section.innerHTML = '';
    section.appendChild(createRecipeCard(recipe));
}

async function deleteRecipeById(id) {
    const token = JSON.parse(sessionStorage.getItem('userData')).token;

    try {
        const response = await fetch('http://localhost:3030/data/recipes/' + id, {
            method: 'delete',
            headers: {
                'X-Authorization': token
            }
        });

        if (response.status != 200) {
            const error = await response.json();
            throw new Error(error.message);
        }

        section.innerHTML = '';
        section.appendChild(e('article', {}, e('h2', {}, 'Recipe deleted')));
    } catch (err) {
        alert(err.message);
    }
}