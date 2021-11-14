import { showView } from "./dom.js";
import { showHome } from "./home.js";

const section = document.querySelector('.commentsPage');
section.remove();

export function showDetails() {
    showView(section);

    const commentForm = document.getElementById('commentForm');
    commentForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const formData = new FormData(event.target);

        // const commentSection = document.querySelector('.comment');
        // commentSection.replaceChildren(createComment(formData));
        
        const commentText = formData.get('postText');
        const username = formData.get('username');
        const date = Date.now()
        const postId = document.querySelector('.header').id;

        if (commentText.trim() == '' || username.trim() == '') {
            throw new Error('All fields must be filled!');
        }

        try {
            const commentRes = await fetch('http://localhost:3030/jsonstore/collections/myboard/comments', {
                method: 'post',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ commentText, username, date, postId })
            });

            if (commentRes.ok != true) {
                const error = await commentRes.json();
                throw new Error(error.message);
            }

            const data = await commentRes.json();

            event.target.reset();
            showHome();

        } catch(err) {
            alert(err.message)
        }
    });
}

function createPostComments(comment) {
    const element = document.createElement('div');
    element.className = 'topic-name-wrapper';
    element.innerHTML = `
    <div class="topic-name">
        <p><strong>${comment.username}</strong> commented on <time>${comment.date}</time></p>
        <div class="post-content">
            <p>${comment.commentText}</p>
        </div>
    </div>`;

    return element;
}

export async function showComments(postId) {
    let postData = await getPost(postId);

    // console.log(postData);

    const commentSection = document.querySelector('.comment');
    commentSection.replaceChildren(createComment(postData));

    const postCommentsSection = document.getElementById('user-comment');
    // loadComments(postId);

    let commentsArr = await getComments(postId);
    console.log(commentsArr);
    postCommentsSection.replaceChildren(...Object.values(commentsArr).map(createPostComments));
    // postCommentsSection.replaceChildren(loadComments(document.querySelector('.header').id));

    // const title = document.querySelector('h2');
    // title.textContent = postData.title;
    // const comment = document.querySelector('.comment');
    // comment.textContent = postData.post;
}

async function getPost(id) {
    const res = await fetch('http://localhost:3030/jsonstore/collections/myboard/posts/' + id);
    if (res.ok != true) {
        const error = await res.json();
        throw new Error(error.message);
    }

    const data = await res.json();
    
    return data;
}

function createComment(comment) {
    const element = document.createElement('div');
    element.className = 'header';
    element.id = comment._id;
    element.innerHTML = `
    <img src="./static/profile.png" alt="avatar">
    <p><span>${comment.username}</span> posted on ${comment.date}<time></time></p>

    <p class="post-content">${comment.post}</p>
    <div id="user-comment"></div>`;

    return element;
}

async function getComments(id) {
    const res = await fetch('http://localhost:3030/jsonstore/collections/myboard/comments');
    const data = await res.json();

    // let comments = [];

    // for (let comment of Object.values(data)) {
    //     if (comment.postId == id) {
    //         comments.push(comment);
    //     }
    // }

    return Object.values(data).filter(c => c.postId == id);
}