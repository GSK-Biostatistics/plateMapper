
$( function() {
  let colors =['DarkRed','SeaGreen',"Darkorange",'dodgerblue','gold'];
  
  // Functions that get reused 
  function updateLabels(){
    $(".levelLabel").on('input', function(){
     let parentAssay = $(this).parent().parent().parent();
     let level = $(this).parent().find('.square');
     let dataColor = $(level).attr("data-color");
     let dataVal = $(this).get().map(x => x.value);
     level.attr("data-val", dataVal);
     
     $(parentAssay).find('.sortableSquare').filter(`[data-color ='${dataColor}']`).attr("data-tooltip", dataVal).attr("data-val", dataVal)
  })
  }
  
  function addSquare(cellToAdd, clickedSquare){
    // Remove any exsisting squares 
    let oldSquare = $(cellToAdd).find(".sortableSquare")
    oldSquare.remove()
    // Add new square
    let newSquare = clickedSquare.clone()
    newSquare.removeClass("square")
    newSquare.addClass("sortableSquare")
    newSquare.attr("data-tooltip", clickedSquare.attr("data-val"))
    $(cellToAdd).append(newSquare)
        
    // Correct the sortable Square css
    $(".sortableSquare").draggable({
        stop: function () {
          // Make it properly draggable again
          $(this).draggable().css('left', 0).css('top', 0);
        }
    })
  }
  
  // Calling all function at setup so any uploaded bits work
  updateLabels();

  $( ".square" ).draggable({
    helper: 'clone',
    stop: function(){
      // Make it properly draggable again
      $(this).draggable();
  }
  })
  
  // Make table selectable
  $(".assay-table").selectable({
    filter: 'tbody .cell'
  });


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
    
    let parentAssay = $(this).parent().parent().parent()
    let loc = $(parentAssay).find(".ui-selected")
    let clickedSquare = $(this)

    if(loc.length > 0){
      loc.get().map(function(cell){
        addSquare($(cell), clickedSquare)
      })
    } else {
      console.log("nothing to click")
    }
    // Unselect cells
    loc.removeClass("ui-selected")
    
  });
// Div dies outside table
//This basically works, but if you bring the div out and then back in, it has issues
  $("table").droppable({
  out: function( event, ui ) {
    let self = ui;
    ui.helper.off('mouseup').on('mouseup', function () {
      $(this).remove();
      self.draggable.remove();
    });
  }

})


  $(".create-square").click(function(el){
  let currLevels = $(el.currentTarget).parent().parent()
  let colorIndex = $(currLevels).find('.square').length
  let fillColor = colors[colorIndex]


  $('<div>').append('<input type="text" class="levelLabel" size="6" placeholder="Type">').append( $('<div>', {
    'class': 'square',
    'data-color' : fillColor,
}).draggable().css("background-color",fillColor)).insertBefore($(el.currentTarget).parent());



  $( ".square" ).draggable({
    helper: 'clone',
    stop: function(){
      // Make it properly draggable again
      $(this).draggable();
  }
  });
  
  updateLabels()

});

  

});




