var plotModule = (function () {

  // Setup plot window
  var margin = {top: 20, right: 20, bottom: 30, left: 50},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

  var x = d3.scale.linear().range([0, width]),
      y = d3.scale.linear().range([height, 0]),
      xAxis = d3.svg.axis().scale(x).orient("bottom"),
      yAxis = d3.svg.axis().scale(y).orient("left");

  var line = d3.svg.line()
    .x(function(d) { return x(d.tijd); })
    .y(function(d) { return y(d.snelheid); })
    .interpolate("basis");

  var svg = d3.select("body").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


  // Public functions
  function createPlot() {
    // initial data on plot
    var data = [{tijd: 0, snelheid: 0}];

    x.domain(d3.extent(data, function(d) { return +d.tijd; }));
    y.domain(d3.extent(data, function(d) { return +d.snelheid; }));

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
      .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em");
        //.style("text-anchor", "end")
        //.text("Snelheid (km/u)");

    svg.append("path")
        .datum(data)
        .attr("class", "line")
        .attr("d", line);
  }

  function updatePlot(error, data) {
    if (error) throw error;

    x.domain(d3.extent(data, function(d) { return +d.tijd; }));
    y.domain(d3.extent(data, function(d) { return +d.snelheid; }));

    svg.select(".x.axis")
        .call(xAxis);

    svg.select(".y.axis")
        .call(yAxis);

    svg.select(".line")
        .datum(data)
        .attr("d", line);
  }

  // Reveal public vars and funcs
  return {
    create: createPlot,
    update: updatePlot
  }
})();

plotModule.create();

//var test3 = [{tijd: 0, snelheid: 0}, {tijd: 1, snelheid: 2}, {tijd: 2, snelheid: 1}];
