$(document).ready(function() {
    let currentUserId = null;

    function showView(viewId) {
        $('#view-homepage, #view-display-users, #view-register-edit').hide();
        $(viewId).show();
    }

    // Navigation
    $('#register-btn').click(function() {
        openForm(null);
    });

    $('#display-btn, #cancel-btn').click(function() {
        showView('#view-display-users');
        loadUsers();
    });

    $('#register-home-btn, #users-home-btn').click(function() {
        showView('#view-homepage');
        $('.msg-success, .msg-error').text('');
    });

    // Form Management
    function openForm(userId = null) {
        currentUserId = userId;
        const isEdit = currentUserId !== null;
        $('.msg-success, .msg-error').text('');
        $('#register-edit-form')[0].reset();

        if (isEdit) {
            $('#register-edit-h1').text("Edit user");
            $('#cancel-btn').show();

            $.ajax({
                url: `/api/users/${userId}`,
                type: 'GET',
                success: function(user) {
                    $('#name-input').val(user.name);
                    $('#surname-input').val(user.surname);
                    $('#gender-select').val(user.gender);
                    $('#birthdate-input').val(user.birthdate);
                    $('#home-address-input').val(user.homeAddress);
                    $('#work-address-input').val(user.workAddress);
                },
                error: function(xhr) {
                    console.error("Error fetching user details:", xhr.status);
                }
            });
        } else {
            $('#register-edit-h1').text("Register user");
            $('#cancel-btn').hide(); 
        }

        showView('#view-register-edit');
    }

    //Register and Edit User
    $('#birthdate-input').datepicker({
        dateFormat: 'yy-mm-dd',
        maxDate: '-1d',
        changeMonth: true,
        changeYear: true,
        yearRange: 'c-130:c+0'
    });

    $('#register-edit-form').on('submit', function(e) {
        e.preventDefault();

        const userData = {
            name: $('#name-input').val().trim(),
            surname: $('#surname-input').val().trim(),
            gender: $('#gender-select').val(),
            birthdate: $('#birthdate-input').val(),
            homeAddress: $('#home-address-input').val().trim(),
            workAddress: $('#work-address-input').val().trim()
        };

        const isEdit = currentUserId !== null;
        const method = isEdit ? 'PUT' : 'POST';
        const url = isEdit ? `/api/users/${currentUserId}` : '/api/users';

        $.ajax({
            url: url,
            type: method,
            contentType: 'application/json',
            data: JSON.stringify(userData),
            success: function(response) {
                $('#register-edit-error-msg').text('');
                $('#register-edit-form')[0].reset();

                if (isEdit) {
                    showView('#view-display-users');
                    loadUsers();
                    $('#users-error-msg').text('');
                    $('#users-success-msg').text('User edited successfully!');
                } else {
                    $('#register-edit-success-msg').text('User registered successfully!');
                }
            },
            error: function(xhr) {
                const res = xhr.responseJSON;
                let msg = "Something went wrong!";
                if (res && res.validationErrors) {
                    msg = Object.values(res.validationErrors).join("<br>");
                } else if (res && res.message) {
                    msg = res.message;
                }
                $('#register-edit-success-msg').text('');
                $('#register-edit-error-msg').html(msg);
            }
        });
    });

    // Display Users
    const $tbody = $('#users-tbody');

    function loadUsers() {
        $.ajax({
            url: '/api/users',
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
                                <button class="edit-btn" data-id="${user.id}">Edit</button>
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
    }

    $('#users-tbody').on('click', '.edit-btn', function() {
        const id = $(this).data('id');
        openForm(id);
    });

    $('#users-tbody').on('click', '.delete-btn', function() {
        const isConfirmed = confirm("Are you sure you want to delete this user?");
        if (!isConfirmed) {
            return;
        }

        const userId = $(this).data('id');
        $.ajax({
            url: `/api/users/${userId}`,
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
