
var fileNames = ["test1.txt", "test2.txt"];
var path = "/data/";

plotModule.create();

formModule.updateYVars();

// Add events
events.on("update", function() {
  dataModule.update();
});
events.on("update", function() {
  console.log("Plot up to date!");
});
