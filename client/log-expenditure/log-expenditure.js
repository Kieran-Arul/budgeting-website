$("#costId").on("keyup", () => {

    const inputCost = parseFloat($("#costId").val())

    if (!isNaN(inputCost)) {

       	$("#submitBtnId").prop("disabled", false);
        $("#costValidId").html("");

    } else {

        $("#costValidId").html("Invalid Cost").css("color", "red");
        $("#submitBtnId").prop("disabled", true);

    }

});
