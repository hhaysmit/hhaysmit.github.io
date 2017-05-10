Skip to content
This repository
Search
Pull requests
Issues
Gist
 @hhaysmit
 Sign out
 Unwatch 1
  Star 0
  Fork 0 hhaysmit/Data-Science-Visualizations Private
 Code  Issues 0  Pull requests 0  Projects 0  Wiki  Pulse  Graphs  Settings
Branch: master Find file Copy pathData-Science-Visualizations/namesVis/bundle.js
118f1b0  18 minutes ago
@hhaysmit hhaysmit initial commit
1 contributor
RawBlameHistory     
697 lines (529 sloc)  18.1 KB
(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var randomColor = require('randomcolor')
var colorDict = {}

function x(d) {
    return xScale(dateFormat("2017-4-" +d.day));
}
function y(d) {
    return yScale(d.rank);
}

function color(d){
  //return colorScale(Math.random()*20)
  alreadyUsed = true
  while(alreadyUsed){
    //newColor = "#" + Math.random().toString(16).slice(2, 8).toUpperCase()
    newColor = randomColor()
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

    var aprilLabel = svg.append("text").attr("x", 320).attr("y", height+margin.bottom-10)
      .attr("id", "aprilLabel").text("April 1 - April 7")
      .style("fill", "#808080")
      .style("font-size", "50px")

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

},{"randomcolor":2}],2:[function(require,module,exports){
// randomColor by David Merfield under the CC0 license
// https://github.com/davidmerfield/randomColor/

;(function(root, factory) {

  // Support CommonJS
  if (typeof exports === 'object') {
    var randomColor = factory();

    // Support NodeJS & Component, which allow module.exports to be a function
    if (typeof module === 'object' && module && module.exports) {
      exports = module.exports = randomColor;
    }

    // Support CommonJS 1.1.1 spec
    exports.randomColor = randomColor;

  // Support AMD
  } else if (typeof define === 'function' && define.amd) {
    define([], factory);

  // Support vanilla script loading
  } else {
    root.randomColor = factory();
  }

}(this, function() {

  // Seed to get repeatable colors
  var seed = null;

  // Shared color dictionary
  var colorDictionary = {};

  // Populate the color dictionary
  loadColorBounds();

  var randomColor = function (options) {

    options = options || {};

    // Check if there is a seed and ensure it's an
    // integer. Otherwise, reset the seed value.
    if (options.seed !== undefined && options.seed !== null && options.seed === parseInt(options.seed, 10)) {
      seed = options.seed;

    // A string was passed as a seed
    } else if (typeof options.seed === 'string') {
      seed = stringToInteger(options.seed);

    // Something was passed as a seed but it wasn't an integer or string
    } else if (options.seed !== undefined && options.seed !== null) {
      throw new TypeError('The seed value must be an integer or string');

    // No seed, reset the value outside.
    } else {
      seed = null;
    }

    var H,S,B;

    // Check if we need to generate multiple colors
    if (options.count !== null && options.count !== undefined) {

      var totalColors = options.count,
          colors = [];

      options.count = null;

      while (totalColors > colors.length) {

        // Since we're generating multiple colors,
        // incremement the seed. Otherwise we'd just
        // generate the same color each time...
        if (seed && options.seed) options.seed += 1;

        colors.push(randomColor(options));
      }

      options.count = totalColors;

      return colors;
    }

    // First we pick a hue (H)
    H = pickHue(options);

    // Then use H to determine saturation (S)
    S = pickSaturation(H, options);

    // Then use S and H to determine brightness (B).
    B = pickBrightness(H, S, options);

    // Then we return the HSB color in the desired format
    return setFormat([H,S,B], options);
  };

  function pickHue (options) {

    var hueRange = getHueRange(options.hue),
        hue = randomWithin(hueRange);

    // Instead of storing red as two seperate ranges,
    // we group them, using negative numbers
    if (hue < 0) {hue = 360 + hue;}

    return hue;

  }

  function pickSaturation (hue, options) {

    if (options.hue === 'monochrome') {
      return 0;
    }

    if (options.luminosity === 'random') {
      return randomWithin([0,100]);
    }

    var saturationRange = getSaturationRange(hue);

    var sMin = saturationRange[0],
        sMax = saturationRange[1];

    switch (options.luminosity) {

      case 'bright':
        sMin = 55;
        break;

      case 'dark':
        sMin = sMax - 10;
        break;

      case 'light':
        sMax = 55;
        break;
   }

    return randomWithin([sMin, sMax]);

  }

  function pickBrightness (H, S, options) {

    var bMin = getMinimumBrightness(H, S),
        bMax = 100;

    switch (options.luminosity) {

      case 'dark':
        bMax = bMin + 20;
        break;

      case 'light':
        bMin = (bMax + bMin)/2;
        break;

      case 'random':
        bMin = 0;
        bMax = 100;
        break;
    }

    return randomWithin([bMin, bMax]);
  }

  function setFormat (hsv, options) {

    switch (options.format) {

      case 'hsvArray':
        return hsv;

      case 'hslArray':
        return HSVtoHSL(hsv);

      case 'hsl':
        var hsl = HSVtoHSL(hsv);
        return 'hsl('+hsl[0]+', '+hsl[1]+'%, '+hsl[2]+'%)';

      case 'hsla':
        var hslColor = HSVtoHSL(hsv);
        var alpha = options.alpha || Math.random();
        return 'hsla('+hslColor[0]+', '+hslColor[1]+'%, '+hslColor[2]+'%, ' + alpha + ')';

      case 'rgbArray':
        return HSVtoRGB(hsv);

      case 'rgb':
        var rgb = HSVtoRGB(hsv);
        return 'rgb(' + rgb.join(', ') + ')';

      case 'rgba':
        var rgbColor = HSVtoRGB(hsv);
        var alpha = options.alpha || Math.random();
        return 'rgba(' + rgbColor.join(', ') + ', ' + alpha + ')';

      default:
        return HSVtoHex(hsv);
    }

  }

  function getMinimumBrightness(H, S) {

    var lowerBounds = getColorInfo(H).lowerBounds;

    for (var i = 0; i < lowerBounds.length - 1; i++) {

      var s1 = lowerBounds[i][0],
          v1 = lowerBounds[i][1];

      var s2 = lowerBounds[i+1][0],
          v2 = lowerBounds[i+1][1];

      if (S >= s1 && S <= s2) {

         var m = (v2 - v1)/(s2 - s1),
             b = v1 - m*s1;

         return m*S + b;
      }

    }

    return 0;
  }

  function getHueRange (colorInput) {

    if (typeof parseInt(colorInput) === 'number') {

      var number = parseInt(colorInput);

      if (number < 360 && number > 0) {
        return [number, number];
      }

    }

    if (typeof colorInput === 'string') {

      if (colorDictionary[colorInput]) {
        var color = colorDictionary[colorInput];
        if (color.hueRange) {return color.hueRange;}
      } else if (colorInput.match(/^#?([0-9A-F]{3}|[0-9A-F]{6})$/i)) {
        const hue = HexToHSB(colorInput)[0];
        return [ hue, hue ];
      }
    }

    return [0,360];

  }

  function getSaturationRange (hue) {
    return getColorInfo(hue).saturationRange;
  }

  function getColorInfo (hue) {

    // Maps red colors to make picking hue easier
    if (hue >= 334 && hue <= 360) {
      hue-= 360;
    }

    for (var colorName in colorDictionary) {
       var color = colorDictionary[colorName];
       if (color.hueRange &&
           hue >= color.hueRange[0] &&
           hue <= color.hueRange[1]) {
          return colorDictionary[colorName];
       }
    } return 'Color not found';
  }

  function randomWithin (range) {
    if (seed === null) {
      return Math.floor(range[0] + Math.random()*(range[1] + 1 - range[0]));
    } else {
      //Seeded random algorithm from http://indiegamr.com/generate-repeatable-random-numbers-in-js/
      var max = range[1] || 1;
      var min = range[0] || 0;
      seed = (seed * 9301 + 49297) % 233280;
      var rnd = seed / 233280.0;
      return Math.floor(min + rnd * (max - min));
    }
  }

  function HSVtoHex (hsv){

    var rgb = HSVtoRGB(hsv);

    function componentToHex(c) {
        var hex = c.toString(16);
        return hex.length == 1 ? '0' + hex : hex;
    }

    var hex = '#' + componentToHex(rgb[0]) + componentToHex(rgb[1]) + componentToHex(rgb[2]);

    return hex;

  }

  function defineColor (name, hueRange, lowerBounds) {

    var sMin = lowerBounds[0][0],
        sMax = lowerBounds[lowerBounds.length - 1][0],

        bMin = lowerBounds[lowerBounds.length - 1][1],
        bMax = lowerBounds[0][1];

    colorDictionary[name] = {
      hueRange: hueRange,
      lowerBounds: lowerBounds,
      saturationRange: [sMin, sMax],
      brightnessRange: [bMin, bMax]
    };

  }

  function loadColorBounds () {

    defineColor(
      'monochrome',
      null,
      [[0,0],[100,0]]
    );

    defineColor(
      'red',
      [-26,18],
      [[20,100],[30,92],[40,89],[50,85],[60,78],[70,70],[80,60],[90,55],[100,50]]
    );

    defineColor(
      'orange',
      [19,46],
      [[20,100],[30,93],[40,88],[50,86],[60,85],[70,70],[100,70]]
    );

    defineColor(
      'yellow',
      [47,62],
      [[25,100],[40,94],[50,89],[60,86],[70,84],[80,82],[90,80],[100,75]]
    );

    defineColor(
      'green',
      [63,178],
      [[30,100],[40,90],[50,85],[60,81],[70,74],[80,64],[90,50],[100,40]]
    );

    defineColor(
      'blue',
      [179, 257],
      [[20,100],[30,86],[40,80],[50,74],[60,60],[70,52],[80,44],[90,39],[100,35]]
    );

    defineColor(
      'purple',
      [258, 282],
      [[20,100],[30,87],[40,79],[50,70],[60,65],[70,59],[80,52],[90,45],[100,42]]
    );

    defineColor(
      'pink',
      [283, 334],
      [[20,100],[30,90],[40,86],[60,84],[80,80],[90,75],[100,73]]
    );

  }

  function HSVtoRGB (hsv) {

    // this doesn't work for the values of 0 and 360
    // here's the hacky fix
    var h = hsv[0];
    if (h === 0) {h = 1;}
    if (h === 360) {h = 359;}

    // Rebase the h,s,v values
    h = h/360;
    var s = hsv[1]/100,
        v = hsv[2]/100;

    var h_i = Math.floor(h*6),
      f = h * 6 - h_i,
      p = v * (1 - s),
      q = v * (1 - f*s),
      t = v * (1 - (1 - f)*s),
      r = 256,
      g = 256,
      b = 256;

    switch(h_i) {
      case 0: r = v; g = t; b = p;  break;
      case 1: r = q; g = v; b = p;  break;
      case 2: r = p; g = v; b = t;  break;
      case 3: r = p; g = q; b = v;  break;
      case 4: r = t; g = p; b = v;  break;
      case 5: r = v; g = p; b = q;  break;
    }

    var result = [Math.floor(r*255), Math.floor(g*255), Math.floor(b*255)];
    return result;
  }

  function HexToHSB (hex) {
    hex = hex.replace(/^#/, '');
    hex = hex.length === 3 ? hex.replace(/(.)/g, '$1$1') : hex;

    const red = parseInt(hex.substr(0, 2), 16) / 255,
          green = parseInt(hex.substr(2, 2), 16) / 255,
          blue = parseInt(hex.substr(4, 2), 16) / 255;

    const cMax = Math.max(red, green, blue),
          delta = cMax - Math.min(red, green, blue),
          saturation = cMax ? (delta / cMax) : 0;

    switch (cMax) {
      case red: return [ 60 * (((green - blue) / delta) % 6) || 0, saturation, cMax ];
      case green: return [ 60 * (((blue - red) / delta) + 2) || 0, saturation, cMax ];
      case blue: return [ 60 * (((red - green) / delta) + 4) || 0, saturation, cMax ];
    }
  }

  function HSVtoHSL (hsv) {
    var h = hsv[0],
      s = hsv[1]/100,
      v = hsv[2]/100,
      k = (2-s)*v;

    return [
      h,
      Math.round(s*v / (k<1 ? k : 2-k) * 10000) / 100,
      k/2 * 100
    ];
  }

  function stringToInteger (string) {
    var total = 0
    for (var i = 0; i !== string.length; i++) {
      if (total >= Number.MAX_SAFE_INTEGER) break;
      total += string.charCodeAt(i)
    }
    return total
  }

  return randomColor;
}));

},{}]},{},[1]);
Contact GitHub API Training Shop Blog About
© 2017 GitHub, Inc. Terms Privacy Security Status Help