$("#yearId").on("keyup", () => {

    if ($.isNumeric($("#yearId").val())) {

       	$("#submitBtnId").prop("disabled", false);
        $("#yearValidId").html("");

    } else {

        $("#yearValidId").html("Invalid Year").css("color", "red");
        $("#submitBtnId").prop("disabled", true);

    }

});


$("#budgetId").on("keyup", () => {

    if ($.isNumeric($("#budgetId").val())) {

        $("#submitBtnId").prop("disabled", false);
        $("#budgetValidId").html("");

    } else {

        $("#budgetValidId").html("Invalid Number").css("color", "red");
        $("#submitBtnId").prop("disabled", true);

    }

});
