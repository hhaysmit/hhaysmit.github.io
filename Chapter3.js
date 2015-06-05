function countBs(b){
	charCount("B", b);
}

function charCount(n, b){
		var numChar = 0
	for (var count = 0; count < b.length; count++){
		if(b.charAt(count) == n){
			numChar++;
		}
	}
	return numChar

}

function isEven(n){
	if(n == 0){
		return true;
	}
	else if(n == 1){
		return false;
	}
	else{
		return isEven(n-2)
	}
}


function findMin(x, y){
	if(x < y)
		return x;
	return y;
}


