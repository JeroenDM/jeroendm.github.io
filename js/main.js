
var fileNames = ["test1.txt", "test2.txt"];
var path = "/data/";

var dataModule = (function() {
  // initialize data acces

  d3.tsv(path + fileNames[0], plotModule.update);

  function updatePlot() {
      var name = document.getElementById("fileSelection").value;
      d3.tsv(path + name, plotModule.update);
  }

  return {
    update: updatePlot
  }
})();

var formModule = (function() {

  // Init file selection menu
  var $select = d3.select("#fileSelection");
  for (i=0; i < fileNames.length; i++) {
    $select.append("option")
            .attr("value", fileNames[i])
            .text(fileNames[i]);
  }

  var header = ["koppel", "stroom"];
  var labels = ["Torque", "Current"];
  var $div = d3.select("#yVarSelection");

  // some realy ugly dom handling
  function updateYVars() {
    for (i=0; i<labels.length; i++) {
      var $label = $div.append("div")
                    .attr("class", "radio")
                    .append("label")
      $label.append("input")
            .attr("type", "radio")
            .attr("name", "yVarSelection")
            .attr("value", header[i])
      $label.append("p").text(labels[i]);
    }

  }

  return {
    updateYVars: updateYVars
  }
})();

formModule.updateYVars();

// Add events
events.on("update", function() {
  dataModule.update();
});
events.on("update", function() {
  console.log("Plot up to date!");
});
