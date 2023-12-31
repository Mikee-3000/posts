function sendCreds(endpoint) {
    var uname = document.getElementById('uname').value;
    var psw = document.getElementById('psw').value;
    var csrfToken = document.getElementById('csrfToken').value;
    var message_div = document.querySelector('.message');
    if (uname.length < 4) {
        message_div.textContent = 'Username must be at least 4 characters long.';
    } else if (psw.length < 8) {
        message_div.textContent = 'Password must be at least 8 characters long.';
    } else {
        fetch('/'+endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({uname: uname, psw: psw, csrfToken: csrfToken})
        })
        .then(function(response) {
            if (response.status === 409) {
                const data = response.json().then(data => {
                    message_div.textContent = "Registration Error. Please choose different details.";

                });
            } else if (response.status === 200) {
                const data = response.json().then(data=> {
                    msg = data.message;
                    if (endpoint === 'login') {
                        window.location.href = '/posts';
                    } else {
                        window.location.href = `/login?register=true`;
                    }
                })
            } else {
                message_div.textContent = 'An error occurred while registering. Please try again, if error persists contact the administrator.';
            }
        })
        .catch(function(error) {
            message_div.textContent = "An error occurred while registering. Please try again, if error persists contact the administrator.";
        });
    }
}