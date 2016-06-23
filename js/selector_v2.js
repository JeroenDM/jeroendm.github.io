// Version two with dutch names and more parameters 20/06/2016
// met twee extra parameters, verlichting en helling

// debug function

function logScores() {
    var d = bikes.getData();
    var msg = "";
    
    for (var i = 0; i < d.length; ++i) {
        msg += d[i].naam + ": " + d[i].score + " points\n";
    }
    console.log(msg);
}

// Module for bikes data
//---------------------------------------------------------------------------
var bikes = (function() {
	var data = [];
	var selectedData = [];
    var maxScore = 1;

    // add three categories to data
    function _addCat() {
        for (i = 0; i < data.length; i++) {
            data[i].bruikbaarheid = (parseFloat(data[i].bediening)
                                     + parseFloat(data[i].batterij)
                                     + parseFloat(data[i].staander)
                                     + parseFloat(data[i].regeling)) * 100 / 4;
            data[i].betrouwbaarheid = +data[i].montage * 100;
            data[i].veiligheid = (+data[i].remmen * 20 + parseFloat(data[i].verlichting) * 100) / 2;
            data[i].score = 0;
        }
    }
    
	// Define module functions
	function addBikes(newBikes) {
		data = data.concat(newBikes);
        _addCat();
        updateScore([1, 1, 1]); // calculate initial score
        selectedData = data;
	}
    
    function updateSelection(ch) {
		selectedData = data.filter(function(x, i) {
			if (ch[i]) return x;
		});
	}
    
    function updateScore(w) {
        // if weigth are zero, make them all one to avoid bars with width zero
        if ( w.every(elem => elem == 0) ) {
            w = [1, 1, 1];
            console.log("all zeros");
        };
        
		maxScore = 1; // reset maxScore before every change
		for (i = 0; i < data.length; i++) {
			data[i].score = Math.round(
				w[0] * data[i].bruikbaarheid
				+ w[1] * data[i].betrouwbaarheid
				+ w[2] * data[i].veiligheid
			);
            console.log("calculated: " + data[i].score);
			// track max score for scaling
			if (data[i].score > maxScore) {
				maxScore = data[i].score;
			};
		}
	}
    
    function getData() {
		return selectedData;
	}
    
    function getAllData() {
		return data;
	}

	function getMaxScore() {
		return maxScore;
	}

	return {
		addBikes: addBikes,
        getData: getData,
        getAllData: getAllData,
        update: updateSelection,
        updateScore: updateScore,
        getMaxScore: getMaxScore
	};
})();

// Module to draw table with basic information
//---------------------------------------------------------------------------
function drawInfoTable(){

	var table = d3.select("#selectionTable");
	var heading = ["",
                   "ontwerpsnelheid",
                   "weerstand",
                   "beschikbare energie",
                   "geschikte lichaamslengte",
                   "max helling"
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
    .data(bikes.getAllData()).enter()
    .append('tr');

	tr.append('td').html(function(m) { return "<input type='checkbox' id='" + m.naam + "'checked/><label>" + m.naam + "</label>"; });
	tr.append('td').html(function(m) { return m.ontwerpsnelheid; });
	tr.append('td').html(function(m) { return m.weerstand; });
	tr.append('td').html(function(m) { return m.nae; });
    tr.append('td').html(function(m) { return (+m.minMaat/10) + " cm - " + (+m.maxMaat/10) + " cm";});
    tr.append('td').html(function(m) { return m.helling + " %";});
}

// Module for interaction (bike data depentent, if csv changes, this has to be adapted)
//-----------------------------------------------------------------------------
var interaction = (function() {
	// chache dom elements with d3.select
    //----------------------------
	var $labels = [
        d3.select("#useability-slider-label"),
		d3.select("#reliability-slider-label"),
		d3.select("#safety-slider-label")
	];
	var $sliders = [
        d3.select("#useability-slider"),
		d3.select("#reliability-slider"),
		d3.select("#safety-slider")
	];
    
    var $checkboxes = [];
    //var numberOfBikes = bikes.getAllData().length;
    //console.log("out loop " + numberOfBikes);
    // var ch = [false, false, false, false, false, false];
    // length based on data length
    var ch = [];
    /*for (var i = 0; i < numberOfBikes; ++i) {
        ch.push(false);
    }*/
    var w = [1, 1, 1]; // array with initial slider values
    
    //----------------------------
	// Draw initial slider value
	for (i = 0; i < $labels.length; i++) {
		$labels[i].text(w[i]);
	}

	// Bind sliders to slider update function in this module
	for (i = 0; i < $sliders.length; i++) {
		$sliders[i].on("input", _update);
	}
    
    // Private
    //----------------------------
	function _update() {
        console.log("slider update");
		// update slider values array (weights)
        // TODO kan beter met d3 node() functie

		// update labels with new weights
		for (i = 0; i < $sliders.length; i++) {
            w[i] = $sliders[i].node().value;
			$labels[i].text(w[i]);
		}
		//ranking based on new weights
		bikes.updateScore(w);
		ranking.update();
        logScores();
	}
    
    function _updateSelection() {
        console.log("checkbox updated");
        for (i = 0; i < $checkboxes.length; i++) {
            ch[i] = $checkboxes[i].node().checked;
        }
        bikes.update(ch);
        ranking.render();
        ranking.update();
        logScores();
    }
    
    // public 
    //----------------------------
    // init function for thinghs that can only be done when data avialable and
    // info table drawn
    // TODO is basen ON NUMBER OF BIKES
    function init() {
        $checkboxes = [
            d3.select("#fiets_6"),
            d3.select("#fiets_7"),
            d3.select("#fiets_8"),
            d3.select("#fiets_9")
        ];
        //var bikelist = bikes.getAllData();
        var numberOfBikes = bikes.getAllData().length;
        console.log(numberOfBikes);
        for (i = 0; i < numberOfBikes; i++) {
            //$checkboxes[i] = d3.select("#" + bikelist[i].naam);
            $checkboxes[i].on("change", _updateSelection);
        }
    }
    
    function getWeights() {
		return w;
	}
    
    function getChecked() {
        return ch;
    }

	return {
		getWeights: getWeights,
        getChecked: getChecked,
        init: init
	}
})();

// Module to manage rendering of the ranking
//-----------------------------------------------------------------------------
var ranking = (function() {
	// Graphical parameters
	var h = 30; // height of the bike box
	var padding = 3; // padding between the boxes
	var canvas = d3.select("#ranking").append("svg")

	// Define module funtions
	// Render score board based on data in bikes module
	function render() {
		// Draw initial canvas to render elements in
		canvas.attr("width", "100%")
			.attr("height", (h + padding) * bikes.getData().length + 10)
			.attr("fill", "#3071A9");

		// draw bike rectangles
		var rect = canvas.selectAll("rect")
			.data(bikes.getData(),function(d) { return d.naam; });
		rect.exit().remove();
		rect.enter()
			.append("rect")
			.attr("x", 0)
			.attr("y", function(d,i) {
				return i * (h + padding)
			})
			.attr("height", h)
			.attr("width", function(d) {
				return Math.round((d.score / bikes.getMaxScore()) * 100) + "%";
			})
			.attr("opacity", 0.7);
		// draw text labels on rectangles
		var text = canvas.selectAll("text")
			.data(bikes.getData(), function(d) { return d.naam; });
		text.exit().remove();
		text.enter()
			.append("text")
			.text(function(d) {
				return d.naam;
			})
			.attr("x", 10)
			.attr("y", function(d,i) {
				return i * (h + padding) + 20;
			})
			.attr("fill", "white")
			.attr("font-size", "20px");
	}
	function _sortItems(a, b) {
		return b.score - a.score;
	};
	// Update ranking based on scores in bikes
	function update() {
		canvas.selectAll("rect").sort(_sortItems)
			.transition()
			.duration(1000)
			.attr("x", 0)
			.attr("y", function(d,i) {
				return i * (h + padding)
			})
			.attr("width", function(d) {
				return Math.round((d.score / bikes.getMaxScore()) * 100) + "%";
			});

		canvas.selectAll("text").sort(_sortItems)
			.transition()
			.duration(1000)
			.attr("x", 10)
			.attr("y", function(d,i) {
				return i * (h + padding) + 20;
			});
	}
	// Reveal public functions
	return {
		update: update,
		render: render
	};
})();

// Function to add table with raw data at the bottom
function drawTable(){

	var table = d3.select("#categories");
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
}

//-----------------------------------------------------------------------------
// read bikeData from csv file with d3
d3.csv("bikeData_citybikes.csv", function(csv) {
	bikes.addBikes(csv);
    drawInfoTable();
    interaction.init();
    ranking.render();
    drawTable();
});