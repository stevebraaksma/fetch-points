// require dependencies
const express = require('express');
const app = express();
const methodOverride = require('method-override');

// listener
app.listen(3000, () => console.log(`server is listening on port 3000`));

// middleware
app.use(express.urlencoded({ extended: false }));

let userTransactions = [];
let spendTransactions = [];
let totalPointsAdded = 0;
// let totalPointsSpent = 0;

// home route
app.get('/', (req, res) => {
    res.render('home.ejs');
});

// add route
app.post('/add', (req, res) => {
    res.render('add.ejs');
    let currentTransactionPayer = req.body.payer;
    let currentTransactionPoints = Math.floor(req.body.points);
    let currentTransaction = {
        payer: currentTransactionPayer,
        points: currentTransactionPoints,
        // when adding points, also set initial balance to this value
        balance: currentTransactionPoints,
    }
    userTransactions.push(currentTransaction);
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
    console.log(totalPointsAdded)
});


// do the spend route here
app.post('/spend', (req, res) => {
    let currentSpendRequest = req.body.points;
    // totalPointsSpent = totalPointsSpent + currentSpendRequest
    let pointsCounterVariable = 0;
    for (let i = 0; i < userTransactions.length; i++) {
        let currrentPayer = userTransactions[i].payer;
        let pointsIterator = userTransactions[i].points;

        if (currentSpendRequest <= 0) {
            break;
        }
        // if (totalPointsSpent + currentSpendRequest > totalPointsAdded) {
        if (currentSpendRequest > totalPointsAdded) {

            break;
        }

        let pointValueToPush = 0;
        // let unspentBalance = 0;
        if (currentSpendRequest < pointsIterator){
            pointValueToPush = currentSpendRequest
        } 
        if (currentSpendRequest >= pointsIterator){
            pointValueToPush = pointsIterator
        }
        let currentSpendTransaction = {
            payer: currrentPayer,
            points: pointValueToPush,
        }
        spendTransactions.push(currentSpendTransaction);
        pointsCounterVariable = pointsCounterVariable + pointValueToPush;

        // decrement currentSpendRequest
        currentSpendRequest = currentSpendRequest - pointValueToPush;

        // here, push unspent balance to userTransactions in the 3rd position
        // (after timestamp added, would need to move this to the fourth postion)
        // userTransactionsuserTransactions[i].spent = 100;
        userTransactions[i].spent = pointValueToPush;
        userTransactions[i].balance = userTransactions[i].points - pointValueToPush;
        console.log(userTransactions);

    }
    // totalPointsSpent = totalPointsSpent + pointsCounterVariable;

    res.render('spend.ejs', {
        spendTransactions: spendTransactions,
    })
});




//transactions route
app.get('/transactions', (req, res) => {
    res.render('transactions.ejs', {
        userTransactions: userTransactions,
    })
});


// balance route
app.get('/balance', (req, res) => {
   

    // let consolidatedPayers = [];

    // This code works, adds company name to list only if not alreay in the list
    let payerNameList = [];
    for (let i = 0; i < userTransactions.length; i++){
        if (payerNameList.includes(userTransactions[i].payer)) {
        } else {
            payerNameList.push(userTransactions[i].payer)
        }
    }

    let payerNameAndPoints = [];

    for (let i = 0; i < payerNameList.length; i++){
        let currentPayerCounter = 0;
        for (let iter = 0; iter < userTransactions.length; iter++){
            if (payerNameList[i] === userTransactions[iter].payer) {
                currentPayerCounter = currentPayerCounter + userTransactions[iter].points;
            }
        }
        let obj2 = {};
        obj2[payerNameList[i]] = currentPayerCounter;
        payerNameAndPoints.push(obj2);
    }
    res.render('balance.ejs', {
        payerNameAndPoints: payerNameAndPoints,
    })
});


