/////////////////////////////////////
// Step 1: Write accessor functions //
//////////////////////////////////////

// Accessor functions for the four dimensions of our data
// For each of these, assume that d looks like the following:
// {"name": string, "income": number, "lifeExpectancy": number,
//  "population": number, "region": string}
function x(d) {
    return xScale(d.count);
}
function y(d) {
    return yScale(d.sentiment);
}
function radius(d) {
    return radiusScale(d.importance)*2+10;
}
function color(d) {
    return colorDict[d.topic];
}
function key(d) {
    return topicDict[d.topic];
}

function fill(d){
  return fillScale(d.sentiment)
}

var topicDict = {}
topicDict["b"] = "Budget"
topicDict["g"] = "Guns"
topicDict["c"] = "Supreme Court"
topicDict["t"] = "Taxes"
topicDict["r"] = "Russia"
topicDict["s"] = "Syria"
topicDict["m"] = "News and Media"
topicDict["i"] = "Immigration"
topicDict["h"] = "Health Care"
topicDict["x"] = "Terrorism"
topicDict["j"] = "Jobs and Unemployment"
topicDict["o"] = "Obama Surveillance"
topicDict["y"] = "Hillary Clinton"
topicDict["e"] = "Climate Change"
topicDict["n"] = "Negative Tweets"
topicDict["p"] = "Positive Tweets"




// Chart dimensions
var margin = {top: 19.5, right: 30, bottom: 40, left: 55.5};
var width = 960 - margin.right;
var height = 550 - margin.top - margin.bottom;

// Various scales
var xScale = d3.scaleLinear().domain([0, 6000]).range([0, width]),
    //yScale = d3.scaleLinear().domain([0, 1]).range([height, 0]),
    yScale = d3.scaleLinear().domain([0, 1]).range([height, 0]),
    radiusScale = d3.scaleSqrt().domain([0, 90]).range([0, 30]),
    textScale = d3.scaleLinear().domain([0, 90]).range([10, 20]),
    //colorScale = d3.scaleOrdinal([0, 1, 2, 3, 4, 5, 6]);
    colorScale = d3.scaleOrdinal(d3.schemeCategory20);
var fillScale = d3.scaleLinear().domain([0, .6]).range([.6, 1.2])
var colorDict = {}
colorDict["b"] = d3.schemeCategory20[1]
colorDict["g"] = d3.schemeCategory20[2]
colorDict["c"] = d3.schemeCategory20[3]
colorDict["t"] = d3.schemeCategory20[4]
colorDict["r"] = d3.schemeCategory20[5]
colorDict["s"] = d3.schemeCategory20[6]
colorDict["m"] = d3.schemeCategory20[7]
colorDict["i"] = d3.schemeCategory20[8]
colorDict["h"] = d3.schemeCategory20[9]
colorDict["x"] = d3.schemeCategory20[10]
colorDict["j"] = d3.schemeCategory20[11]
colorDict["o"] = d3.schemeCategory20[12]
colorDict["y"] = d3.schemeCategory20[13]
colorDict["e"] = d3.schemeCategory20[14]
colorDict["n"] = d3.schemeCategory20[15]
colorDict["p"] = d3.schemeCategory20[16]
// The x & y axes
var xAxis = d3.axisBottom(xScale).ticks(12, d3.format(",d")),
    yAxis = d3.axisLeft(yScale);

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
//////////////////////////////
// Step 2: Add x and y axes //
//////////////////////////////
  svg.append("g").call(yAxis);
  svg.append("g").attr("transform", "translate(0, " + height + ")").call(xAxis);

//////////////////////////////////////
// Step 3: Add axis and year labels //
//////////////////////////////////////
  var lifeLabel = svg.append("text").attr("x", -290).attr("y", -45)
        .attr("id", "lifeLabel")
        .text("Average Sentiment of Topic")
        .style("font-size", "12px")
        .attr("transform", "rotate(270)")

  var xLabel = svg.append("text").attr("x", width/2).attr("y", height + 35)
    .text("Number of Tweets per Topic")
    .style("font-size", "12px")
    .style("text-anchor", "middle")


  var dayLabel = svg.append("text").attr("x", width - 270).attr("y", height - 30)
      .attr("id", "yearLabel").text("April 1")
      .style("fill", "#808080")
      .style("font-size", "80px");

// Load the data.
d3.json("aprilTopicSentiments.json", function(topics) {
  console.log(interpolateData(6))
  function interpolateData(day) {
    return topics.map(function(d) {
      var currDay = d.data.filter(function(a){
        a.day = parseInt(a.day)
          return a.day == day;
      })
      if(d.key in topicDict){
        return {
          day: day,
          topic: d.key,
          count: currDay[0].count,
          sentiment: currDay[0].average,
          importance: currDay[0].importance,
        };
      }
      else {
        return {
          day: 0,
          topic: d.key,
          count: -5,
          sentiment: -5,
          importance: -5,
        }
      }
    });
  }



  // Add a dot per nation. Initialize the data at 1800, and set the colors.
  var dayData = interpolateData(1);
  // dayData.sort(function(a, b){
  //   return radius(b) - radius(a);
  // });

  console.log(dayData)

  var dot = graph.append("g").selectAll("circle").data(dayData).enter().append("circle");  
        dot.attr("cx", x)
        .attr("cy", y)
        .attr("r", radius)
        .style("stroke", 'black')
        .style("stroke-width", "2")
        .style("fill", color)
        .attr("class", "dot")



//  Add voronoi diagram 
 var voronoi = d3.voronoi().x(function(d){return x(d)}).y(function(d){return y(d)})(dayData);


  // Add a title.
  // dot.append("title").text(key);


  var voronoi_overlay = svg.append("rect")
        .attr("width", width).attr("height", height)
        .attr("opacity", 0)
        .on("mousemove", voronoiMove);

  // Add an overlay for the year label.
  var box = dayLabel.node().getBBox();

  var overlay = svg.append("rect")
                .attr("x", box.x)
                .attr("y", box.y)
                .attr("height", box.height)
                .attr("width", box.width)
                .attr("class", "overlay")

    overlay
        .on("mouseover", mouseover)
        .on("mouseout", mouseout)
        .on("mousedown", activate)
        .on("mouseup", deactivate)
        .on("touchmove", mousemove);


function activate(){
  overlay.on("mousemove", mousemove)
}
function deactivate(){
  overlay.on("mousemove", null)

}
  // Start a transition that interpolates the data based on year.
  // svg.transition()
  //     .duration(30000)
  //     .ease(d3.easeLinear)
  //     .tween("year", tweenYear)
  //     .on("end", enableInteraction);



  // Positions the dots based on data.
    function position(dot) {
    dot.transition().duration(200)
        .attr("cx", x)
        .attr("cy", y)
        .attr("r", radius);
    // labels.attr("x", x)
    //     .attr("y", y)
    //     .text(key)
  }
  

  // Defines a sort order so that the smallest dots are drawn on top.
  function order(a, b) {
    return radius(b) - radius(a);
  }


    // Create a year scale
    var dayScale = d3.scaleLinear().range([1, 30]).domain([box.x, box.x + box.width])
    // Cancel the current transition, if any.
    //svg.transition().duration(0);
    // For the year overlay, add mouseover, mouseout, and mousemove events
    // that 1) toggle the active class on mouseover and out and 2)
    // change the displayed year on mousemove.



    function mouseover() {
      dayLabel.classed("active", true);
    }

    function mouseout() {
      dayLabel.classed("active", false);
    }

    function mousemove() {
      var day = Math.round(dayScale(d3.mouse(this)[0]))
      if (day == 7){
        day = 8
      }
      if (day == 15){
        day = 16
      }
      data = interpolateData(day)  //.sort(function(a, b){return radius(b)-radius(a)});
      dot.data(data);
      position(dot);
      dayLabel.text("April " + day);
      voronoi = d3.voronoi().x(x).y(y)(data);
    }
  

  var toolTip =  d3.select("body").append("div")
      .attr("class", "tooltip")
      .style("opacity", 0)

  voronoi_overlay.on("mouseout", function(d){
    toolTip.style("opacity", 0);
  })

  function voronoiMove(){
    var cord = d3.mouse(this);
    var closest = voronoi.find(cord[0], cord[1], 30);
    if(closest == null){
      toolTip.style("opacity", 0);
    } else {
      console.log(closest.data)
        var text = "<p id='topicTitle'>" + topicDict[closest.data.topic] + "</p>"
        text += "<p id='sentiment'>Average sentiment: " + closest.data.sentiment.toFixed(3) + "</p>"
        text += "<p id='topic'>Tweets: " + closest.data.count + "</p>"
        text += "<p id='importance'>Importance: " + closest.data.importance + "</p>"
        toolTip.transition()
        .duration(100)
        .style("opacity", .9)
        toolTip.html(text)
          .style("left", (closest[0] + margin.left + radius(closest.data) + 50)+ "px")
          .style("top", (closest[1] - 50) + "px")



        //curr_label.attr("opacity", 1).attr("x", closest[0]).attr("y", closest[1]).text(text);
    }
  }

});
