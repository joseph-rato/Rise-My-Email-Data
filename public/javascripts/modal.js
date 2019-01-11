let modalExplination = document.getElementById('explanation');
let modalRefresh = document.getElementById('refreshExplanation')
let modalGraph = document.getElementById('graphExplanation') 
let explainBut = document.getElementById("modalButton");
let graphBut = document.getElementById('modalButtonCharts')
let refreshBut = document.getElementById('modalButtonRefresh')

let span = document.getElementsByClassName("close")[0];
let span1 = document.getElementsByClassName("close")[1];
let span2 = document.getElementsByClassName("close")[2];

// When the user clicks on the button, open the modal 

explainBut.onclick = function() {
  modalExplination.style.display = "flex";
}
graphBut.onclick = function() {
  modalGraph.style.display = "flex";
}
refreshBut.onclick = function() {
  modalRefresh.style.display = "flex";
}
// When the user clicks on <span> (x), close the modal
span.onclick = function() {
    modalExplination.style.display = "none";
}
span1.onclick = function() {
    modalGraph.style.display = "none";
}
span2.onclick = function() {
    modalRefresh.style.display = "none";
}


// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modalRefresh || event.target == modalGraph || event.target == modalExplination) {
    modalExplination.style.display = "none";
    modalGraph.style.display = "none";
    modalRefresh.style.display = "none";
  }
}