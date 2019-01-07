let modal = document.getElementById('explanation');
console.log(modal)
let explainBut = document.getElementById("modalButton");
console.log(explainBut)
let span = document.getElementsByClassName("close")[0];

// When the user clicks on the button, open the modal 
explainBut.onclick = function() {
    console.log("done")
  modal.style.display = "flex";
}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}