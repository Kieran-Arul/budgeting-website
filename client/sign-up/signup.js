$("#emailId").on("keyup", () => {

    if ($("#emailId").val().includes("@")) {

       	$("#submitBtnId").prop("disabled", false);
        $("#emailValidId").html("");

    } else {

        $("#emailValidId").html("Invalid Email").css("color", "red");
        $("#submitBtnId").prop("disabled", true);

    }

});

$("#passwordId, #confirmPasswordId").on("keyup", () => {

    if ($("#passwordId").val() == $("#confirmPasswordId").val()) {
        
       	$("#submitBtnId").prop("disabled", false);
        $("#passwordMatchId").html("")

    } else {

        $("#passwordMatchId").html("Passwords Do Not Match").css("color", "red");
        $("#submitBtnId").prop("disabled", true);

    }

});