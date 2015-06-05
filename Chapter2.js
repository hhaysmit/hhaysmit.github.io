function triangleLoop(){
	triangle= ""
	for(var i = 0; i< 8; i++){
		triangle += "#"; 
		console.log(triangle);
	}
}





function fizzBuzz(){
	for(var count = 1; count < 101; count++){
		if(count%3 == 0 && count%5 == 0){
			console.log("FizzBuzz");
		}
		else{
			if(count%3 == 0){
				console.log("Fizz");
			}
			if(count%5 == 0){
				console.log("Buzz");
			}
			if(count%3 != 0 && count%5 !=0){
				console.log(count);
			}
		}
	}
}


function chessBoard(size){
	for(var i = 0; i <= size; i++){
		var row = "";
		for(var j = 0; j <= size; j++){
			if((j+i) % 2 == 0) 
				row += "#"
			else
				row+= " "
		}
		console.log(row);
	}

}

