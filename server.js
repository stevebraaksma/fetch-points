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
    res.render('home.ejs');
    let currentTransactionPayer = req.body.payer;
    let currentTransactionPoints = Math.floor(req.body.points);
    let currentTransaction = {
        payer: currentTransactionPayer,
        points: currentTransactionPoints,
    }
    userTransactions.push(currentTransaction);
    console.log(userTransactions);
    // also need to push timestamp as well

    totalPointsAdded = totalPointsAdded + currentTransactionPoints

    console.log(totalPointsAdded);

});