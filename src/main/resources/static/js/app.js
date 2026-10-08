const API_BASE_URL = '/api';

$(document).ready(function() {

    function showView(viewId) {
        $('#view-homepage, #view-display-users, #view-register').hide();
        $(viewId).show();
    }

    // Navigation
    $('#register-btn').click(function() {
        showView('#view-register');
    });

    $('#display-btn').click(function() {
        showView('#view-display-users');
        loadUsers();
    });

    $('#register-home-btn, #users-home-btn').click(function() {
        showView('#view-homepage');
        $('.msg-success').text('');
        $('.msg-error').text('');
    });

    // Register new user
    $('#birthdate-input').datepicker({
        dateFormat: 'yy-mm-dd',
        maxDate: '-1d',
        changeMonth: true,
        changeYear: true,
        yearRange: 'c-130:c+0'
    });
    
    $('#register-form').on('submit', function(e) {
        e.preventDefault();

        const userData = {
            name: $('#name-input').val().trim(),
            surname: $('#surname-input').val().trim(),
            gender: $('#gender-select').val(),
            birthdate: $('#birthdate-input').val(),
            homeAddress: $('#home-address-input').val().trim(),
            workAddress: $('#work-address-input').val().trim()
        };

        $.ajax({
            url: `${API_BASE_URL}/users`,
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(userData),
            success: function(response) {
                $('#register-error-msg').text('');
                $('#register-success-msg').text('User registered successfully!');
                $('#register-form')[0].reset();
            },
            error: function(xhr) {
                const res = xhr.responseJSON;
                let msg = "Something went wrong!";
                if (res && res.validationErrors) {
                    msg = Object.values(res.validationErrors).join("<br>");
                } else if (res && res.message) {
                    msg = res.message;
                }
                $('#register-success-msg').text('');
                $('#register-error-msg').html(msg);
            }
        });

    });

    // Display Users
    const $tbody =$('#users-tbody');

    async function loadUsers() {
        $.ajax({
            url: `${API_BASE_URL}/users`,
            type: 'GET',
            success: function(users) {
                $tbody.empty();

                users.forEach(user => {
                    const row = `
                        <tr data-id="${user.id}">
                            <td>${user.name}</td>
                            <td>${user.surname}</td>
                            <td class="actions-col">
                                <button class="delete-btn" data-id="${user.id}">Delete</button>
                            </td>
                        </tr>
                    `;
                    $tbody.append(row);
                });
            },
            error: function(xhr) {
                console.error("Fetch error:", xhr.status);
            }
        });
    };

    $('#users-tbody').on('click', '.delete-btn', function() {
        const isConfirmed = confirm("Are you sure you want to delete this user?");

        if (!isConfirmed) {
            return;
        }
        const userId = $(this).data('id');
        let msg = "Something went wrong!";
        $.ajax({
            url: `${API_BASE_URL}/users/${userId}`,
            type: 'DELETE',
            success: function() {
                loadUsers();
                $('#users-error-msg').text('');
                $('#users-success-msg').text('User deleted successfully!');
            },
            error: function(xhr) {
                console.error("Delete error:", xhr.status);
                $('#users-success-msg').text('');
                $('#users-error-msg').text("Error deleting user!");
            }
        });
    });

    // Details
    $('#users-tbody').on('click', 'td:not(.actions-col)', function() {
        const userId = $(this).closest('tr').data('id');
        window.open(`details.html?id=${userId}`, '_blank');
    });

}); 
