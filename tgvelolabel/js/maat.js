function calcSize() {
    var Lzmax = parseFloat(document.getElementById("Lzmax").value);
    var Lzmin = parseFloat(document.getElementById("Lzmin").value);
    
    document.getElementById("maxmaxLengte").innerHTML = Math.round(Lzmax / 45 / 1.1 * 10000) / 100 + " m";
    document.getElementById("maxLengte").innerHTML = Math.round(Lzmax / 48 / 1.1 * 10000) / 100 + " m";
    document.getElementById("minLengte").innerHTML = Math.round(Lzmin / 45 / 1.1 * 10000) / 100 + " m";
    document.getElementById("minminLengte").innerHTML = Math.round(Lzmin / 48 / 1.1 * 10000) / 100 + " m";
    
    var h1 = 50;
    var h2 = 150;
    var h3 = 120;
    var h4 = 50;
    d3.select(".arrow1").attr("transform", "translate(" + h1 + ",0)");
    d3.select(".arrow1").attr("transform", "translate(" + h2 + ",0)");
    d3.select(".arrow1").attr("transform", "translate(" + h3 + ",0)");
    d3.select(".arrow4").attr("transform", "translate(" + h4 + ",0)");
}

/*
const UNIT = 80;
const WIDTH = 6 * UNIT;
const HEIGHT = 6 * UNIT;

var framePoints = (2.5*UNIT) + "," + (5*UNIT) + " " +
    (1.5*UNIT) + "," + (3.5*UNIT) + " " +
    (3*UNIT) + "," + (3.5*UNIT) + " " +
    (4*UNIT) + "," + (5*UNIT) + " " +
    (2.5*UNIT) + "," + (5*UNIT) + " " +
    (3*UNIT) + "," + (3.5*UNIT);

var handlebarPoints = (UNIT) + "," + (5*UNIT) + " " +
    (1.5*UNIT) + "," + (3.5*UNIT) + " " +
    (1.6*UNIT) + "," + (3.2*UNIT) + " " +
    (1.8*UNIT) + "," + (3.2*UNIT);

var svgBike = d3.select("#bike")
                .attr("width", WIDTH)
                .attr("height", HEIGHT);

svgBike.append("circle")
        .attr("cx", UNIT)
        .attr("cy", 5 * UNIT)
        .attr("r", UNIT - 6)
        .attr("stroke", "black")
        .attr("stroke-width", "3")
        .attr("fill", "none");

svgBike.append("circle")
        .attr("cx", 4 * UNIT)
        .attr("cy", 5 * UNIT)
        .attr("r", UNIT - 6)
        .attr("stroke", "black")
        .attr("stroke-width", "3")
        .attr("fill", "none");

svgBike.append("polyline")
        .attr("points", framePoints)
        .style("stroke", "black")
        .style("stroke-width", "3")
        .style("fill", "none");

svgBike.append("polyline")
        .attr("points", handlebarPoints)
        .style("stroke", "black")
        .style("stroke-width", "3")
        .style("fill", "none");
        */