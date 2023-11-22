


let userSession = JSON.parse(localStorage.getItem('userSession')) || null;

if (userSession != null) {
    console.log(userSession)
    // document.querySelector("#profile_user").innerText = userSession.name;
    document.querySelector("#profileName").innerText = userSession.name;
    document.querySelector("#email").innerHTML = `<i class="fas fa-envelope"></i><span> </span>${userSession.email}`;
    document.querySelector("#numberPhone").innerHTML = `<i class="fas fa-phone"></i><span> </span>${userSession.phone_number}`;
}