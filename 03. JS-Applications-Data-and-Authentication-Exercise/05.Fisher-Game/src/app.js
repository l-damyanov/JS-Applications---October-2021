let userData = null;

window.addEventListener('DOMContentLoaded', () => {
    loadData();
    userData = JSON.parse(sessionStorage.getItem('userData'));
    if (userData != null) {
        document.getElementById('guest').style.display = 'none';
        document.querySelector('#addForm .add').disabled = false;
        const logoutBtn = document.getElementById('logout');
        logoutBtn.addEventListener('click', onLogout);
        const userName = document.querySelector('span');
        userName.textContent = userData.email;
    } else {
        document.getElementById('user').style.display = 'none';
    }

    document.querySelector('.load').addEventListener('click', loadData);
    
});

const catchesTable = document.getElementById('catches');
catchesTable.addEventListener('click', onTableClick);

function onTableClick(event) {
    if (event.target.className == "update") {
        onEdit(event.target);
    } else if (event.target.className == "delete") {
        onDelete(event.target);
    }
}

async function onDelete(button) {
    const id = button.dataset.id;
    
    let result = await deleteCatch(id);

    loadData();
}

async function deleteCatch(id) {
    const result = await fetch('http://localhost:3030/data/catches/' + id, {
        method: 'delete',
        headers: {
            'X-Authorization': userData.token
        }
    });

    return result;
}

async function onEdit(button) {
    const id = button.dataset.id;
    const catchData = button.parentElement;
    const angler = catchData.querySelector('.angler').value;
    const weight = catchData.querySelector('.weight').value;
    const species = catchData.querySelector('.species').value;
    const location = catchData.querySelector('.location').value;
    const bait = catchData.querySelector('.bait').value;
    const captureTime = catchData.querySelector('.captureTime').value;

    let result = await updateCatch(id, { angler, weight, species, location, bait, captureTime });

    loadData();
}

async function updateCatch(id, catchData) {
    const result = await fetch('http://localhost:3030/data/catches/' + id, {
        method: 'put',
        headers: {
            'Content-Type': 'application/json',
            'X-Authorization': userData.token
        },
        body: JSON.stringify(catchData)
    });

    return result;
}

async function loadData() {
    const res = await fetch('http://localhost:3030/data/catches');
    const data = await res.json();

    catchesTable.replaceChildren(...data.map(createPreview))

    document.getElementById('addForm').addEventListener('submit', onCreateSubmit);
}

async function onCreateSubmit(event) {
    event.preventDefault();

    if (!userData) {
        window.location = '/05.Fisher-Game/index.html'
        return;
    }

    const formData = new FormData(event.target);

    const data = [...formData.entries()].reduce((a, [k, v]) => Object.assign(a, {[k]: v }), {});

    try {
        if (Object.values(data).some(x => x == '')) {
            throw new Error('All fields are required!');
        }

        const res = await fetch('http://localhost:3030/data/catches', {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
                'X-Authorization': userData.token
            },
            body: JSON.stringify(data)
        });

        if (res.ok != true) {
            const error = await res.json();
            throw new Error(error.message);
        }

        loadData();
        event.target.reset();

    } catch(err) {
        alert(err.message);
    }
}

function createPreview(item) {
    const isOwner = (userData && item._ownerId == userData.id);

    const element = document.createElement('div');
    element.className = 'catch';
    element.innerHTML = `
    <label>Angler</label>
    <input type="text" class="angler" value="${item.angler}" ${!isOwner ? 'disabled' : ''}>
    <label>Weight</label>
    <input type="text" class="weight" value="${item.weight}" ${!isOwner ? 'disabled' : ''}>
    <label>Species</label>
    <input type="text" class="species" value="${item.species}" ${!isOwner ? 'disabled' : ''}>
    <label>Location</label>
    <input type="text" class="location" value="${item.location}" ${!isOwner ? 'disabled' : ''}v>
    <label>Bait</label>
    <input type="text" class="bait" value="${item.bait}" ${!isOwner ? 'disabled' : ''}>
    <label>Capture Time</label>
    <input type="number" class="captureTime" value="${item.captureTime}" ${!isOwner ? 'disabled' : ''}>
    <button class="update" data-id="${item._id}" ${!isOwner ? 'disabled' : ''}>Update</button>
    <button class="delete" data-id="${item._id}" ${!isOwner ? 'disabled' : ''}>Delete</button>
    `;

    return element;
}

async function onLogout(event) {
    sessionStorage.clear();
    window.location.reload();
}