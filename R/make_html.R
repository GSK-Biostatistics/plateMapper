
make_cell <- function(){
  tags$td(class = "cell")
}
make_row <- function(lab, n_cols = 12){
  tags$tr(
    tags$th(lab, scope = "row"),
    purrr::map(seq(1, n_cols), ~tags$td(class = "cell"))
  )
}

make_cols <- function(labels){
  tags$tr(
    tags$td(),
    purrr::map(labels, ~tags$th(scope = "col", .))
  )
}

make_table <- function(n_rows = 8, n_cols = 12){
  tags$table(class = "assay-table",
    make_cols(seq(1, n_cols)),
    purrr::map(LETTERS[1:n_rows], ~make_row(lab=.))
  )
}


assayInput <- function(id, levels, n_rows = 8, n_cols = 12){
  html <- tags$div(id= id,
                   class= "assayInput",
           tags$div(class = "levels",
                    tags$div(class = "maker-button",
                             br(),
                             tags$div(class="create-square", "Add New"))
  ),
  make_table(n_rows = n_rows, n_cols = n_cols)
  )


  dep1 <- htmltools::htmlDependency(
    name = "assayInput",
    version = "0.1.0",
    src = c(file =  system.file("libs/assay", package = "plater")),
    script = c("assay.js", "binding.js"),
    stylesheet = "assay.css"
  )

  dep2 <- htmltools::htmlDependency(
    name = "jqueryui",
    version = "1.13.2",
    src = c(file = system.file("libs/jqueryui", package = "plater")),
    script = "jquery-ui.min.js"
  )

  return(list(html, dep1, dep2))

}
