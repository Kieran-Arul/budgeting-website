function plotPieChart(xLabels, dataArr) {

    // CHART JS SET-UP BLOCK
    const setupBlock = {
        labels: xLabels,
        datasets: [{

            label: "Expenditure Breakdown by Category",
            data: dataArr,
            backgroundColor: [
                "rgba(38, 65, 129, 1)",
                "rgba(62, 48, 38, 0.3)",
                "rgba(28, 137, 45, 0.4)",
                "rgba(118, 44, 149, 0.9)",
                "rgba(16, 226, 129, 0.9)",
                "rgba(30, 156, 98, 0.5)",
                "rgba(91, 7, 57, 0.4)",
                "rgba(100, 221, 221, 0.6)",
                "rgba(14, 221, 172, 0.9)",
                "rgba(143, 44, 40, 1)",
                "rgba(47, 142, 125, 0.6)",
                "rgba(159, 158, 34, 0.5)"
            ],
            borderColor: [
                "rgba(254, 62, 217, 0.3)",
                "rgba(4, 108, 31, 0.1)",
                "rgba(70, 36, 248, 0.1)",
                "rgba(199, 68, 12, 0.9)",
                "rgba(33, 46, 181, 0.5)",
                "rgba(27, 55, 14, 0.3)",
                "rgba(219, 216, 118, 0.9)",
                "rgba(9, 232, 90, 0.7)",
                "rgba(137, 4, 253, 0.4)",
                "rgba(14, 118, 18, 0.4)",
                "rgba(78, 45, 67, 0.3)",
                "rgba(208, 44, 199, 0.2)"
            ],

        }]
    };

    // CHART JS CONFIG BLOCK:
    const configBlock = {
        type: "pie",
        data: setupBlock,
        options: {

            title: {
                display: true,
                text: "Proportion of Expenditure Spent in Each Category",
                fontSize: 25
            },

            legend: {
                display: true,
                position: "bottom",
                labels: {
                    fontColor: "#000"
                }
            },

            layout: {

                padding: {
                    left: 0,
                    right: 0,
                    bottom: 0,
                    top: 0
                }

            },

        }
    };

    // CHART JS RENDER BLOCK:
    const expPieChart = new Chart(document.getElementById("expPieChart").getContext("2d"), configBlock);

}

fetch("/getChartData")

    .then(response => response.json())
    .then(data => {

        let expenditureByCategory = {

            "Groceries": 0.0,
            "Rent": 0.0,
            "Travel": 0.0,
            "Entertainment": 0.0,
            "Bills": 0.0,
            "Shopping": 0.0,
            "Eating Out": 0.0,
            "Cash": 0.0,
            "Coffee": 0.0,
            "Payments": 0.0,
            "Direct Debits": 0.0,
            "Other": 0.0

        }

        for (let i = 0; i < data.length; i++) {
            expenditureByCategory[data[i].category] += parseFloat(data[i].cost);
        }

        let pieChartLabels = Object.keys(expenditureByCategory);
        let pieChartData = Object.values(expenditureByCategory);

        plotPieChart(pieChartLabels, pieChartData)


        // anychart.onDocumentReady(function() {
        //
        //     anychart.theme(anychart.themes.darkEarth);
        //
        //     // set the data
        //     var data = {
        //       header: ["Category", "Total"],
        //       rows: [
        //         ["Groceries", ],
        //         ["Rent", ],
        //         ["Travel", ],
        //         ["Entertainment", ],
        //         ["Bills", ],
        //         ["Shopping", ],
        //         ["Eating Out", ],
        //         ["Cash", ],
        //         ["Payments", ],
        //         ["Direct Debits", ],
        //         ["Other", ]
        //     ]};
        //
        //     // create the chart
        //    var chart = anychart.bar();
        //
        //     // add data
        //     chart.data(data);
        //
        //     // set the chart title
        //     chart.title("The deadliest earthquakes in the XXth century");
        //
        //   // draw
        //   chart.container("container");
        //   chart.draw();
        // });

    })
    .catch(err => console.log(err));


