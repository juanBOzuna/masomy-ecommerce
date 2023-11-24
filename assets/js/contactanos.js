import { serverUrl } from "./config";

var userSession = localStorage.getItem('userSession');

if (!userSession) {
    alert('Debe Loguearse Primero');
    window.location.href = 'login.html'
} else {

    let formContactar = document.querySelector('#form_contactar');
    formContactar.addEventListener('submit', function (event) {
        event.preventDefault();
        let subjectInput = document.querySelector('#subject').value;
        let messageInput = document.querySelector('#message').value;

        var myHeaders = new Headers();
        var tuTokenDeAcceso = JSON.parse(localStorage.getItem('accessToken')).token;
        myHeaders.append("Accept", "application/json");
        myHeaders.append("Authorization", "Bearer " + tuTokenDeAcceso);
        // fetch(`${serverUrl}/api/tickets`, {
        //     method: 'POST',
        //     headers: myHeaders,
        //     body: JSON.stringify({
        //         subject: subjectInput,
        //         message: messageInput,
        //     }),
        // })
        //     .then(response => response.json())
        //     .then(data => {
        //         if (data.success) {
        //             document.getElementById("ticket-reference-container").style.display = "block";
        //             document.getElementById("reference-ticket").innerText = data.ticket;
        //         }
        //     })
        //     .catch(error => {
        //         console.error('Error en la solicitud Fetch:', error);
        //     });


        var myHeaders = new Headers();
        myHeaders.append("Accept", "application/json");
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", "Bearer " + tuTokenDeAcceso);

        var raw = JSON.stringify({
            "subject": subjectInput,
            "message": messageInput
        });

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        fetch(`${serverUrl}/api/tickets`, requestOptions)
            .then(response => response.text())
            .then(data => {
                data = JSON.parse(data)
                console.log(data)
                if (data.success) {
                    document.getElementById("ticket-reference-container").style.display = "block";
                    document.getElementById("reference-ticket").innerText = data.ticket;

                    document.querySelector('#subject').value = '';
                     document.querySelector('#message').value = '';
                }
            })
            .catch(error => console.log('error', error));

    });

}

