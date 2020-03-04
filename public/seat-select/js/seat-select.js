const flightInput = document.getElementById('flight');
const seatsDiv = document.getElementById('seats-section');
const confirmButton = document.getElementById('confirm-button');
let notAflight = document.querySelector('.no-such-flight');

let selection = '';

const renderSeats = (result) => {
    console.log('Flight Seats: ', result);
    if (result.status === "No such flight") {
        notAflight.style.display = 'flex';
    } else {
        notAflight.style.display = 'none';
        document.querySelector('.form-container').style.display = 'block';

        const alpha = ['A', 'B', 'C', 'D', 'E', 'F'];
        for (let r = 1; r < 11; r++) {
            const row = document.createElement('ol');
            row.classList.add('row');
            row.classList.add('fuselage');
            seatsDiv.appendChild(row);
            for (let s = 1; s < 7; s++) {
                const seatNumber = `${r}${alpha[s-1]}`;
                const seat = document.createElement('li')
                const seatOccupied = `<li><label class="seat"><span id="${seatNumber}" class="occupied">${seatNumber}</span></label></li>`
                const seatAvailable = `<li><label class="seat"><input type="radio" name="seat" value="${seatNumber}" /><span id="${seatNumber}" class="avail">${seatNumber}</span></label></li>`        

                if (result.flightSeats[s].isAvailable == true) {
                    seat.innerHTML = seatAvailable;
                    row.appendChild(seat);
                } else {
                    seat.innerHTML = seatOccupied;
                    row.appendChild(seat);
                }
            }
        }
        
        let seatMap = document.forms['seats'].elements['seat'];
        seatMap.forEach(seat => {
            seat.onclick = () => {
                selection = seat.value;
                seatMap.forEach(x => {
                    if (x.value !== seat.value) {
                        document.getElementById(x.value).classList.remove('selected');
                    }
                })
                document.getElementById(seat.value).classList.add('selected');
                document.getElementById('seat-number').innerText = `(${selection})`;
                confirmButton.disabled = false;
            }
        });
    }
}


const toggleFormContent = (event) => {
    const flightNumber = flightInput.value;
    
    // TODO: contact the server to get the seating availability
    //      - only contact the server if the flight number is this format 'SA###'.
    //      - Do I need to create an error message if the number is not valid?
    
    // TODO: Pass the response data to renderSeats to create the appropriate seat-type.

//----------------------------------------------------------------------------------------------------------------
    if (flightNumber.length !== 5 || flightNumber[0] !== 'S' || flightNumber[1] !== 'A' ||
    isNaN(flightNumber[2]) || isNaN(flightNumber[3]) || isNaN(flightNumber[4])) {
        console.log('xxxxxxxxxxxx error xxxxxxxxxxxxx');
    } else {
        console.log("xxxxxxxxxxxx Looking for your flight xxxxxxxxxxxx");
    }
//--------------- FIGGURE OUT HOW TO PREVENT FROM CONTINUING TO SEATS PAGE INSTEAD OF CONSOLE.LOG -----------------
//-----------------------------------------------------------------------------------------------------------------

    fetch(`/flight/${flightNumber}`)
        .then(result => {
            return result.json()
        })
        .then(result => {
            renderSeats(result);
        })
}

const handleConfirmSeat = (event) => {
    event.preventDefault();
    // TODO: everything in here!
    //GET THE HANDLE TO SWITCH THE SEAT AVAILABILITY TO FALSE
    //GET HANDLE TO STORE CLIENT INFO
    let givenName = document.getElementById('givenName').value;
    let surname = document.getElementById('surname').value;
    let email = document.getElementById('email').value;
    let flight = document.getElementById('flight').value;
    let seat = selection;
    console.log('seat: ', seat);
    console.log('flight: ', flight);

    fetch(`/seat-select/${givenName}/${surname}/${email}/${flight}/${seat}`)
        .then(data => {
            return data.json()
        })
        .then(data => {
            console.log(data)
            window.location.href = `/seat-select/confirmed.html?givenName=${givenName}&surname=${surname}&email=${email}&flight=${flight}&seat=${seat}`

            return data
        })
}

//firstname input.value in index.html

flightInput.addEventListener('blur', toggleFormContent);