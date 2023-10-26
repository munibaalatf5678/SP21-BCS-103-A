$(document).ready(function () {
    $("#login-form").validate({
        rules: {
            name: {
                required: true,
                minlength: 3,
            },
            username: {
                required: true,
                minlength: 3,
            },
            email: {
                required: true,
                email: true,
            },
            password: {
                required: true,
                minlength: 5,
            },
            agree: {
                required: true,
            },
        },
        messages: {
            name: {
                required: "Please enter your name",
                minlength: "Your name must be at least 3 characters long",
            },
            username: {
                required: "Please enter your username",
                minlength: "Your username must be at least 3 characters long",
            },
            email: {
                required: "Please enter your email",
                email: "Please enter a valid email address",
            },
            password: {
                required: "Please enter your password",
                minlength: "Your password must be at least 5 characters long",
            },
            agree: {
                required: "You must agree to the terms and conditions",
            },
        },
        submitHandler: function (form) {
            // Clear any previous error messages
            $(".error").html("");

            // Extract the form data
            var formData = $(form).serialize();
            console.log("Form data:", formData);

            // Simulate a login check (replace this with your actual login logic)
            // For demonstration purposes, always show an alert for now
            alert("Form submitted successfully!");
        },
        showErrors: function (errorMap, errorList) {
            // Display all errors next to their respective input fields
            this.defaultShowErrors();

            for (var error of errorList) {
                var element = $(error.element);
                var errorMessage = error.message;
                var errorId = "error-message-" + element.attr("id");
                $("#" + errorId).html(errorMessage);
            }
        },
    });

    $("#login-btn").click(function () {
        // Trigger form validation when the login button is clicked
        $("#login-form").valid();
    });
});
