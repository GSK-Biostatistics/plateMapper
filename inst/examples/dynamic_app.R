library(shiny)
library(plateMapper)
library(DT)
library(shinyjs)
library(shinydashboard)

ui <- fluidPage(
  
  tabBox(id = "tabs",
         title = actionButton("add", "Add Tab"),
         width = 12, 
         tabPanel("Plate Info",  
                  assayInput("plateSetup",  
                             levels = list( "{\"color\":\"DarkRed\",\"val\":\"Unknown1\"}",
                                            "{\"color\":\"SeaGreen\",\"val\":\"Unknown2\"}",
                                            "{\"color\":\"Darkorange\",\"val\":\"Standard 1\"}")
                  ),
                  fluidRow(
                    column(width = 4, 
                           DT::DTOutput('dilutionTbl')
                    )
                  ),
                  fluidRow(
                    column(width = 1),
                    column(width = 4, 
                           h6("Double click to edit table"))
                  )
                  
                  # Need to add in dislution factor
                  
                  
         )
  )
)


server <- function(input, output, session) {
  
  dilu_df <- reactive({
    group_val <- input$plateSetup$lvlKey |> 
      purrr::map_chr(~jsonlite::fromJSON(txt = .)$val) |> 
      stringr::str_subset("^[U|u]nk.*")
    tibble::tibble(group = group_val, di_fct = NA_integer_)
  })
  
  output$dilutionTbl <- DT::renderDT(dilu_df(), 
                                     selection = 'none', 
                                     editable = 'cell',
                                     options = list(dom = 't',
                                                    ordering = FALSE),
                                     rownames = FALSE,
                                     colnames = c('Group', 'Dilution Factor'),
                                     caption = "Dilution Table")
  
  observeEvent(input$add, {
    name <- paste0("Factor: ", input$add)
    
    appendTab(inputId = "tabs", select = TRUE,
              tabPanel(name, 
                       assayInput(paste0("assay", input$add),
                                  levels = list( "{\"color\":\"DarkRed\",\"val\":\"Unknown1\"}",
                                                 "{\"color\":\"SeaGreen\",\"val\":\"Unknown2\"}",
                                                 "{\"color\":\"Darkorange\",\"val\":\"Standard 1\"}")),
              )
    )
  })
}

shinyApp(ui, server)
