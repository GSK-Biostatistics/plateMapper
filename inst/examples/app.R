
library(shiny)
library(jsonlite)
library(purrr)
library(tidyverse)
# library(plateMapper)

ui <- fluidPage(
  tabsetPanel(type = "tabs",
              tabPanel("Layer 1",  assayInput("assay1",  
                                              table = "[[null,null,null,null,null,null,null,null,null,null,null,null],
                                                             [\"test1\",null,null,null,null,null,null,null,null,null,null,null],
                                                             [null,null,null,null,null,null,null,null,null,null,null,null],
                                                             [null,null,null,null,null,null,null,null,null,null,null,null],
                                                             [null,\"test2\",null,null,null,null,null,null,null,null,null,null],
                                                             [null,null,null,null,null,null,null,null,null,null,null,null],
                                                             [null,null,null,null,null,null,null,null,null,null,null,null],
                                                             [null,null,null,null,null,null,null,null,null,null,null,null]]",
                                              levels = list( "{\"color\":\"DarkRed\",\"val\":\"test1\"}",
                                                             "{\"color\":\"SeaGreen\",\"val\":\"test2\"}",
                                                             "{\"color\":\"Darkorange\",\"val\":\"\"}")
              ),
              verbatimTextOutput("debug1"),
              actionButton("test", "save")),
              tabPanel("layer 2",  assayInput("assay2"),
                       verbatimTextOutput("debug2")),
              tabPanel("Layer 3",  assayInput("assay3"),
                       verbatimTextOutput("debug3"))
              # assayInput("assay1"),
  )
)


server <- function(input, output, session) {
  output$debug1 <- renderPrint({
    input$assay1
  })
  observeEvent(input$test, {
    browser()
    input$assay1$table 
  })
  output$debug2 <- renderPrint(input$assay2)
  output$debug3 <- renderPrint(input$assay3)
}

shinyApp(ui, server)
# OSUICode::run_example(
#  "input-system/dummy-app",
#   package = "OSUICode"
# )
