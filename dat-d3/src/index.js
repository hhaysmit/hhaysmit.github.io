var d3 = require('d3')
var histo = require('./stackedHistogram.js')
var grouped = require('./groupedHistogram.js')

function zomgD3(element, data, type){
		var chart = d3.select(element)
		console.log("chart")
		if(data) chart.datum(data)
		if(type) chart.call(type)

		chart.update = function update(newChart){
			if(newChart) type = newChart;
			this.call(type)
			return this; 
		};
		return chart
	}
zomgD3.groupedHistogram = grouped
zomgD3.stackedHistogram= histo

window._zomgD3 = zomgD3;
module.exports = zomgD3;
