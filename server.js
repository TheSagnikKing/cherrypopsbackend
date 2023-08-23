const express = require("express")
const app = express()
const connectDB = require("./db/db")
const OrderRoute = require("./routes/orderRoute")
const cors = require("cors")
const Razorpay = require('razorpay')

const instance = new Razorpay({
    key_id: "rzp_test_zKYwh3x2GkH8GL",
    key_secret: "uIYYhdkkhuuDlRvzmeRc4jMg"
});

// module.exports = instance

connectDB()
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cors())

app.get("/",(req,res) => {
    res.send("hepjcrvinrinvriv")
})

app.use("/api",OrderRoute)

const PORT = 8000;

app.listen(PORT,() => {
    console.log(`Server is running on PORT:${PORT}`)
})