import { logout } from "./api/data.js";
import { page, render } from "./lib.js";
import { getUserData } from "./utils.js";
import { listingsPage } from "./views/allCars.js";
import { createPage } from "./views/create.js";
import { detailsPage } from "./views/details.js";
import { editPage } from "./views/edit.js";
import { homePage } from "./views/home.js";
import { loginPage } from "./views/login.js";
import { myListingsPage } from "./views/myCars.js";
import { registerPage } from "./views/register.js";
import { searchPage } from "./views/search.js";

document.getElementById('logoutBtn').addEventListener('click', onLogout);
const root = document.getElementById('site-content');

page(decorateContext);
page('/', homePage);
page('/listings', listingsPage);
page('/login', loginPage);
page('/register', registerPage);
page('/create', createPage);
page('/details/:id', detailsPage);
page('/edit/:id', editPage);
page('/my-listings', myListingsPage);
page('/search', searchPage);

updateUserNav();
page.start();

function decorateContext(ctx, next) {
    ctx.render = (content) => render(content, root);

    next();
}

export function updateUserNav() {
    const userData = getUserData();
    if (userData) {
        document.getElementById('profile').style.display = 'block';
        document.getElementById('guest').style.display = 'none';
        document.querySelector('#profile a').textContent = `Welcome, ${userData.username}`;
    } else {
        document.getElementById('profile').style.display = 'none';
        document.getElementById('guest').style.display = 'block';
    }
}

async function onLogout() {
    await logout();
    updateUserNav();
    page.redirect('/')
}