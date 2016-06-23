// Add new panel with detailed information
//--------------------------------------------------------
$panel = d3.select(".container").append("div")
                .attr("class", "panel panel-primary");

$panel.append("div")
    .attr("class", "panel-heading")
    .text("Alle gemeten parameters");

var $panelBody = $panel.append("div")
    .attr("class", "panel-body");


// Add three tables to new panel
//--------------------------------------------------------
$panelBody.append("h3").text("Score bruikbaarheid");

var heading1 = ["naam", "bediening", "regeling", "batterij", "staander"];
var table1 = $panelBody.append("table")
    .attr("class", "table table-striped");

$panelBody.append("h3").text("Score betrouwbaarheid");

var heading2 = ["montage"];
var table2 = $panelBody.append("table")
    .attr("class", "table table-striped");

$panelBody.append("h3").text("Score veiligheid");

var heading3 = ["remmen", "verlichting"];
var table3 = $panelBody.append("table")
    .attr("class", "table table-striped");


// Add content to tables
//--------------------------------------------------------
table1.append("thead")
    .append("tr")
    .selectAll("th")
    .data(heading1).enter()
    .append("th")
    .text(function(d) {return d;});

    // table header
var tr1 = table1.append("tbody")
    .selectAll('tr')
.data( bikes.getAllData() ).enter()
.append('tr');

    // table content
tr1.append('td').html(function(m) { return m.naam * 100; });
tr1.append('td').html(function(m) { return m.bediening * 100; });
tr1.append('td').html(function(m) { return m.regeling * 100; });
tr1.append('td').html(function(m) { return m.batterij * 100; });
tr1.append('td').html(function(m) { return m.staander * 100; });

/*	var table = d3.select("#categories");
	var heading = ["Naam",
                   "Bruikbaarheid",
                   "betrouwbaarheid",
                   "veiligheid"
	];	//.append("table")
	table.append("thead")
		.append("tr")
		.selectAll("th")
		.data(heading).enter()
		.append("th")
		.text(function(d) {return d;});
		//.attr("class", "table");

	// create table header
	var tr = table.append("tbody")
		.selectAll('tr')
    .data(bikes.getData()).enter()
    .append('tr');

	tr.append('td').html(function(m) { return m.naam; });
	tr.append('td').html(function(m) { return Math.round(m.bruikbaarheid); });
	tr.append('td').html(function(m) { return Math.round(m.betrouwbaarheid); });
	tr.append('td').html(function(m) { return Math.round(m.veiligheid); });
    */