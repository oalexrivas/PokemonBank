let data = [];
//#region Crea la data por defecto.
if (obtenerData("credenciales").length <= 0)
    window.location.href = "login.html";
if (obtenerData("data").length <= 0) {
    data = [{
        fecha: new Date().toLocaleString(),
        transaccion: "Despósito",
        monto: 500.00
    }];

    guardarData("data", data);
} else {
    data = obtenerData("data");
}
//#endregion

let credenciales = obtenerData("credenciales");

$(document).ready(function () {
    cargarPerfil(credenciales);

    let div = $("#grafico");

    let lookup = {};
    let labels = [];
    let montos = [];
    let montosIndividuales = [];

    for (let item, i = 0; item = data[i++];) {
        let tran = item.transaccion;

        if (!(tran in lookup)) {
            lookup[tran] = 1;
            labels.push(tran);
            montos.push({
                tran: tran,
                total: Math.abs(item.monto)
            });
        } else {
            montos.find((x) => x.tran === tran).total += Math.abs(item.monto);
        }
    }

    montos.forEach(e => {
        montosIndividuales.push(e.total);
    })

    if (div.length) {
        var grafico = new Chart(div, {
            type: 'pie',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Transacciones',
                    data: montosIndividuales,
                    backgroundColor: [
                        'rgb(255, 99, 132)',
                        'rgb(54, 162, 235)',
                        'rgb(214, 22, 135)',
                        'rgb(176, 127, 123)',
                        'rgb(254, 168, 165)',
                        'rgb(255, 205, 86)'
                    ],
                    hoverOffset: 4
                }]
            },
            options: {
                maintainAspectRatio: false
            }
        });
    }

    //#region Se crea el detalle de transacciones
    let tabla = $("#divTransacciones");
    if (tabla.length) {
        let detalleTransacciones = "";
        let saldo = 0
        data.forEach(e => {
            detalleTransacciones += `<tr><td>${e.fecha}</td><td>${e.transaccion}</td><td>$${parseFloat(e.monto).toFixed(2)}</td><tr>`;
            saldo += parseFloat(e.monto);
        });
        $("#divTransacciones tr:last").after(detalleTransacciones);
        $("#divTransacciones tr:last").after(`<tr class="bg-dark"><th></th><th style="text-align: right;">Total</th><th>$${parseFloat(saldo).toFixed(2)}</th></tr>`);
    }
    //#endregion
});

let validator = new FormValidator("frmTransaccion", [{
    name: 'txtMonto',
    display: 'monto',
    rules: 'required|decimal'
}], function (errors, evt) {
    let mensaje = '';
    evt.preventDefault();
    if (errors.length > 0) {
        for (var i = 0, errorLength = errors.length; i < errorLength; i++) {
            mensaje += errors[i].message;
        }
        swal({
            title: mensaje,
            icon: "error"
        }).then((value) => {
            $("#txtMonto").focus();
            $("#txtMonto").select();
        });
    } else {
        data = obtenerData("data");
        let mov = [];
        let saldoPermiteTran = obtenerSaldo(data) >= parseFloat(parseFloat($("#txtMonto").val()).toFixed(2));
        switch ($("#idTran").val()) {
            case "depositos":
                saldoPermiteTran = true;
                mov = {
                    fecha: new Date().toLocaleString(),
                    transaccion: "Despósito",
                    monto: parseFloat(parseFloat($("#txtMonto").val()).toFixed(2))
                };
                break;
            case "retiros":
                if (!saldoPermiteTran) {
                    swal({
                        title: "Saldo insuficiente para realizar esta transacción!",
                        icon: "warning"
                    });
                } else {
                    mov = {
                        fecha: new Date().toLocaleString(),
                        transaccion: "Retiro",
                        monto: parseFloat(parseFloat($("#txtMonto").val()).toFixed(2)) * -1
                    };
                }
                break;
            case "pagos":
                if (!saldoPermiteTran) {
                    swal({
                        title: "Saldo insuficiente para realizar esta transacción!",
                        icon: "warning"
                    });
                } else {
                    let transaccion = obtenerTipoPago();

                    mov = {
                        fecha: new Date().toLocaleString(),
                        transaccion: transaccion,
                        monto: parseFloat(parseFloat($("#txtMonto").val()).toFixed(2)) * -1
                    };
                }
                break;
        }

        if (saldoPermiteTran) {
            data.push(mov);
            guardarData("data", data);
            $("#compFecha").html(mov.fecha);
            $("#compTran").html(mov.transaccion);
            $("#compMonto").html(parseFloat(mov.monto).toFixed(2));

            swal({
                title: "Transacción completada exitosamente!",
                icon: "success",
                buttons: {
                    ok: "Aceptar",
                    comprobante: {
                        text: "Generar Comprobante"
                    }
                }
            }).then((value) => {
                switch (value) {
                    case "comprobante":
                        generarComprobante();
                        break;
                }

                window.location.href = "home.html";
            });
        }
    }
});


/**
 * Método para cargar información del perfil del usuario en pantalla.
 * @param {JSON} data 
 */
let cargarPerfil = function (data) {
    if (data) {
        $("#lbNombre").html(data.nombre);
        $("#lbCuenta").html(data.cuenta);
    }
};

let obtenerSaldo = function (d) {
    let saldo = 0;
    d.forEach(e => {
        saldo += parseFloat(e.monto);
    });

    return saldo;
};

let obtenerTipoPago = function () {
    let radios = $("[name='pagoServicios']");
    let transaccion = "";
    for (var i = 0, length = radios.length; i < length; i++) {
        if (radios[i].checked) {
            transaccion = $(`label.${radios[i].id}`)[0].title;
            break;
        }
    }

    return transaccion;
};

$("#btnSaldo").bind("click", function (event) {
    let saldo = 0
    data.forEach(e => {
        saldo += parseFloat(e.monto);
    });

    swal({
        title: `Su saldo es: $${parseFloat(saldo).toFixed(2)}`,
        icon: "info",
        button: "Aceptar"
    });
});