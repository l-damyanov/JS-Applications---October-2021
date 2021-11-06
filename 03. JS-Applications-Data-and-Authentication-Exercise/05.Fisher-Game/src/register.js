window.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('form');
    form.addEventListener('submit', onRegister);
});

async function onRegister(event){
    event.preventDefault();
    
    let formData = new FormData(event.target);

    const email = formData.get('email');
    const password = formData.get('password');
    const rpassword = formData.get('rePass');

    if (password == rpassword) {
        try {
            const res = await fetch('http://localhost:3030/users/register', {
                method: 'post',
                headers: {
                'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });
            if (res.ok != true) {
                const error = await res.json();
                throw new Error(error.message);
            }

            const data = await res.json();
            const userData = {
                email: data.email,
                id: data._id,
                password: data.password,
                token: data.accessToken
            }

            sessionStorage.setItem('userData', JSON.stringify(userData));
            window.location = '/05.Fisher-Game/index.html';
            
        } catch(err) {
            alert(err.message);
        }
    } else {
        alert('Passwords do not match!');
    }
}
