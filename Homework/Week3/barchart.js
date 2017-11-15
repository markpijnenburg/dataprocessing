// Name: Mark Pijnenburg
// Student number: 11841117
// Minor Programmeren
// University of Amsterdam


// Define size/margins of canvas
var margin = {top: 10, right: 10, bottom: 50, left: 60};
var width = 1000 - margin.left - margin.right;
var height = 550 - margin.top - margin.bottom;

// Define X and Y axis from chart
var x = d3.scale.ordinal().rangeRoundBands([0, width], .05);
var y = d3.scale.linear().range([height, 0]);
var xAxis = d3.svg.axis().scale(x).orient("bottom").tickFormat(d3.time.format("%Y"));
var yAxis = d3.svg.axis().scale(y).orient("left").ticks(10);

var parseDate = d3.time.format("%y").parse;

// Add chart canvas to webpage
var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .attr("class" , "chart")
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

// Load data from JSON
d3.json("data.json", function(error, data){
  data.forEach(function(d) {
    // Convert dates to dateobject and values to ints
    d.year = new Date(d.year);
    d.value = Number(+d.value);
  });

// Define domain X axis
x.domain(data.map(function(d) { return d.year; }));

// Define domain Y axis
y.domain([0, 100]);

// Define D3 tooltip
var tip = d3.tip().attr('class', 'd3-tip').html(function(d) { return d.value + "%"; });
svg.call(tip);

//  Add X axis to canvas
svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis)
  .selectAll("text")
    .style("text-anchor", "end")
    .attr("dx", "1em")
    .attr("dy", "1em")
    .attr("transform", "rotate(0)");

// Add Y axis to canvas
svg.append("g")
    .attr("class", "y axis")
    .call(yAxis)
  .append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", -30)
    .attr("x", -200)
    .attr("dy", "-.71em")
    .style("text-anchor", "end")
    .style("font", "15px sans-serif")
    .text("Percentage");

// Add "year" text to X axis
svg.append("text")
    .attr("class", "y axis")
    .attr("transform",
          "translate(" + (width/2) + " ," +
                         (height + margin.top + 35) + ")")
    .style("text-anchor", "middle")
    .text("Year");

// Add bar based on data to canvas
svg.selectAll("bar")
    .data(data)
  .enter().append("rect")
    .attr("class", "bar")
    .attr("x", function(d) { return x(d.year); })
    .attr("width", x.rangeBand())
    .attr("y", function(d) { return y(d.value); })
    .attr("height", function(d) { return height - y(d.value); })
    .on("mouseover", tip.show)
    .on("mouseout", tip.hide);

});