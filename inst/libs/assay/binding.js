let assayInput = new Shiny.InputBinding();

$.extend(assayInput, {
  find: function(scope) {
    return $(scope).find(".assayInput");
  },
  getValue: function(el) {
    // Get the color values in the table 
    let table =  $(el).find("table"); 
    let output = new Object()
    let tableArray = $(table).find("tr").get().map(function(row) {
    return $(row).find('td').get().map(function(cell) {
       return $(cell).find('.sortableSquare').attr('data-color');
      })
    })
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
  var config = { attributes: true}

  // pass in the target node, as well as the observer options
  observer.observe(target, config);
  },
  unsubscribe: function(el) {
    $(el).off(".assayInput");

  }
});

Shiny.inputBindings.register(assayInput, "plater.assayInput");
