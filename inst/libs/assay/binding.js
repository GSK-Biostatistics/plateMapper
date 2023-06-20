let assayInput = new Shiny.InputBinding();

$.extend(assayInput, {
  find: function(scope) {
    return $(scope).find(".assayInput");
  },
  initialize: function(el){
      let colors =['DarkRed',"Darkorange",'gold','SeaGreen','dodgerblue',"RebeccaPurple", "#AD85D6", "#70b8ff", "#75d19d", "#ffe75c", "#ffb65c", "#ff7070"];
  $(el).find(".square").draggable({
    helper: 'clone',
    stop: function(){
      // Make it properly draggable again
      $(this).draggable();
  }
  })
  
  // Make table selectable
  $(el).find(".assay-table").selectable({
    filter: 'tbody .cell'
  });


  $(el).find( ".cell" ).droppable({
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
  })
  
    $(el).find(".cell").on('click', ".cell", function(el) {
     $(el.target).removeClass("ui-selected")
     //console.log("Hit target")
  })


  $(el).find('.levels').on('click', '.square', function (el) {
    
    let parentAssay = $(this).parent().parent().parent().parent()
    let loc = $(parentAssay).find(".ui-selected")
    let clickedSquare = $(this)

    if(loc.length > 0){
      loc.get().map(function(cell){
        addSquare($(cell), clickedSquare)
      })
    } 
    // Unselect cells
    loc.removeClass("ui-selected")
    
  });
// Div dies outside table
//This basically works, but if you bring the div out and then back in, it has issues
  $(el).find("table").droppable({
  out: function( event, ui ) {
    let self = ui;
    if(ui.draggable.hasClass("sortableSquare")){
      ui.helper.off('mouseup').on('mouseup', function () {
      $(this).remove();
      self.draggable.remove();
    });
    }
    
  }

})


  $(el).find(".create-square").click(function(foo){
  let currLevels = $(foo.currentTarget).parent().parent()
  let colorIndex = $(currLevels).find('.square').length
  let fillColor = colors[colorIndex]


  $('<div>').append('<input type="text" class="levelLabel" size="6" placeholder="Type">').append( $('<div>', {
    'class': 'square',
    'data-color' : fillColor,
}).draggable().css("background-color",fillColor)).insertBefore($(foo.currentTarget).parent());



  $( ".square" ).draggable({
    helper: 'clone',
    stop: function(){
      // Make it properly draggable again
      $(this).draggable();
  }
  });
  
  updateLabels()

});
    
  },
  getValue: function(el) {
    // Get the color values in the table 
    let table =  $(el).find(".assay-table"); 
    let output = new Object()
    let tableArray = $(table).find("tr").get().map(function(row) {
    return $(row).find('td').get().map(function(cell) {
       return $(cell).find('.sortableSquare').attr('data-val');
      })
    })
    tableArray.shift()
    
    output.table = JSON.stringify(tableArray)
    
    // Get the label color combos 
    let lvl = $(el).find(".levels").children().get()
    lvl.pop()
    let lvlKey = lvl.map(function(x){
      let cell = new Object()
      cell.color = $(x).find(".square").get().map(x => $(x).attr("data-color"))[0]
      cell.val = $(x).find(".levelLabel").get().map(x => x.value)[0]
    return cell
    })
    output.lvlKey = lvlKey.map(x => JSON.stringify(x))
    
  return output 
  },

  setValue: function(el, value) {
    $(el).mousedown()
  },

  receiveMessage: function(el, value){
    this.setValue(el, value);
  },

  subscribe: function (el, callback) {
    // When the level labels change 
    $(el).on("change.levelLabel", function(){
      callback(true);
    });
    
  // Callback for when the table changes 
    // select the target node [0] needed to convert to a node
  let target = $(el).find('table')[ 0 ];
  let oldTable = target.innerHTML
  // create an observer instance
    var observer = new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
        if(oldTable !== mutation.target.innerHTML){
          oldTable = mutation.target.innerHTML;
          callback(true);
        }

        });
      });

    // configuration of the observer:
  var config = { attributes: true, childList: true, subtree: true}

  // pass in the target node, as well as the observer options
  observer.observe(target, config);
  },
  unsubscribe: function(el) {
    $(el).off(".assayInput");

  }
});

Shiny.inputBindings.register(assayInput, "plater.assayInput");
