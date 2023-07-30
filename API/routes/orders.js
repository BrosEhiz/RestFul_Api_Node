const express = require ('express');
const router = express.Router();
const mongoose = require('mongoose');
const Order = require('./model/order');


router.get( '/', (req, res, next)=> {
    Order.find()
      // select the kind of data you want to see in your db
    .select('name unit _id')
    .exec()
    .then(docs => {
        const response = {
            numbers: docs.length,
            orders: docs.map(doc =>{
               return{
                name: doc.name,
                unit: doc.unit,
                _id: doc._id,
                request: {
                    type: "GET",
                    url: "http://localhost:3000/units/" + doc._id
                }
               } 
            })
        }
        res.status(200).json(response);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
});

router.post( '/', (req, res, next)=> {

    // console.log(req.body);
    const order = new Order ({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        unit: req.body.unit
    });
       order.save()
       .then(doc=> {
        console.log(doc);
        res.status(201).json({
           message: ' Handling POST request from Order',
           unit: unit,
           createdOrder: {
            name: result.name,
            unit: result.unit,
            _id: result._id,
            result: {
                type: 'GET',
                url: 'http://localhost:3000/orders/' + result._id
            }
           }
        }); 
       })
       .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        })
       });

});


router.get("/:orderId", ( req, res, next) => {
    const id = req.params.orderId;
    Order.findById(id)
    .exec()
    .then(doc => {
        console.log(doc);
        res.status(200).json(doc);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({error: err})
    });
});

router.get("/:productId", ( req, res, next) => {
    const id = req.params.productId;
    Product.findById(id)
    .select('name price _id')
    .exec()
    .then(doc => {
        console.log('from database', doc);
        if(doc) {
            res.status(200).json({
                product: doc,
                request: {
                    type: 'GET',
                    description: 'Get all orders',
                    url: "http://localhost:3000/orders" + result._id
                }
            })
        } else{
            res.status(404).json({message: 'no valid entry for id entered'})
        }
        res.status(200).json(doc);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({error: err})
    });
});
        

router.patch("/:orderId", (req, res, next) => {
    const id = req.params.orderId;
    const updateOps = {};
    for(const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }
    Order.updateMany({ _id: id }, { $set: updateOps})
    .exec()
    .then(result => {
         res.status(200).json({
            message: 'Order updated',
            request: {
                type: 'GET',
                url: 'http://localhost:3000/orders/' + id
            }
         })
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        })
    });


// router.delete( '/', (req, res, next)=> {
//     res.status(200).json({
//         message: 'Get the '
//     });
// });

router.delete('/:orderid', (req, res, next) => {
    const id = req.params.orderid;
    Order.remove({ _id: id })
    .exec()
    .then(result => {
        res.status(200).json({
            message: 'Order deleted',
            request: {
                type: 'POST',
                url: 'http://localhost:3000/orders'
            }
        })
    })
    })



module.exports = router;