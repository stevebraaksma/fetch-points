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

// home route
app.get('/', (req, res) => {
    res.render('home.ejs');
});

// add route
app.post('/add', (req, res) => {
    res.render('add.ejs');
    let currentTransactionPayer = req.body.payer;
    let currentTransactionPoints = Math.floor(req.body.points);
    let currentDate = req.body.date;
    let currentTransaction = {
        payer: currentTransactionPayer,
        points: currentTransactionPoints,
        // when adding points, also set initial balance to this value
        balance: currentTransactionPoints,
        date: currentDate,
    }
    userTransactions.push(currentTransaction);
    totalPointsAdded = totalPointsAdded + currentTransactionPoints
    console.log(totalPointsAdded)
});


// do the spend route here
app.post('/spend', (req, res) => {
    let currentSpendRequest = req.body.points;
    // sort by transaction date
    userTransactions.sort((a, b) => {
        let da = new Date(a.date),
            db = new Date(b.date);
        return da - db;
    });

    for (let i = 0; i < userTransactions.length; i++) {
        let currrentPayer = userTransactions[i].payer;
        let pointsIterator = userTransactions[i].balance;
        if (currentSpendRequest <= 0) {
            break;
        }
        if (currentSpendRequest > totalPointsAdded) {
            break;
        }
        let pointValueToPush = 0;
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
        currentSpendRequest = currentSpendRequest - pointValueToPush;
        userTransactions[i].balance = userTransactions[i].balance - pointValueToPush;
        console.log(userTransactions);

    }
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


