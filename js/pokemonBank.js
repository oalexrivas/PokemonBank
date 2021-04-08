$("#btnSaldo").bind("click", function(event) {
    swal({
        title: "Su saldo es: $50.00",
        icon: "success",
        button: "Aceptar",
      });
});


let div = $("#grafico");

if (div){
    let grafico = new Chart(div, {
        type: 'line',
        data: {
            labels: ['Depositos', 'Retiros', 'Pago de Servicios: Energía Eléctrica', 'Pago de Servicios: Internet', 'Pago de Servicios: Telefonía', 'Pago de Servicios: Agua Potable'],
            datasets: [{
                label: 'Historial de Transacciones',
                data: [300, -210, 0, -60, -80, 0],
                fill: false,
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1
            }]
        }
    });
}
