window.onload = () => {

    fetch("/getChartData")
        .then(response => response.json())
        .then(data => {

            // CHART CODE GOES HERE
            // data variable above is in an array and is what we need to process --> it will looks something like:
            // [{item: x, cost: y, category: z...}, {item: x, cost: y, category: z...}]
            // Our end goal is to process the data and create an array like [a, b, c, d], where a, b, c, d represent
            // the total expenditure of each category respectively

        })
        .catch(err => console.log(err));

}
