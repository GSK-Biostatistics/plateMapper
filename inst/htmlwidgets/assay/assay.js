// Functions that get reused 
// Written outside the function so it can be used by the binding 
function updateLabels(){
  $(".levelLabel").on('input', function(){
    let parentAssay = $(this).parent().parent().parent().parent();
    let level = $(this).parent().find('.square');
    let dataColor = $(level).attr("data-color");
    let dataVal = $(this).get().map(x => x.value);
    level.attr("data-val", dataVal);
    
    $(parentAssay).find('.sortableSquare').filter(`[data-color ='${dataColor}']`).attr("data-tooltip", dataVal).attr("data-val", dataVal)
  })
}

function removeSquare(cellToClear){
   // Remove any exsisting squares 
  let oldSquare = $(cellToClear).find(".sortableSquare")
  oldSquare.remove()
}

function addSquare(cellToAdd, clickedSquare){
  // Remove any exsisting squares 
  let oldSquare = removeSquare(cellToAdd)
  // Add new square
  let newSquare = clickedSquare.clone()
  newSquare.removeClass("square")
  newSquare.addClass("sortableSquare")
  newSquare.attr("data-tooltip", clickedSquare.attr("data-val"))
  $(cellToAdd).append(newSquare)
  
}



$( function() {
let colors =['DarkRed','SeaGreen',"Darkorange",'dodgerblue','gold'];
// Calling all function at setup so any uploaded bits work
updateLabels();

$( ".square" ).draggable({
  helper: 'clone',
  stop: function(){
    // Make it properly draggable again
    $(this).draggable();
}
})


$( ".cell" ).droppable({
  accept: ".square, .sortableSquare",
  // create a duplicate on drop

  drop: function(event, ui) {

  if (ui.draggable.hasClass("square")) {
      addSquare($(this), $(ui.draggable))
   }
   
   
   if (ui.draggable.hasClass("sortableSquare")) {
    // This replaces anything inside the square
    $(this).html($(ui.draggable));
   }
},
 helper: 'clone'
}),

$('.levels').on('click', '.square', function (el) {
  let parentAssay = $(this).parent().parent().parent().parent()
  let loc = $(parentAssay).find(".selected")
  let clickedSquare = $(this)
  

  if(loc.length > 0){
    loc.get().map(function(cell){
      addSquare($(cell), clickedSquare)
    })
  } 
  // Unselect cells
  loc.removeClass("selected")
  
});



});


