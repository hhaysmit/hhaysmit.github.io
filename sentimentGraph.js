			var margin = {top: 30.5, right: 150.5, bottom: 19.5, left: 69.5};
			var width = 960 - margin.right;
			var height = 500 - margin.top - margin.bottom;

			var svg = d3.select("#averageSentiment").append("svg")
    				.attr("width", width + margin.left + margin.right)
    				.attr("height", height + margin.top + margin.bottom)
    				.append("g")
    				.attr("transform", "translate(" + margin.left + "," + margin.top + ")");


    		var dateFormat = d3.timeParse("%Y-%m-%d");
    		d3.json("averageSentiments.json", function(data) {

    			
    			var xScale = d3.scaleTime().domain([dateFormat("2017-4-1"), dateFormat("2017-4-30")]).range([0, width])
				  var yScale = d3.scaleLinear().domain([0, 1]).range([height, 0]); 


          //Set up x and y axis
				  var xAxis = d3.axisBottom(xScale),
    				yAxis = d3.axisLeft(yScale);

				  svg.append("g").call(yAxis);
  				svg.append("g").attr("transform", "translate(0, " + height + ")").call(xAxis);

          svg.append("text").attr("x", -height/2).attr("y", -55).text("Sentiment Scale").attr("transform", 
            "rotate(270)").attr("text-anchor", "midde")

          svg.append("text").attr("x", width/2-150).attr("y", 10).text("Sentiment Trends Through April").style("font-size", "20px")
          //Draw lines 
  				var pos_line = d3.line()
  						.x(function(d){
  							return xScale(dateFormat("2017-4-"+d.day));
  						})
  						.y(function(d){
  							return yScale(d.average);
  						})


  				svg.append("path").attr("class", "positive")
  					.attr("d", pos_line(data))
  					.attr("fill", "none")
  					.attr("stroke", "blue");

    		 })
        