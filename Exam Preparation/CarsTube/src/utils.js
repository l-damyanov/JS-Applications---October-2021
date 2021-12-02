export function getUserData() {
    return JSON.parse(sessionStorage.getItem('userData'));
}