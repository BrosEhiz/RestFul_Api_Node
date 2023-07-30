const express = require('express');
const app = express();
const morgan = require('morgan');
const mongoose = require('mongoose');
var bodyParser = require('body-parser');


const productRoutes = require('./API/routes/products')
const orderRoutes = require('./API/routes/orders')

// middleware
app.use(morgan('dev'));
// needed to parse body to your client/server side
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

mongoose.set("strictQuery", false)
const dbURl = 'mongodb+srv://Bros_Ehiz:ehizogie123@log.uz4szia.mongodb.net/?retryWrites=true&w=majority'
mongoose.connect(dbURl, {useNewUrlParser: true, useUnifiedTopology: true}).
then((result) => console.log('connected to DB')).
catch((error) => console.log(error));
   

// CORS header so the browser can overlook it

// app.use((req, res, next)=> {
//     res.header('Access-Control-Allow-Origin', "*");
//     res.header(
//         "Access-Control-Allow-Origin",
//         "Origin, X-Requested-With, Content-Type, Accept, Authorization"
//     );
//     if (req.method === 'OPTIONS') {
//         res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET')
//         return res.status(200).json({});
//     }
// });


// handling GET request handlers
app.use( '/products', productRoutes);
app.use( '/orders', orderRoutes);

// error handler when the request is not valid/found

app.use((req, res, next) => {
    const error = new Error('not found');
    error.status = 404 ;
    next(error);
})

// error handler when database fails
app.use((error, req, res, next) => {
    res.status(error.status || 500)
res.json({
    err: {
        message: error.message
    }
})})


// app.get( '/', (req, res, next)=> {
//     res.status(200).json({
//         message: 'Post the product'
//     });
// });

module.exports = app;