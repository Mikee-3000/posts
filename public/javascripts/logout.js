
//- logout
// https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener
document.getElementById("logoutLink").addEventListener("click", function(event) {
    // Make a GET request to the logout route
    // https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API
    fetch('/logout', { method: 'GET' }).then(response => {
        if (response.ok) {
            window.location.href = '/login'; // Redirect to the login page
        } else {
            console.error('Logout failed');
        }
    }).catch(error => console.error('Error:', error));
});