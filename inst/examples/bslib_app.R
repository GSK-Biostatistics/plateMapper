


ui <- ui <- page_sidebar(
  title = "My dashboard",
  sidebar = "Sidebar",
  card(
    # max_height = 600,
    card_header(
      class = "bg-dark",
      "A header"
    ),
    card_body(
      assayInput("assay1")
    )
  )
)





server <- function(input, output, session) {
  output$debug1 <- renderPrint(input$assay1)
}

shinyApp(ui, server)