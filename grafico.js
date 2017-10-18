var ctx = $("#myChart");

var ctx = document.getElementById("myChart");

var myChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho"],
        datasets: [{
            label: 'População',
            data: [100, 80, 90, 70, 50, 20],
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderColor: 'rgba(255,99,132,1)',
        }]
    },
    options: {
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero:true
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