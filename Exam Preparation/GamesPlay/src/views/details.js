import { createComment, deleteGame, getGameById, getGameComments } from "../api/data.js";
import { html } from "../lib.js";
import { getUserData } from "../utils.js";

const detailsTemplate = (game, isOwner, onDelete, comments, userData, onCreateComment) => html`
<section id="game-details">
    <h1>Game Details</h1>
    <div class="info-section">
        <div class="game-header">
            <img class="game-img" src=${game.imageUrl}/>
            <h1>${game.title}</h1>
            <span class="levels">MaxLevel: ${game.maxLevel}</span>
            <p class="type">${game.category}</p>
        </div>

        <p class="text">${game.summary}</p>

        <div class="details-comments">
            <h2>Comments:</h2>
            ${comments.length == 0 ? html`<p class="no-comment">No comments.</p>` : html`<ul>${comments.map(commentTemplate)}</ul>`}        
        </div>

        ${isOwner ? html`<div class="buttons">
            <a href="/edit/${game._id}" class="button">Edit</a>
            <a @click=${onDelete} href="javascript:void(0)" class="button">Delete</a>
        </div>` : null}

        ${isOwner == false && userData != null ? html`
        <article class="create-comment">
            <label>Add new comment:</label>
            <form @submit=${onCreateComment} class="form">
                <textarea name="comment" placeholder="Comment......"></textarea>
                <input class="btn submit" type="submit" value="Add Comment">
            </form>
        </article>` : null}
        
    </div>
</section>`;

const commentTemplate = (comment) => html`
<li class="comment">
    <p>Content: ${comment.comment}</p>
</li>`;


export async function detailsPage(ctx) {
    const userData = getUserData();
    const game = await getGameById(ctx.params.id);
    const comments = await getGameComments(ctx.params.id);
    const isOwner = userData && userData.id == game._ownerId;
    ctx.render(detailsTemplate(game, isOwner, onDelete, comments, userData, onCreateComment))

    async function onDelete() {
        const confirmed = confirm('Are you sure you want to delete this game?');
        if (confirmed) {
            await deleteGame(ctx.params.id);
            ctx.page.redirect('/');
        }
    }

    async function onCreateComment(event) {
        event.preventDefault();

        const formData = new FormData(event.target);

        const comment = formData.get('comment');

        if (comment == '') {
            return alert('All fields are required!');
        }

        const body = {
            gameId: ctx.params.id,
            comment: comment
        }
        
        try {
            await createComment(body);
        } catch(err) {
            alert(err.message);
        }
        
        
        event.target.reset();
        ctx.page.redirect('/details/' + ctx.params.id);
    }
}