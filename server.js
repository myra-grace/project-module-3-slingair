'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const rp = require('request-promise');
let flights = ''

const PORT = process.env.PORT || 8000;

//--------------- GRABING FROM SCOTT'S DB ---------------
function availableFlights() {
    let options = {
        uri: 'https://journeyedu.herokuapp.com/slingair/flights',
        headers: {
            'User-Agent': 'Request-Promise',
        },
        json: true
    };
    rp(options)
        .then(result => {
            console.log('result: ', result);
            console.log('xxxxxxxxxxx: ', result.flights);
            flights = result.flights
        })
};

async function flightSeating(flightNumber) {
    let flight = flightNumber;
    let selection = {
        uri: `https://journeyedu.herokuapp.com/slingair/flights/${flight}`,
        headers: {
            'User-Agent': 'Request-Promise',
        },
        json: true
    };
    let seats = await rp(selection);
    console.log('flightSeating result: ', seats);
    return seats
}

const scottsFlightsHandler = (req, res) => {
    res.send(flights);
}
//--------------------------------------------------------


// -------------HANDLERS------------
const flightHandler = async (req, res) => {
    let flightNumber = req.params.flightNumber;

    let seats = await flightSeating(flightNumber);
    console.log('seats: ', seats);
    res.send({ flightSeats: seats[flightNumber] });

    // let flightID = flights.find(flight => flight === flightNumber)
    //     console.log('xxxxxxx flightID xxxxxxx: ', flightID);

    //     if (flightID == undefined) {
    //         console.log("----------- There is no such flight -----------");
    //         res.send({status: 'No such flight'});
    //     } else {
    //         console.log("----------- Present! -----------");
    //         const flightSeats = flights[flightID]
    //         console.log('flightSeats : ', flightSeats );
    //         res.send({flightSeats: flightSeats});
    //     }
}

const seatHandler = (req, res) => {
    let givenName = req.params.givenName
    let surname = req.params.surname
    let email = req.params.email
    let flight = req.params.flight
    let seat = req.params.seat
    console.log('flight: ', flight, 'seat: ', seat, 'given name: ', givenName, 'surname: ', surname, 'email: ', email);

    res.send({givenName, surname, email, flight, seat})
}
//----------------------------------------------------------------------------


express()
    .use(function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        next();
    })
	.use(morgan('dev'))
	.use(express.static('public'))
    .use(bodyParser.json())
    .use(express.urlencoded({extended: false}))
    
    // endpoints
    .get('/seat-select/:givenName/:surname/:email/:flight/:seat', seatHandler)
    .get('/flight/:flightNumber', flightHandler)
    // .get('/confirmed') should display a confirmation message to the user with the info that they entered on the previous screen.
    .get('/flights', scottsFlightsHandler)

    .use((req, res) => res.send('Not Found'))
    .listen(PORT, () => console.log(`Listening on port ${PORT}`));

    availableFlights();
