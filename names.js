
var randomColor = require('randomcolor')
var colorDict = {}

function x(d) {
    return xScale(dateFormat("2017-4-" +d.day));
}
function y(d) {
    return yScale(d.rank);
}

var colorCount = 0
function color(d){
  alreadyUsed = true
  colorOptions = {}
  while(alreadyUsed){
    newColor = randomColor({hue: 'random'})
    console.log(newColor)
    if (colorDict[newColor] == null){
      alreadyUsed = false
      colorDict[newColor] = d.word
    }
    return newColor
  }
}

var finalDay = 30
var lastDay = 7
var startDay = 1
var filteredData;


// Chart dimensions
var margin = {top: 70, right: 200, bottom: 70, left: 39.5};
var width = 1100 - margin.right;
var height = 600 - margin.top - margin.bottom;

var dateFormat = d3.timeParse("%Y-%m-%d")

// Various scales
var xScale = d3.scaleTime().domain([dateFormat("2017-4-1"), dateFormat("2017-4-7")]).range([0, width]),
    yScale = d3.scaleLinear().domain([11, 1]).range([height, 0]),
    widthScale = d3.scaleLinear().domain([500, 5000]).range([1, 7])




// The x & y axes
var xAxis = d3.axisBottom(xScale).ticks(7),
    yAxis = d3.axisLeft(yScale),
    yAxisRight = d3.axisRight(yScale), 
    colorScale = d3.scaleOrdinal(d3.schemeCategory20);

// Create the SVG container and set the origin
var svg = d3.select("#topWords").append("svg")
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
  svg.append("g").attr("transform", "translate("+ width+ ", 0)").call(yAxisRight).selectAll("text").remove();
 var xA = svg.append("g").attr("transform", "translate(0, " + height + ")").call(xAxis);

var yLabel = svg.append("text").attr("x", -height/2).attr("y", -25)
        .attr("id", "yLabel")
        .text("Word Rank")
        .style("font-size", "15px")
        .attr("text-anchor", "middle")
        .attr("transform", "rotate(270)")

var graphTitle = svg.append("text").attr("x", width/2).attr("y", -40)
.attr("text-anchor", "middle")
.text("Responding to Donald Trump: Top Ten Most Used Words")
.style("font-size", "20px")

 var line = d3.line()
 	.x(x)
 	.y(y)

var whiteout = svg.append("rect").attr("width", "10px").attr("height", "10px").attr("x", -20).attr("y", yScale(11)-4).style("fill", "white")
// Load the data.
d3.json("allTopWords.json", function(words) {

  console.log(words)
  function wordRankOverTime(word){
    var curr = words.filter(function(a){ 
      a.day = parseInt(a.day)
      return a.word == word; 
    })
    var output = []
    var dayBefore = curr[0].day;

      if(curr[0].day != startDay){
          var day = curr[0].day-1
          var fakeDay = {"day": day, "rank": 13, "word": word}
          output.push(fakeDay);
      }
      
      output.push(curr[0])
      for(var i = 1; i < curr.length; i++){
        if(curr[i].day == (dayBefore + 1)){
          output.push(curr[i])
          dayBefore++;
        } else {
            dayBefore++;
            var temp = {"day": dayBefore, "rank": 15, "word": word}
            output.push(temp)
            dayBefore = curr[i].day - 1;
            var temp2 = {"day": dayBefore, "rank": 15, "word": word}
            output.push(temp2)
            output.push(curr[i])
            dayBefore = curr[i].day
        }
      }
        
      if(curr[curr.length-1].day != lastDay){
          var day = curr[curr.length-1].day + 1;
          var fakeLast = {"day": day, "rank": 13, "word": word};
          output.push(fakeLast);
        }
    return output
}

  var allPaths = [];

  	for(var i = 0; i < words.length; i++){
  		var currWord = wordRankOverTime(words[i].word)

  		graph.append("path")
  		    .attr("d", line(currWord))
  		    .attr("fill", "none")
  		    .attr("stroke-width", 6)
  		    .attr("stroke", color(currWord))
          .attr("id", "rankPath")
          // .style("opacity", .5)
          .append("title").text("Word: " + words[i].word)
          allPaths.push(currWord)
  	}


    var rankLabels = []
    var topCount = svg.append("text").attr("x", width+10).attr("y", -20).text("April " + lastDay+": Word Count")
    .style("font-size", "20px")

    var currDay = words.filter(function(a){
      a.day = parseInt(a.day)
      return a.day == 6;
    })
    for(var i = 1; i < 11; i++){
      var curr = svg.append("text").attr("x", width+10).attr("y", yScale(i))
      .attr("id", "rankLabel").text(currDay[i-1].word + ": " + currDay[i-1].count)
      .style("font-size", "12px")
      .attr("alignment-baseline", "middle")
      .attr("visibility", "hidden")
      rankLabels.push(curr)
    }

    var noTweetsMessage = svg.append("text").attr("x", width+10).attr("y", yScale(1.3))
      .attr("width", "50px")
      .attr("id", "noTweet").text("Donald Trump did not tweet today,")
      .style("font-size", "12px")
      .attr("alignment-baseline", "middle")
    var noTweetsMessage2 = svg.append("text").attr("x", width+10).attr("y", yScale(1.65))
      .attr("width", "50px")
      .attr("id", "noTweet").text("so there is no data for word count.")
      .style("font-size", "12px")
      .attr("alignment-baseline", "middle")


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

      var aprilScale = d3.scaleLinear().range([1, 24]).domain([box.x, box.x+box.width])
      overlay.on("mousemove", mousemove);

    var prevDay = 1;

    function mousemove(){
      startDay= Math.round(aprilScale(d3.mouse(this)[0]))
      if(prevDay != startDay){
        lastDay = startDay + 6
        aprilLabel.text("April " + startDay + " - " + "April " + lastDay)
        xScale.domain([dateFormat("2017-4-"+startDay), dateFormat("2017-4-"+lastDay)])
        xA.call(xAxis)


        topCount.text("April " + lastDay + ": Word Count")
        var currDay = words.filter(function(a){
            a.day = parseInt(a.day)
            return a.day == lastDay;
        })
        if(currDay.length != 0){
          noTweetsMessage.attr("visibility", "hidden")
          noTweetsMessage2.attr("visibility", "hidden")
          for(var i = 0; i < 10; i++){
            var curr = rankLabels[i]
            curr.text(currDay[i].word + ": " + currDay[i].count).attr("visibility", "visible")
          }
      } else {
          noTweetsMessage.attr("visibility", "visible")
          noTweetsMessage2.attr("visibility", "visible")
          d3.selectAll("#rankLabel").attr("visibility", "hidden")
      }

        var translate = xScale(dateFormat("2017-4-1"))

        d3.selectAll("#rankPath").style("visibility", "hidden")
        .attr("transform", null)
        .transition().duration(0).ease(d3.easeLinear).attr("transform", "translate("+ translate + ")");
      d3.selectAll("#rankPath").style("visibility", "visible")
      prevDay = startDay;
      
      }
        
      }


});