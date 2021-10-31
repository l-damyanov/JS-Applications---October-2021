async function lockedProfile() {
    const profilesSection = document.getElementById('main');

    const url = `http://localhost:3030/jsonstore/advanced/profiles`;

    const res = await fetch(url);
    const data = await res.json();

    for (let profile of Object.values(data)) {
        let profileEl = document.createElement('div');
        profileEl.className = 'profile';
        profileEl.innerHTML = `<img src="./iconProfile2.png" class="userIcon" />
        <label>Lock</label>
        <input type="radio" name="user1Locked" value="lock" checked>
        <label>Unlock</label>
        <input type="radio" name="user1Locked" value="unlock"><br>
        <hr>
        <label>Username</label>
        <input type="text" name="user1Username" value="${profile.username}" disabled readonly />
        <div id="user1HiddenFields">
            <hr>
            <label>Email:</label>
            <input type="email" name="user1Email" value="${profile.email}" disabled readonly />
            <label>Age:</label>
            <input type="email" name="user1Age" value="${profile.age}" disabled readonly />
        </div>
        <button>Show more</button>`

        let showMoreBtn = profileEl.querySelector('button');
        showMoreBtn.addEventListener('click', showMore);
        

        profilesSection.appendChild(profileEl);
        
    }

    function showMore(ev) {
        const profile = ev.target.parentElement;
        const isActive = profile.querySelector('input[type="radio"][value="unlock"]').checked;
        
        if (isActive) {
            const infoDiv = profile.querySelector('div');
            if (ev.target.textContent == 'Show more') {  
                infoDiv.style.display = 'block';
                ev.target.textContent = 'Hide it';
            } else {
                infoDiv.style.display = '';
                ev.target.textContent = 'Show more';
            }
        }
    }
}