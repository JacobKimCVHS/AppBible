// Login button event listener
document.getElementById('login-form').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const username = this[0].value;
    const password = this[1].value;

    const response = await fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
    });

    const data = await response.json();
    alert(data.message);
});

// Signup button event listener
document.getElementById('signup-form').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const username = this[0].value;
    const email = this[1].value;
    const password = this[2].value;

    const response = await fetch('http://localhost:5000/signup', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password }),
    });

    const data = await response.json();
    alert(data.message);
});
