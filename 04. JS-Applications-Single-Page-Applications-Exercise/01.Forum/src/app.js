import { showHome } from "./home.js";
import { showDetails, showComments } from "./details.js";
import { onCreate } from "./create.js";

showHome();
loadPosts();

const homeBtn = document.querySelector('a');
homeBtn.addEventListener('click', (ev) => {
    showHome();
});

const postBtn = document.querySelector('.public');
postBtn.addEventListener('click', () => {
    const createForm = document.getElementById('createForm');
    createForm.addEventListener('submit', onCreate);
})



window.showHome = showHome;
window.showDetails = showDetails;

const postsSection = document.querySelector('.postSection');
postsSection.addEventListener('click', (event) => {
    let target = event.target;

    if (target.tagName == 'BUTTON') {
        let postId = target.parentElement.parentElement.id;
        showDetails();
        showComments(postId);
    }
});


async function loadPosts() {
    const res = await fetch('http://localhost:3030/jsonstore/collections/myboard/posts');
    const data = await res.json();

    postsSection.replaceChildren(...Object.values(data).map(createPost));
}

function createPost(data) {
    const element = document.createElement('div');
    element.className = 'topic-title';
    element.id = data._id
    element.innerHTML = `
    <h1>${data.title}</h1>
    <div class="topic-container">
        <p>Date: ${Date.now()}</p>
        <p>Username: ${data.username}</p>
        <button>Comments</button>       
    </div>`;

    return element;
}

// import { onCreate } from "./create.js";
// import { showDetails } from "./details.js";
// import { showView } from "./dom.js";
// import { showHome } from "./home.js";

// window.addEventListener('DOMContentLoaded', () => {
//     loadPosts();

//     const form = document.querySelector('form');
//     form.addEventListener('submit', onCreate);

//     showView(document.querySelector('.homePage'));
// });

// const homeBtn = document.querySelector('a');
// homeBtn.addEventListener('click', showHome());

// const postsSection = document.querySelector('.postSection');
