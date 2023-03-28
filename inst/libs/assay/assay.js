
$( function() {
  let colors =['DarkRed','SeaGreen',"Darkorange",'dodgerblue','gold'];

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

       let $item = $(this).html($(ui.draggable).clone()); //getting the cloned item
       let $inside = $item.find('.square')
       // Removing the connection to the original cell
       $inside.removeClass('square')
       // Converts from a square to a sortable square
       $inside.addClass('sortableSquare')
       // Adds changes back to dragged element
       $item.append($inside)
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

// Div dies outside table
//This basically works, but if you bring the div out and then back in, it has issues
$("table").droppable({
  out: function( event, ui ) {
    let self = ui;
            ui.helper.off('mouseup').on('mouseup', function () {
                $(this).remove();
                self.draggable.remove();
            });
            console.log(self)
  }

})


$(".create-square").click(function(el){
  let currLevels = $(el.currentTarget).parent().parent()
  let colorIndex = $(currLevels).find('.square').length
  let fillColor = colors[colorIndex]


  $('<div>').append('<input type="text" class="levelLabel" size="6" placeholder="Type">').append( $('<div>', {
    'class': 'square',
    'data-color' : fillColor
}).draggable().css("background-color",fillColor)).insertBefore($(el.currentTarget).parent());



$( ".square" ).draggable({
  helper: 'clone',
  stop: function(){
    // Make it properly draggable again
    $(this).draggable();
}
})

});


});




