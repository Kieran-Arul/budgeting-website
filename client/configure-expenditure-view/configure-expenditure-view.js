$("#yearId").on("keyup", () => {

    if ($.isNumeric($("#yearId").val())) {

       	$("#submitBtnId").prop("disabled", false);
        $("#yearValidId").html("");

    } else {

        $("#yearValidId").html("Invalid Year").css("color", "red");
        $("#submitBtnId").prop("disabled", true);

    }

});