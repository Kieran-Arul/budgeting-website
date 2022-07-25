window.onload = () => {

    fetch("/getChartData")
        .then(response => response.json())
        .then(data => {

            anychart.onDocumentReady(function() {

                anychart.theme(anychart.themes.darkEarth);

                // set the data
                var data = {
                  header: ["Category", "Total"],
                  rows: [
                    ["Groceries", ],
                    ["Rent", ],
                    ["Travel", ],
                    ["Entertainment", ],
                    ["Bills", ],
                    ["Shopping", ],
                    ["Eating Out", ],
                    ["Cash", ],
                    ["Payments", ],
                    ["Direct Debits", ],
                    ["Other", ]
                ]};

                // create the chart
               var chart = anychart.bar();

                // add data
                chart.data(data);

                // set the chart title
                chart.title("The deadliest earthquakes in the XXth century");

              // draw
              chart.container("container");
              chart.draw();
            });

            // data variable above is in an array and is what we need to process --> it will looks something like:
            // [{item: x, cost: y, category: z...}, {item: x, cost: y, category: z...}]
            // Our end goal is to process the data and create an array like [a, b, c, d], where a, b, c, d represent
            // the total expenditure of each category respectively

        })
        .catch(err => console.log(err));

}
