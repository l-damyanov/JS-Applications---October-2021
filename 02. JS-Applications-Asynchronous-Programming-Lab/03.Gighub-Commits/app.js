const list = document.getElementById('commits');
const loadBtn = document.querySelector('button');
loadBtn.addEventListener('click', loadCommits);

function loadCommits() {
    const username = document.getElementById('username').value;
    const repo = document.getElementById('repo').value;

    const url = `https://api.github.com/repos/${username}/${repo}/commits`;
    
    fetch(url)
        .then(res => {
            if (res.ok == false) {
                throw new Error(`${res.status} ${res.statusText}`)
            }
            return res.json();
        })
        .then(handleResponse)
        .catch(handleError)


    function handleResponse(data) {
        list.innerHTML = '';

        for (let commit of data) {
            if (commit.author && commit.commit) {
                const liEl = document.createElement('li');
                console.log(commit.author.login);
                liEl.textContent = `${commit.author.login}: ${commit.commit.message}`;

                list.appendChild(liEl);
            } else {
                continue;
            }
        }
    }

    function handleError(error) {
		list.innerHTML = '';
        const liEl = document.createElement('li');
        liEl.textContent = `Error: ${error.message} (Not Found)`;
		list.appendChild(liEl);
	}
}