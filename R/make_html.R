
make_cols <- function(labels){
  tags$tr(
    tags$th(),
    purrr::map(labels, ~tags$th(scope = "col", .))
  )
}

make_level <- function(color, value){
  tags$div(
    tags$input(value, type="text", 
               class="levelLabel", size="6", placeholder="Type"),
    tags$div(class = 'square', `data-color` =  color, 
             style = paste0("background-color : ",color)
    )
  )
}

make_table <- function(n_rows = 8, n_cols = 12){
  tags$table(class = "assay-table",
    make_cols(seq(1, n_cols)),
    purrr::map(LETTERS[1:n_rows], ~make_row(lab=.))
  )
}

make_table_from_matrix <- function(mat, levels){
  if(!is.matrix(mat)){
    stop("Input data not rectangular")
  }
  
  if(!is.null(levels)){
    levels <- map(levels, function(lvl){
      key = fromJSON(lvl)
      list(color = key$color, val =key$val) 
    })
    
  }
  
  
  tbl_dim <- dim(mat)
  
  rows <- list()
  for(row in 1:tbl_dim[1]){
    rows[[row]] <- tags$tr(
      tags$th(LETTERS[row], scope = "row"), 
      map(mat[row,], function(cell){
        if(is.na(cell)){
          tags$td(class = "cell")
        } else {
          decode = keep(levels, ~.$val == cell)[[1]]
          tags$td(class = "cell",
                  tags$div(class = "sortableSquare",
                           `data-color` =  decode$color, `data-tooltip` = cell,
                           `data-val` = cell,
                           style = paste0("background-color : ",decode$color)
                  )
          )
        }
      })
    )
  }
  tags$table(class = "assay-table",
             make_cols(seq(1, tbl_dim[2])),
             rows
  )
}


assayInput <- function(id, table = matrix(nrow = 8, ncol = 12), levels = NULL){
  
  if(is.character(table)) {
    table <- table |> 
      fromJSON() 
  }
  
  html_table <- make_table_from_matrix(table, levels)
  
   if(!is.null(levels)){
     levels <- levels |> 
       map(function(lvl){
         key = fromJSON(lvl)
         tags$div(
           tags$input(value = key$val, type="text",
                      class="levelLabel", size="6", placeholder="Type"),
           tags$div(class = 'square',
                    `data-color` = key$color,
                    style = paste0("background-color : ",key$color)
           )
         )
         })
   }
   
 
  
  html <- tags$div(id= id,
                   class= "assayInput",
           tags$div(class = "levels",
                    levels,
                    tags$div(class = "maker-button",
                             br(),
                             tags$div(class ="create-square", "Add New"))
  ),
  html_table,
   tags$script("
               $( '.square' ).draggable({
    helper: 'clone',
    stop: function(){
      // Make it properly draggable again
      $(this).draggable();
  }
  })
  
    $('.sortableSquare').draggable({
        stop: function(){
          // Make it properly draggable again
          $(this).draggable().css('left', 0).css('top', 0);
      }
     })
               ")
  )
  
 


  dep1 <- htmltools::htmlDependency(
    name = "assayInput",
    version = "0.1.0",
    src = c(file =  system.file("libs/assay", package = "plateMapper")),
    script = c("assay.js", "binding.js"),
    stylesheet = "assay.css"
  )

  dep2 <- htmltools::htmlDependency(
    name = "jqueryui",
    version = "1.13.2",
    src = c(file = system.file("libs/jqueryui", package = "plateMapper")),
    script = "jquery-ui.min.js"
  )

  return(list(html, dep1, dep2))

}
