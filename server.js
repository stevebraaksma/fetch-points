// require dependencies
const express = require('express');
const app = express();
const methodOverride = require('method-override');

// listener
app.listen(3000, () => console.log(`server is listening on port 3000`));

// middleware
app.use(express.urlencoded({ extended: false }));

let userTransactions = [];
let totalPointsAdded = 0;
let totalPointsSpent = 0;

// home route
app.get('/', (req, res) => {
    res.render('home.ejs');
    // console.log('route hit');
});

// add route
app.post('/add', (req, res) => {
    res.render('add.ejs');
    let currentTransactionPayer = req.body.payer;
    let currentTransactionPoints = Math.floor(req.body.points);
    let currentTransaction = {
        payer: currentTransactionPayer,
        points: currentTransactionPoints,
    }
    userTransactions.push(currentTransaction);
    console.log(userTransactions);
    // also need to push timestamp as well
    // consider - may need to have some type of input selector
    // .. for the time stamp to be in a standard format
    // .. better yet, have a selector
    //  a) default (current) time
    //  b) 2nd radio button, select different time stamp
    // but we need to keep this simple at first
    // it may actually be simpler to have a year/day/time selector
    // and worry about default later or not at all

    totalPointsAdded = totalPointsAdded + currentTransactionPoints

    console.log(totalPointsAdded);

});


// do the spend route here


// balance route
app.get('/balance', (req, res) => {
   

    // let consolidatedPayers = [];

    // This code works, adds company name to list only if not alreay in the list
    let payerNameList = [];
    for (let i = 0; i < userTransactions.length; i++){
        if (payerNameList.includes(userTransactions[i].payer)) {
            console.log('do nothing')
        } else {
            console.log('we do some thing')
            payerNameList.push(userTransactions[i].payer)
            console.log(payerNameList);
        }
    }

    let payerNameAndPoints = [];

    for (let i = 0; i < payerNameList.length; i++){
        let xoom = payerNameList[i];
        let currentPayerCounter = 0;
        for (let iter = 0; iter < userTransactions.length; iter++){
            if (payerNameList[i] === userTransactions[iter].payer) {
                console.log('its a doozy');
                currentPayerCounter = currentPayerCounter + userTransactions[iter].points;
                console.log(currentPayerCounter);
            }
        }

        let obj2 = {};
        obj2[payerNameList[i]] = currentPayerCounter;
        payerNameAndPoints.push(obj2);
        console.log(payerNameAndPoints);
    }
    res.render('balance.ejs', {
        payerNameAndPoints: payerNameAndPoints,
    })
});


