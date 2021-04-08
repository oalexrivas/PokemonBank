var validator = new FormValidator("frmLogin", [{
    name: 'txtPin',
    rules: 'required',
    message: 'Debe ingresar su PIN'
}], function(errors, evt) {
    let mensaje = '';
    if (errors.length > 0) {
        for (var i = 0, errorLength = errors.length; i < errorLength; i++) {
            mensaje += errors[i].message;
        }
        swal("PIN Incorrecto", mensaje, "error");
    } else {
        evt.preventDefault();
        window.location.href = "home.html";
    }
});