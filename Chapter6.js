
function Vector(x, y){
	this.x = x;
	this.y = y;
}

Vector.prototype.plus = function(v){
	var newX = this.x + v.x;
	var newY = this.y + v.y;
	return new Vector(newX, newY);
};

Vector.prototype.minus= function(v){
	var newX = this.x - v.x;
	var newY = this.y - v.y; 
	return new Vector(newX, newY);
};

Object.defineProperty(Vector.prototype, "length", {
	get: function() {
		return Math.sqr(this.x*this.x + this.y*this.y); }
});


console.log(new Vector(3, 5).length);