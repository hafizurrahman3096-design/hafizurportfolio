const fetch = require('node-fetch');

async function setup() {
    const res = await fetch('http://localhost:5000/api/auth/setup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            username: 'admin',
            password: 'adminpassword'
        })
    });
    const text = await res.text();
    console.log(text);
}

setup();
