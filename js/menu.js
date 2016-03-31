
var fileNames = ["test1.txt", "test2.txt"];
var path = "/data/";

var selectionModule = (function() {
  var $select = d3.select("#fileSelection");

  for (i=0; i < fileNames.length; i++) {
    $select.append("option")
            .attr("value", fileNames[i])
            .text(fileNames[i]);
  }

})();

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
