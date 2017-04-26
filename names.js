function x(d) {
    return xScale(dateFormat("2017-4-" +d.day));
}
function y(d) {
    return yScale(d.rank);
}

function color(){
  return colorScale(Math.random()*10)
}

var lastDay = 7
var startDay = 1
var filteredData;
//////////////
// Provided //
//////////////

// Chart dimensions
var margin = {top: 30, right: 19.5, bottom: 70, left: 39.5};
var width = 960 - margin.right;
var height = 560 - margin.top - margin.bottom;

var dateFormat = d3.timeParse("%Y-%m-%d")

// Various scales
var xScale = d3.scaleTime().domain([dateFormat("2017-4-1"), dateFormat("2017-4-7")]).range([0, width]),
    yScale = d3.scaleLinear().domain([11, 1]).range([height, 0])




// The x & y axes
var xAxis = d3.axisBottom(xScale).ticks(7),
    yAxis = d3.axisLeft(yScale), 
    colorScale = d3.scaleOrdinal(d3.schemeCategory10);

// Create the SVG container and set the origin
var svg = d3.select("#chart").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var clip = svg.append("defs").append("clipPath")
  .attr("id", "clip")
  .append("rect")
  .attr("x", "0")
  .attr("y", "0")
  .attr("width", width)
  .attr("height", height)

var graph = svg.append("g")
.attr("clip-path", "url(#clip)")

  svg.append("g").call(yAxis);
 var xA = svg.append("g").attr("transform", "translate(0, " + height + ")").call(xAxis);


 var line = d3.line()
 	.x(x)
 	.y(y)


// Load the data.
d3.json("topWords.json", function(words) {

  console.log(words)
  function wordRankOverTime(word){
    var curr = words.filter(function(a){ 
      return a.word == word; 
    })
     // var output = []
     //  var dayBefore = curr[0].day;

     //  if(curr[0].day != startDay){
     //      var day = startDay
     //      var fakeDay = {"day": day, "rank": 13, "word": word}
     //      output.push(fakeDay);
     //      while(day + 1 != dayBefore){
     //        var fakeDay = {"day": day, "rank": 13, "word": word}
     //        day++;
     //        fakeDay.day = day
     //        output.push(fakeDay)
     //      }
     //  }
      
     //  output.push(curr[0])
     //  for(var i = 1; i < curr.length; i++){
     //    if(curr[i].day == (dayBefore + 1)){
     //      output.push(curr[i])
     //      dayBefore++;
     //    } else {
     //      while(dayBefore + 1 != curr[i].day){
     //        var temp = {"day": dayBefore, "rank": 13, "word": word}
     //        dayBefore++;
     //        temp.day = dayBefore
     //        output.push(temp)
     //      }
     //    }
     //  }
        
     //  if(curr[curr.length-1].day != lastDay){
     //      var day = curr[curr.length-1].day + 1;
     //      while(day <= lastDay){
     //        var fakeLast = {"day": day, "rank": 13, "word": word};
     //        output.push(fakeLast);
     //        day++;
     //        fakeLast.day = day
     //      }
     //    }
    var output = []
     if (curr[0].day != 1){
      output.push({"word": word, "rank": 20, "day": curr[0].day-1, "count": 0})
      output = output.concat(curr)
     } else {
      output = curr
     }
     
     //console.log(output)
     console.log(word)
     var newDate = 0;
     if(curr[curr.length-1].day != 22){
      console.log(output)
      var endDate = curr[curr.length-1].day;
      if(endDate > 10){
        newDate = 23
      } else{
        newDate = 11
      }
      output.push({"word": word, "rank": 60, "day": newDate, "count": 0})
     }
    return output
}

  var allPaths = [];

  	for(var i = 0; i < words.length; i++){
  		var currWord = wordRankOverTime(words[i].word)

  		graph.append("path")
  		    .attr("d", line(currWord))
  		    .attr("fill", "none")
  		    .attr("stroke-width", 5)
  		    .attr("stroke", color())
          .attr("id", "rankPath")
          .style("opacity", .5)
          .append("title").text("Word: " + words[i].word)
          allPaths.push(currWord)
  	}

    var aprilLabel = svg.append("text").attr("x", 320).attr("y", height+margin.bottom-10)
      .attr("id", "aprilLabel").text("April 1 - April 7")
      .style("fill", "#808080")
      .style("font-size", "50px")

    var box = aprilLabel.node().getBBox();

    var overlay = svg.append("rect")
              .attr("x", box.x)
              .attr("y", box.y)
              .attr("height", box.height)
              .attr("width", box.width)
              .attr("class", "overlay")

      var aprilScale = d3.scaleLinear().range([1, 16]).domain([box.x, box.x+box.width])
      overlay.on("mousemove", mousemove);

    var prevDay = 1;

    function mousemove(){
      startDay= Math.round(aprilScale(d3.mouse(this)[0]))
      if(prevDay != startDay){
        lastDay = startDay + 6
        aprilLabel.text("April " + startDay + " - " + "April " + lastDay)
        xScale.domain([dateFormat("2017-4-"+startDay), dateFormat("2017-4-"+lastDay)])
        xA.call(xAxis)

        var translate = xScale(dateFormat("2017-4-1"))

        d3.selectAll("#rankPath").style("visibility", "hidden")
        .attr("transform", null)
        .transition().duration(0).ease(d3.easeLinear).attr("transform", "translate("+ translate + ")");
      d3.selectAll("#rankPath").style("visibility", "visible")
      prevDay = startDay;
      
    


      }
        
      }


});
