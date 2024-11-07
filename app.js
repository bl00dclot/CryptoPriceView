import express from "express";
import axios from "axios";
import bodyParser from "body-parser";
import morgan from "morgan";

const app = express();
const port = 3000;

const url = "https://api.blockchain.com/v3/exchange/tickers";

app.use(bodyParser.urlencoded({ extended: true }))

app.use(express.static('public'));
app.use(morgan('dev'));

app.get('/', async (req, res) => {
    try {
        const response = await axios.get(url);
        const currencyData = response.data;
        const currencySymbol = [];
        currencyData.map(element => {
            currencySymbol.push(element["symbol"]);
        });
        res.render('index.ejs', {symbolData: currencySymbol});
    } catch (error) {
        console.error(error.message);
    };
});

app.post('/currency', async (req, res) => {
    const currency = req.body.currency;
    try {
        const response = await axios.get(url);
        const currencyData = response.data;
        const outputPriceData = {};
        currencyData.forEach((element) => {
            if (element['symbol'] == currency) {
                Object.assign(outputPriceData, element);
            }; 
        });
        res.render('index.ejs', {priceData: outputPriceData});
    } catch (error) {
        console.error(error.message);
    };
});


app.listen(port, () => {
    console.log(`Server on port: ${port}`);
});