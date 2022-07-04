$("#emailId").on("keyup", () => {

    if ($("#emailId").val().includes("@")) {

       	$("#submitBtnId").prop("disabled", false);
        $("#emailValidId").html("");

    } else {

        $("#emailValidId").html("Invalid Email").css("color", "red");
        $("#submitBtnId").prop("disabled", true);

    }

});