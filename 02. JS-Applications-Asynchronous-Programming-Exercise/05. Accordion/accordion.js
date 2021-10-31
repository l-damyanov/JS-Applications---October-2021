window.addEventListener('DOMContentLoaded', solution);

async function solution() {
    const mainSection = document.getElementById('main');

    const url = `http://localhost:3030/jsonstore/advanced/articles/list`;

    const res = await fetch(url);
    const data = await res.json();

    for (let article of data) {
        let articleId = article._id;

        const articleUrl = `http://localhost:3030/jsonstore/advanced/articles/details/${articleId}`;

        const articleRes = await fetch(articleUrl);
        const articleData = await articleRes.json();

        let articleEl = document.createElement('div');
        articleEl.className = 'accordion';
        articleEl.innerHTML = `
        <div class="head">
            <span>${article.title}</span>
            <button class="button" id="${articleId}">More</button>
        </div>
        <div class="extra">
            <p>${articleData.content}</p>
        </div>`
        
        mainSection.appendChild(articleEl);

        let infoBtn = articleEl.getElementsByClassName('button')[0];
        infoBtn.addEventListener('click', (ev) => {
            let contentEl = articleEl.getElementsByClassName('extra')[0];
            if (ev.target.textContent == 'More') {
                contentEl.style.display = 'block';
                ev.target.textContent = 'Less';
            } else if (ev.target.textContent == 'Less') {
                contentEl.style.display = 'none';
                ev.target.textContent = 'More';
            }
        });
    }
}