window.onload = () => {

    fetch("/getChartData")
        .then(response => response.json())
        .then(data => console.log(data))

}
