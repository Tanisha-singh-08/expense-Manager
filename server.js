const express=require("express");
const cors=require("cors");
const morgan=require("morgan");
const dotenv=require("dotenv");
const colors=require("colors");
const connectDB = require("./config/connectDB");

//config dot env file
dotenv.config();

//db calll
connectDB();

//rest objects
const app=express();

//middlewares
app.use(morgan("dev"));
app.use(express.json());
app.use(cors());

//routes
//user routes
app.use("/api/v1/users",require("./routes/userRoute"));

//transaction routes
app.use("/api/v1/transactions",require("./routes/transactionRoutes"));
//port
const PORT=5000 || process.env.PORT
app.listen(PORT,()=>{
    console.log(`server is running on port ${PORT}`);
})

