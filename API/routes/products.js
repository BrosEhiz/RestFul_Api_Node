const express = require ('express');
const router = express.Router();
const mongoose = require('mongoose')
const Product = require ('./model/product')


router.get( '/', (req, res, next)=> {
    Product.find()
      // select the kind of data you want to see in your db
    .select('name price _id')
    .exec()
    .then(docs => {
        const response = {
            sum: docs.length,
            products: docs.map(doc =>{
               return{
                name: doc.name,
                price: doc.price,
                _id: doc._id,
                request: {
                    type: "GET",
                    url: "http://localhost:3000/products/" + doc._id
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
    const product = new Product ({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price
    });
       product.save().
       then(result => {
        console.log(result);
       }).
       catch(err => console.log(err));

    res.status(201).json({
        message: 'Handling POST request to /products',
        price: price,
        createdProduct: {
            name: result.name,
            price: result.price,
            _id: result._id,
            request: {  
                type: 'GET',
                url:"http://localhost:3000/products/" + result._id
            }
        }
    }); 
});

// router.get('/:productId', (req, res, next )=> {
//     const id = req.params.productId;
//     Product.findById(id)
//     .exec()
//     .then(doc => {
//         console.log("from database", doc);
//        /*  if (doc) {
//         res.status(200).json(doc);
//         }else{
//             res.status(404).json({message: 'no valid entry found for entry'});
//         } */
//     })
//     .catch(
//         err => console.log(err));
//         res.status(500).
//         json({
//             error: err
//         });


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
                    description: 'Get all products',
                    url: "http://localhost:3000/products"
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
        
router.patch("/:productId", (req, res, next) => {
    const id = req.params.productId;
    const updateOps = {};
    for(const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }
    Product.updateMany({ _id: id }, { $set: updateOps})
    .exec()
    .then(result => {
         res.status(200).json({
            message: 'Product updated',
            request: {
                type: 'GET',
                url: 'http://localhost:3000/products/' + id
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

    router.delete('/:productid', (req, res, next) => {
        const id = req.params.productid;
        Product.remove({ _id: id })
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'Product deleted',
                reques: {
                    type: 'POST',
                    url: 'http://localhost:3000/products'
                }
            })
        })
        })

   /*  if ( id === 'special') {
        res.status(200).json({
            message: 'you are getting the ID',
            id: id
           
        })
    }
    else {
        res.status(200).json({
            message: 'your id'
         
        })
    } */

 
module.exports = router;
