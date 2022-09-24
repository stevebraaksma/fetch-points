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


    totalPointsAdded = totalPointsAdded + currentTransactionPoints

    console.log(totalPointsAdded);

});


// do the spend route here


// balance route
app.get('/balance', (req, res) => {
    res.render('balance.ejs');
    // console.log('route hit');

    // res.render('home.ejs', {
    //     points: points,
    // })


});


