
//- logout
document.getElementById("logoutLink").addEventListener("click", function(event) {
    // Make a GET request to the logout route
    fetch('/logout', { method: 'GET' }).then(response => {
        if (response.ok) {
            window.location.href = '/login'; // Redirect to the login page
        } else {
            console.error('Logout failed');
        }
    }).catch(error => console.error('Error:', error));
});