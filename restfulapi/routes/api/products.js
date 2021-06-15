
var express = require('express');
var router = express.Router();

const validateProduct=require("../../middlewares/validatepProduct");
const auth=require("../../middlewares/auth");
const admin =require("../../middlewares/auth");
var {Product} =require("../../models/product");
//get products from DB oof mongo db
//query string for pagination

router.get("/",async (req,res)=>{
    console.log(req.user);
    //console.log(req.query)
    // post man get method input
    //localhost:3000/api/products?page=1&perPage=3
    // result in console { page: '1' }
    let page= Number(req.query.page? req.query.page:1);
    let perPage= Number(req.query.perPage? req.query.perPage:10);
    let skipRecords= (perPage*(page-1)); 
    // get specific commands on post man localhost:3000/api/products?page=1&perPage=2 show 2 records

    let products= await Product.find().skip(skipRecords).limit(perPage);
    return res.send(products);

});

//get single  product from DB oof mongo db
router.get("/:id",async (req,res)=>{
    try{ 
        let product= await Product.findById(req.params.id)
//    agar product available nai hay
        if(!product) res.status(400).send("this is ID product is not available")
        return res.send(product); // every thing is ok
    } catch(err){
     //invalid id  
     return res.status(400).send("Invalid Id") // format is not correct 
    }
    
});

//del single  product from DB oof mongo db
router.delete("/:id",auth,admin,async (req,res)=>{
    let product= await Product.findByIdAndDelete(req.params.id)
    return res.send(product);

});

//update  single  product from DB oof mongo db
router.put("/:id",validateProduct,async (req,res)=>{
    let product= await Product.findById(req.params.id)
    
    product.name=req.body.name;
    product.price=req.body.price;
    await product.save();
    return res.send(product);

});
router.post("/",auth,validateProduct,async (req,res)=>{
    
    let product= new Product()
    product.name=req.body.name;
    product.price=req.body.price;
    await product.save();
    return res.send(product);

});
module.exports = router;
