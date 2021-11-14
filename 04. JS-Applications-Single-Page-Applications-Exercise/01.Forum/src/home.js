import { showView } from "./dom.js";

const section = document.querySelector('.homePage');
section.remove();

export function showHome() {
    showView(section);
}