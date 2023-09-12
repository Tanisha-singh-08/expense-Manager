const express=require("express");
const { addTransaction, getAllTransaction } = require("../controllers/transactionCtrl");


//router object
const router=express.Router();

//routes
//add transaction post method
router.post("/add-transaction",addTransaction);

//get transactions
router.post("/get-transaction",getAllTransaction);

module.exports=router;