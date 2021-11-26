import { logout } from "./api/data.js";
import { render } from "./lib.js";
import { page } from "./lib.js";
import { catalogPage } from "./views.js/catalog.js";
import { createPage } from "./views.js/create.js";
import { DetailsPage } from "./views.js/details.js";
import { editPage } from "./views.js/edit.js";
import { LoginPage } from "./views.js/login.js";
import { registerPage } from "./views.js/register.js";

const root = document.querySelector('div.container');
document.getElementById('logoutBtn').addEventListener('click', onLogout);

page(decorateContext);
page('/', catalogPage);
page('/details/:id', DetailsPage);
page('/create', createPage);
page('/edit/:id', editPage);
page('/login', LoginPage);
page('/register', registerPage);
page('/my-furniture', catalogPage);

updateUserNav();
page.start();

function decorateContext(ctx, next) {
    ctx.render = (content) => render(content, root);
    ctx.updateUserNav = updateUserNav;

    next();
}

function updateUserNav() {
    const userData = JSON.parse(sessionStorage.getItem('userData'));
    if (userData) {
        document.getElementById('user').style.display = 'inline-block';
        document.getElementById('guest').style.display = 'none';
    } else {
        document.getElementById('user').style.display = 'none';
        document.getElementById('guest').style.display = 'inline-block';
    }
}

async function onLogout() {
    await logout();
    updateUserNav();
    page.redirect('/');
}