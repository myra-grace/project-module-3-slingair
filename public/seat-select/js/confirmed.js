//render client data in here
// perhaps create endpoint to store data then fetch OR grab from previous page
console.log("i'm in the confirmation page");

let flightNumber = document.getElementById('flight');
let yourSeat = document.getElementById('seat');
let name = document.getElementById('name');
let yourEmail = document.getElementById('email');


let urlData = (window.location.search)
console.log('urlData: ', urlData);

let urlParams = new URLSearchParams(urlData);
let givenName = urlParams.get('givenName');
let surname = urlParams.get('surname');
let email = urlParams.get('email');
let flight = urlParams.get('flight');
let seat = urlParams.get('seat');
console.log('givenName: ', givenName, 'surname: ', surname, 'email: ', email, 'flight: ', flight, 'seat: ', seat);

flightNumber.innerText = flight;
yourSeat.innerText = seat;
name.innerText = givenName + ' ' + surname;
yourEmail.innerText = email;


// fetch(`/seat-select/confirmed/${givenName}/${surname}/${email}/${flight}/${seat}`)
//         .then(data => {
//             return data.json()
//         })
//         .then(data => {
//             console.log(data)
//             return data
//         })