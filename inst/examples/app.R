
library(shiny)
library(plater)

ui <- fluidPage(
  tabsetPanel(type = "tabs",
              tabPanel("Layer 1",  assayInput("assay1",  n_rows = 8, n_cols = 12),
                       verbatimTextOutput("debug1")),
              tabPanel("layer 2",  assayInput("assay2"),
                       verbatimTextOutput("debug2")),
              tabPanel("Layer 3",  assayInput("assay3"),
                       verbatimTextOutput("debug3"))
  )
  # assayInput("assay1"),

)

server <- function(input, output, session) {
  # TODO input$assay1
  output$debug1 <- renderPrint(input$assay1)
  output$debug2 <- renderPrint(input$assay2)
  output$debug3 <- renderPrint(input$assay3)
}

shinyApp(ui, server)
# OSUICode::run_example(
#  "input-system/dummy-app",
#   package = "OSUICode"
# )
