var checkCaps = function(field, x, y){
	var warned = false; 
	field.addEventListener("keydown", function(event){
		if(field.value.length > 2){
		var caps = /^[^a-z]*$/ //Checks for upper case letters
		var numbers = /^[0-9\W]*$/ //Checks if string is only numbers or special characters
		if(caps.test(field.value) && !numbers.test(field.value) && !warned){
			var svg= d3.select("body").append("svg")
				.attr("x", x)
				.attr("y", y);
			var text = svg.append("text")
				.text("Warning: Caps lock is on")
				.attr("x", x)
				.attr("y", y)
				.attr("font-size", "11px")
				.attr("font-family", "sans-serif");
			warned = true; 
		}
		//Removes the caps lock warning once input is lower case
		if(warned){
			if(/[a-z]+/.test(field.value)){
				d3.select("text").remove()
				warned = false
			}
		}

	}
})
}
	
