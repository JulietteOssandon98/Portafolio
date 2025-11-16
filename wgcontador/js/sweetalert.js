function pressbutton() {
    let _nombre = $("#NombreId").val();
    let _telefono = $("#TelefonoId").val();
    let _correo = $("#CorreoId").val();
    let _asunto = $("#AsuntoId").val();
    let _mensaje = $("#MensajeId").val();

    if (_nombre != "") {
        if (_telefono != "") {
            if (_correo != "") {
                var email_filter = /^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
                if (email_filter.test(_correo)) {
                    if (_asunto != "") {
                        if (_mensaje != "") {
                            $.ajax({
                                method: 'POST',
                                url: 'https://formsubmit.co/ajax/@gmail.com',
                                dataType: 'json',
                                accepts: 'application/json',
                                data: {
                                    Asunto: _asunto,
                                    Nombre: _nombre,
                                    Correo: _correo,
                                    Telefono: _telefono,
                                    Mensaje: _mensaje
                                },
                                success: (data) => {Swal.fire('Felicidades', 'Mensaje enviado con éxito', 'succes');}, 
                                error: (err) => {Swal.fire('Error en el mensaje', 'El mensaje no fue enviado', 'error');},
                            });
                        }
                        else { Swal.fire('Atención', 'Debe ingresar un mensaje', 'error'); }

                        
                    }
                    else { Swal.fire('Atención', 'Debe ingresar un asunto', 'error'); }
                }
                else { Swal.fire('Atención', 'El formato del correo es invalido', 'error'); }
            }
            else { Swal.fire('Atención', 'Debe ingresar un correo electrónico', 'error'); }
        }

        else { Swal.fire('Atención', 'Debe ingresar un número de teléfono', 'error'); }

    }

    else { Swal.fire('Atención', 'Debe ingresar un nombre y apellido', 'error'); }
}