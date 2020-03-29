var names = ["Home", "Portfolio", "Research"]
var links = ["index.html", "portfolio.html", "research.html"]

var $navbar = document.getElementById("navbar")
var $lu = document.createElement("lu")

for (var i = 0; i < names.length; i++) {
    var $li = document.createElement("li");
    var $a = document.createElement("a");
    $a.setAttribute("href", links[i]);
    $a.innerHTML = names[i];
    $li.appendChild($a);
    $lu.appendChild($li);
}
$navbar.appendChild($lu);