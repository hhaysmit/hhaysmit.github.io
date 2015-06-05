function range(x, y, step){
	var array = []
	if(arguments.length < 3){
		var step = 1;
	}
	if(step < 0){
		for(var i = x; i >= y; i +=step){
			array.push(i)
		}
	}else{
		for(var count = x; count < y + 1; count+=step){
		array.push(count);
		}
	}
	console.log(array)
	return array
}

function sum(A){
	var sum = 0 
	for(var i = 0; i< A.length; i++){
		sum += A[i]
	}
	return sum
}

//console.log(sum(range(5, 2, -1)));

function simpleSum(A){
	var a = 0
	return A.reduce(function(a, x){ 
		return a + x})
}

console.log(simpleSum([1,2,3]));

function reverseArray(A){
	var i = 0
	var j = A.length-1

	while (i < j){
		var temp =  A[i]
		A[i] = A[j]
		A[j] = temp
		i++
		j--
	}
	return A
}
//console.log(reverseArray([1, 2, 3, 4, 5]))






