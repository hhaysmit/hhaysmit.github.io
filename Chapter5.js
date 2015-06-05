var array = [[1,2], [3,4], [5, 6]]
var flatArray =[]
console.log(array.reduce(function(flatArray, x) {
	return flatArray.concat(x);
}))


function every(array, testF){
	var answer = true
	var i = 0
	while(answer && i < array.length){
		answer = testF(array[i]);
		i++
	}
	return answer;
}

console.log(every([1, 3, 4, 5], function(x){
	return x < 4;
}))

function some(array, f){
	var answer = false
	var i = 0 
	while (!answer && i < array.length){
		answer = f(array[i])
		i++
	}
	return answer
}

console.log(some([1, 2, 3, 4], function(x){
	return x > 4;
}))