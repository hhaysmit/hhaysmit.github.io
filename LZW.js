function LZW(){
	this.bitLength = 5;
	this.dict = this.newDict();
	this.numEntries = 26; 
}


LZW.prototype.encodeString = function(string){
	var currString = string[0]
	var output = ""
	for(var i = 0; i < string.length-1; i++){
		if(this.dict[currString+string[i+1]] === null){
			this._addEntry(currString+string[i+1]);
			output += this.dict[currString]
			currString = string[i+1]
		}
		else{
			currString = currString + string[i+1];
		}
	}
	this._addEntry(currString);
	output += this.dict[currString];
	return output;
}

LZW.prototype.encode = function(data){
	var string = JSON.stringify(data);
	return this.encodeString(string);
}



 LZW.prototype.newDict = function(){
	var dict = {};
	var alphabet = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
	var counter = 1;
	for(var i = 0; i < alphabet.length; i++){
		dict[alphabet[i]] = this.bitConverter(counter);
		counter++;
	}
	return dict;
};

LZW.prototype.bitConverter = function(number){
	var bit = number.toString(2);
	while(bit.length < this.bitLength){
		bit = "0" + bit;
}
	return bit;

}

LZW.prototype._addEntry = function(string){

	var number = this.numEntries + 1
	this.numEntries++; 
	if(this.numEntries > Math.pow(2, this.bitLength)){
		this.bitLength++;
	}
	this.dict[string] = this.bitConverter(number);
};





