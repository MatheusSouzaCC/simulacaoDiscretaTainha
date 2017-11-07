var myChart;
iniciarGrafico();

function iniciarGrafico() {
    var ctx = $("#myChart");
     myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'População',
                data: [],
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderColor: 'rgba(255,99,132,1)',
            }]
        },
        options: {
            animation: {
                duration: 1
            },
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            },
            title: {
                display: true,
                text: 'População em relação ao tempo',
                fontSize: 16
            }
        }
    });
}

function destruirGrafico(){
    myChart.destroy();
}



function addData(chart, label, data) {
    chart.data.labels.push(label);
    chart.data.datasets.forEach((dataset) => {
        dataset.data.push(data);
    });
    chart.update();
}

function removeData(chart) {

    chart.data.labels.shift();
    chart.data.datasets.forEach((dataset) => {
        dataset.data.shift();
    });
    chart.update();
}



function atualizaGrafico(mes, qtd) {
    var date = new Date(mes + "/01/0000");
    var locale = "pt-br";
    month = date.toLocaleString(locale, { month: "short" });

    month = month.charAt(0).toUpperCase() + month.slice(1);

    addData(myChart, month, qtd);

    if (myChart.data.datasets[0].data.length > 12) {
        removeData(myChart);
    }
}


