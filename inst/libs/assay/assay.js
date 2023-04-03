
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

      let $item = $(this).html($(ui.draggable).clone()); //getting the cloned item
      let $inside = $item.find('.square')
      
      // Removing the connection to the original cell
      $inside.removeClass('square')
      // Converts from a square to a sortable square
      $inside.addClass('sortableSquare')
      // Adds changes back to dragged element
      $item.append($inside)
      $item.attr("data-tooltip", $(ui.draggable).attr("data-val"))
      // Adds draggable element to the cell
      $(this).append($item);
      
       // Correct the sortable Square css
       $(".sortableSquare").draggable({
        stop: function(){
          // Make it properly draggable again
          $(this).draggable().css('left', 0).css('top', 0);
      }
     })

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
        // Remove any exsisting squares 
        let oldSquare = $(cell).find(".sortableSquare")
        oldSquare.remove()
        let newSquare = clickedSquare.clone()
        newSquare.removeClass("square")
        newSquare.addClass("sortableSquare")
        newSquare.attr("data-tooltip", clickedSquare.attr("data-val"))
        $(cell).append(newSquare)
      })
      // Correct the sortable Square css
      $(".sortableSquare").draggable({
        stop: function () {
          // Make it properly draggable again
          $(this).draggable().css('left', 0).css('top', 0);
        }
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




