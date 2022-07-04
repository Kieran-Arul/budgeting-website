function btnFlashAndAlert(event) {

	// Makes the clicked button, flash
	$(event.target).fadeOut(100).fadeIn(100);

	// Obtains the class list of the clicked button
	let clickedElementClassList = event.target.classList;

	if (clickedElementClassList.contains("download-button")) {
			
			setTimeout(function () {
					alert("Your download will commence shortly."); 
			}, 1000);

	// Error case
	} else {

			console.log(event.target);

	}
	
}

// Stores app download buttons in array
let downloadButtons = document.querySelectorAll(".download-button");

// Adds click event listener to both download buttons with callback function being the btnFlashAndAlert button
for (let i = 0; i < downloadButtons.length; i++) {
	
	downloadButtons[i].addEventListener("click", btnFlashAndAlert);
	
}
