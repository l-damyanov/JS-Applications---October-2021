export async function onCreate(event) {
    const formData = new FormData(event.target);

    const title = formData.get('topicName');
    const username = formData.get('username');
    const post = formData.get('postText');
    const date = Date.now();

    if (title.trim() == '' || username.trim() == '' || post.trim() == '') {
        throw new Error('All fields must be filled!');
    }

    try {
        const res = await fetch('http://localhost:3030/jsonstore/collections/myboard/posts', {
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ title, username, post, date })
        });
    
        if (res.ok != true) {
            const error = await res.json();
            throw new Error(error.message);
        }
    
        const data = await res.json();
    
        event.target.reset();
    } catch(err) {
        alert(err.message);
    }
}