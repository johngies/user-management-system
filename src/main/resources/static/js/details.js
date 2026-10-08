$(document).ready(function() {
    loadUserDetails();
});

function loadUserDetails() {
    const params = new URLSearchParams(window.location.search);
    const userId = params.get('id');

    if (!userId) {
        console.error("User ID not found in URL");
        return;
    }

    $.ajax({
        url: `/api/users/${userId}`,
        type: 'GET',
        success: function(user) {
            $('#detail-name').text(user.name);
            $('#detail-surname').text(user.surname);
            $('#detail-gender').text(user.gender);
            $('#detail-birthdate').text(user.birthdate);
            $('#detail-home-address').text(user.homeAddress || '-');
            $('#detail-work-address').text(user.workAddress || '-');
        },
        error: function(xhr) {
            console.error("Fetch error:", xhr.status);
        }
        
    });
}