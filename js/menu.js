
var fileNames = ["test1.txt", "test2.txt"];
var path = "/data/";

d3.tsv(path + fileNames[0], plotModule.update);
