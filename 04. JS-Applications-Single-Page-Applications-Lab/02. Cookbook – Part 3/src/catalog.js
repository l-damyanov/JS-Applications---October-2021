import { showRecipeDetails } from "./details.js";
import { showView, e } from "./dom.js";

const section = document.getElementById('catalog');
section.remove();

export function showCatalog() {
    showView(section);
    getRecipes();
}

async function getRecipes() {
    const res = await fetch('http://localhost:3030/data/recipes');
    const data = await res.json();

    section.replaceChildren(...data.map(createRecipePreview));

    return data;
}

function createRecipePreview(recipe) {
    const result = e('article', { className: 'preview', onClick: () => showRecipeDetails(recipe._id) },
        e('div', { className: 'title' }, e('h2', {}, recipe.name)),
        e('div', { className: 'small' }, e('img', { src: recipe.img })),
    );

    return result;
}
