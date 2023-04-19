
#' make columns
#'
#' @param labels column labels 
#'
#' @return html list 
#' @importFrom purrr map
make_cols <- function(labels){
  tags$tr(
    tags$th(),
    map(labels, ~tags$th(scope = "col", .))
  )
}


make_levels <- function(levels, edit_levels){
  levels |> 
    map(function(lvl){
      key = fromJSON(lvl)
      if(key$val != ""){
        if(edit_levels){
          name <- tags$input(value = key$val, type="text",
                             class="levelLabel", size="6", placeholder="Type")
        } else {
          name <- tags$h5(key$val,
                          class="levelLabel")
        }
        tags$div(class = "level",
          name,
          tags$div(class = 'square',
                   `data-color` = key$color,
                   `data-val` = key$val,
                   style = paste0("background-color : ",key$color)
          )
        )
      } 
      
    })
}


#' Make table from a matrix
#'
#' @param mat rectangular matrix
#' @param levels string of the levels as a JSON 
#'
#' @return html list of the table 
#' @importFrom jsonlite fromJSON
#' @importFrom purrr map keep
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
          decode = keep(levels, ~.$val == cell)
          if(length(decode) == 0){
            stop(pate0("'", cell, "' found in table, but not in the given levels"))
          } else {
            decode = decode[[1]]
          }
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





#' assayInput
#'
#' @param id shiny id of the assay output
#' @param table matrix of the table, by default an empty 96 well plate or a json
#'   string of a matrix
#' @param levels string of the levels to add in a JSON format by default it is
#'   empty
#' @param edit_levels If set to `FALSE` level names will not be editable and new
#'   levels cannot be added. By default it will be `TRUE` so level names are
#'   editable and new levels can be added
#'
#' @export
#' @importFrom htmltools htmlDependency
#' @importFrom purrr map
assayInput <- function(id, table = matrix(nrow = 8, ncol = 12), 
                       levels = NULL, edit_levels = TRUE){
  
  if(is.character(table)) {
    table <- table |> 
      fromJSON() 
  }
  
  html_table <- make_table_from_matrix(table, levels)
  
  if(!is.null(levels)){
    levels <- make_levels(levels, edit_levels)
  }
  
  
  if(edit_levels){
    levels_html <- tags$div(class = "levels",
                            levels,
                            tags$div(class = "maker-button",
                                     br(),
                                     tags$div(class ="create-square", "Add New"))
    )
  } else {
    levels_html <- tags$div(class = "levels",
                            levels)
  }
  
  
  
  
  html <- tags$div(id= id,
                   class= "assayInput",
                   levels_html,
                   html_table
  )
  
  
  
  
  dep1 <- htmlDependency(
    name = "assayInput",
    version = "0.1.0",
    src = c(file =  system.file("libs/assay", package = "plateMapper")),
    script = c("assay.js", "binding.js"),
    stylesheet = "assay.css"
  )
  
  dep2 <- htmlDependency(
    name = "jqueryui",
    version = "1.13.2",
    src = c(file = system.file("libs/jqueryui", package = "plateMapper")),
    script = "jquery-ui.min.js"
  )
  
  
  return(list(html, dep1, dep2))
  
}
