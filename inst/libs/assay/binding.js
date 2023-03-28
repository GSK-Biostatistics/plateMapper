let assayInput = new Shiny.InputBinding();

$.extend(assayInput, {
  find: function(scope) {
    return $(scope).find(".assayInput");
  },
  getValue: function(el) {
    let table =  $(el).find("table"); 
    let tableArray = $(table).find("tr").get().map(function(row) {
    return $(row).find('td').get().map(function(cell) {
       return $(cell).find('.sortableSquare').attr('data-color');
      })
    })

   //let tableArray =  $(el).find("table").get().map(function(row) {
   //  return $(row).find('tr').get().map(function(cell) {
   //return $(cell).find('.sortableSquare').attr('data-color');
   //  });
   //})
  return JSON.stringify(tableArray)
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
