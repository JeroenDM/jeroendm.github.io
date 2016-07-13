// module to manage bike sizing calculation
var sizeModule = (function () {
    
    var hscale = d3.scale.linear().domain([90, 45]).range([0, 188]);
    var len = {
        maxmax: 0,
        max: 0,
        min: 0,
        minmin: 0
    };
    var dat = {
        Hs: 0,
        Hzmin: 0,
        Hzmax: 0,
        Lsmin: 0,
        Lsmax: 0
    };
    
    function _parseValues() {
        dat.Hs = parseFloat( document.getElementById("Hs").value );
        dat.Hzmin = parseFloat( document.getElementById("Hzmin").value );
        dat.Hzmax = parseFloat( document.getElementById("Hzmax").value );
        dat.Lsmin = parseFloat( document.getElementById("Lsmin").value );
        dat.Lsmax = parseFloat( document.getElementById("Lsmax").value );
    }
    
    function calcSize() {
        var Lzmax = parseFloat( document.getElementById("Lzmax").value );
        var Lzmin = parseFloat( document.getElementById("Lzmin").value );

        if (Lzmin < 0 || Lzmin > 2) {
            alert("Lz laag moet tussen 0 en 2 meter zijn.")
        } else if (Lzmax < 0 || Lzmax > 2) {
            alert("Lz hoog moet tussen 0 en 2 meter zijn.")
        } else {
            len.maxmax = Math.round(Lzmax / 45 / 1.1 * 10000) / 100;
            len.max = Math.round(Lzmax / 48 / 1.1 * 10000) / 100;
            len.min = Math.round(Lzmin / 45 / 1.1 * 10000) / 100;
            len.minmin = Math.round(Lzmin / 48 / 1.1 * 10000) / 100;
            
            document.getElementById("maxmaxLengte").innerHTML = len.maxmax + " m";
            document.getElementById("maxLengte").innerHTML = len.max + " m";
            document.getElementById("minLengte").innerHTML = len.min + " m";
            document.getElementById("minminLengte").innerHTML = len.minmin + " m";
        }
    }
    
    function calcPost() {
        // get input values
        //------------------------------------------------------------------
        _parseValues();
        
        // zadel laag
        //------------------------------------------------------------------
        var lmin = (len.min + len.minmin) / 2;
        var Hsz = dat.Hs - dat.Hzmin - 0.095*lmin;
        var ld = Math.sqrt(dat.Lsmin * dat.Lsmin + Hsz * Hsz);
        
        var a = Math.asin( Hsz / ld );
        
        var b = Math.acos( ((0.26 * lmin)*(0.26 * lmin) + ld*ld - (0.42*lmin)*(0.42*lmin)) / (2*0.26*lmin*ld) );
        
        var gammaL = (a+b) * 180 / Math.PI;
        console.log("gamma laag: " + gammaL);
        if (gammaL > 90) {gammaL = 90};
        
        d3.select(".arrow1").attr("transform", "translate(" + hscale(gammaL) + ",0)");
        
        // zadel hoog
        //------------------------------------------------------------------
        var lmax = (len.max + len.maxmax) / 2;
        var Hsz = dat.Hs - dat.Hzmax - 0.095*lmax;
        var ld = Math.sqrt(dat.Lsmax * dat.Lsmax + Hsz * Hsz);
        
        var a = Math.asin( Hsz / ld );
        
        var b = Math.acos( ((0.26 * lmax)*(0.26 * lmax) + ld*ld - (0.42*lmax)*(0.42*lmax)) / (2*0.26*lmax*ld) );
        
        var gammaH = (a+b) * 180 / Math.PI;
        console.log("gamma hoog: " + gammaH);
        if (gammaH > 90) {gammaH = 90};
        
        d3.select(".arrow2").attr("transform", "translate(" + hscale(gammaH) + ",0)");
    }
    
    return {
        calcSize: calcSize,
        calcPost: calcPost,
        dat: dat,
        len: len
    };
})();

sizeModule.calcSize();

/*

var Lsmin = parseFloat( document.getElementById("Lsmin").value );
    var Lsmax = parseFloat( document.getElementById("Lsmax").value );
    var Hzmin = parseFloat( document.getElementById("Hzmin").value );
    var Hzmax = parseFloat( document.getElementById("Hzmax").value );
    var Hsmin = parseFloat( document.getElementById("Hsmin").value );
    var Hsmax = parseFloat( document.getElementById("Hsmax").value );
    
    var hscale = d3.scale.linear().domain([0, 90]).range([4, 204]);
    
    var h1 = hscale(0);
    var h2 = hscale(30);
    var h3 = hscale(60);
    var h4 = hscale(90);
    d3.select(".arrow1").attr("transform", "translate(" + h1 + ",0)");
    d3.select(".arrow1").attr("transform", "translate(" + h2 + ",0)");
    d3.select(".arrow1").attr("transform", "translate(" + h3 + ",0)");
    d3.select(".arrow4").attr("transform", "translate(" + h4 + ",0)");
    
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