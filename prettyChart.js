var w, h, xScale, yScale, svg, dataset;

exports.makeChart = function(dataset, location, width, height){
		w = width;
		h = height;
		dataset = dataset
		var padding = 20;
		var barPadding = 1; 
		var maxValue = 50;
		var color = d3.scale.category20();
		xScale = d3.scale.ordinal()
							.domain(d3.range(dataset.length))
							.rangeRoundBands([0, w], .05);
		yScale = d3.scale.linear()
							.domain([0, d3.max(dataset)+5])
							.range([0, h]);

		svg = d3.select(location)
				    .append("svg")
				    .attr("align", "center")
				    .attr("width", w)
				    .attr("height", h);
		svg.selectAll("rect")
			.data(dataset)
			.enter()
			.append("rect")
			.attr("id", "opacRec")
			.attr("x", function(d, i){
				return xScale(i);
			} )
			.attr("y", function(d){
				return h - yScale(d); 
			})
			.attr("width", xScale.rangeBand())
			.attr("height", function(d){
				return yScale(d);
			})
			.attr("fill", function(d, i){
				return color(i)
			})
			.attr("opacity", .18);
		svg.selectAll("bars")
			.data(dataset)
			.enter()
			.append("rect")
			.attr("id", "bars")
			.attr("x", function(d, i){
				return xScale(i);
			})
			.attr("y", function(d){
				return h - yScale(d) - 2; })
			.attr("width", xScale.rangeBand())
			.attr("height", 4)
			.attr("fill", function(d, i){
				return color(i)
			})
		
		svg.selectAll("text")
			.data(dataset)
			.enter()
			.append("text")
			.text(function(d){
				return d;
			})
			.attr("x", function(d, i){
				return xScale(i) + xScale.rangeBand()/2;
			} )
			.attr("y", function(d){
				return h - yScale(d) - 5; 
			})
			.attr("font-family", "Quicksand, sans-serif")
			.attr("font-size", "13px")
			.attr("fill", "#222")
			.attr("text-anchor", "middle")
	}
exports.newData = function(button){
		var button = d3.select(button)
					.on("click", function(){
						var numValues = dataset.length;              
						dataset = [];                                       
						for (var i = 0; i < numValues; i++) {               
    						var newNumber = Math.floor(Math.random() * maxValue); 
    						dataset.push(newNumber);                        
						}
						yScale.domain([0, d3.max(dataset)+5]);
            			svg.selectAll("#opacRec")
            				.data(dataset)
            				.transition()
            				.duration(1000)
            				.attr("y", function(d){
								return h - yScale(d); 
							})
            				.attr("height", function(d){
								return yScale(d);});
            			svg.selectAll("text")
            				.data(dataset)
            				.transition()
            				.duration(1000)
            				.text(function(d){
            					return d;
            				})
            				.attr("x", function(d, i){
								return xScale(i) + xScale.rangeBand()/2;
							})
							.attr("y", function(d){
								return h - yScale(d) - 5; 
							});
						svg.selectAll("#bars")
								.data(dataset)
								.transition()
								.duration(1000)
								.attr("y", function(d){
									return h - yScale(d) - 2; })
					});
		}
exports.sortBars = function(button){
		var sortOrder = false; 
		d3.select(button).on("click", function(){
		var sortBars = function(){
			sortOrder = !sortOrder
			svg.selectAll("#opacRec")
				.sort(function(a, b){
					if(sortOrder){
						return d3.ascending(a, b);}
					else{
						return d3.descending(a, b);}})
				.transition()
				.delay(function(d, i) {
        		return i * 50;
				})
				.duration(1000)
				.attr("x", function(d, i){ return xScale(i);})
			svg.selectAll("#bars")
					.sort(function(a, b){
						if(sortOrder){
							return d3.ascending(a, b);
						}else{
							return d3.descending(a,b);
						}})
					.transition()	
					.delay(function(d, i){
						return i * 50;
					})
					.duration(1000)
					.attr("width", xScale.rangeBand())
					.attr("x", function(d, i){
						return xScale(i);
			});
			svg.selectAll("text")
				.sort(function(a, b){
					if(sortOrder){
						return d3.ascending(a, b);}
					else{
						return d3.descending(a, b);}})
				.transition()
				.delay(function(d, i) {
       			return i * 50;
				})
				.duration(1000)
				.attr("x", function(d, i){
					return xScale(i) + xScale.rangeBand()/2;})
				.attr("y", function(d){
					return h - yScale(d) -5;});

		};
		});
		
	}
