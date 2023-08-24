const Order = require("../models/orderModel");
const Razorpay = require('razorpay');
const crypto = require("crypto");

const instance = new Razorpay({
    key_id: "rzp_test_zKYwh3x2GkH8GL",
    key_secret: "uIYYhdkkhuuDlRvzmeRc4jMg"
});

const createOrder = async (req, res) => {
    const order = req.body;

    const createdOrder = await Order.create(order);

    res.json({
        order: createdOrder
    });
};

const checkout = async (req, res) => {
    const options = {
        amount: Number(req.body.amount*100),
        currency: "INR"
    };

    const order = await instance.orders.create(options);

    res.json({
        success: true,
        order
    })
};

const paymentverification = async (req, res) => {

    console.log(req.body)

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
        req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
        .createHmac("sha256", "uIYYhdkkhuuDlRvzmeRc4jMg")
        .update(body.toString())
        .digest("hex");

    const isAuthentic = expectedSignature === razorpay_signature

    if (isAuthentic) {
        
        // Update the order in the database
        const orderId = req.params.slug; // Replace this with the actual order ID
        const orderToUpdate = await Order.findOne({ _id: orderId });

        if (orderToUpdate) {
            orderToUpdate.isPaid = true;
            orderToUpdate.paidAt = new Date();
            orderToUpdate.paymentResult = {
                id: razorpay_payment_id,
                status: "success", // You might want to fetch the actual status from Razorpay response
                update_time: new Date().toISOString(),
                email_address: "user@example.com" // Update with actual email
            };
            
            // Update Razorpay payment information
            orderToUpdate.razorpay_order_id = razorpay_order_id;
            orderToUpdate.razorpay_signature = razorpay_signature;
            orderToUpdate.razorpay_payment_id = razorpay_payment_id;

            await orderToUpdate.save();
            
            res.redirect(`https://cherrypops2.vercel.app/paymentsuccess?reference=${razorpay_payment_id}`);
        }else {
            res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }
    } else {
        res.status(200).json({
            success: false
        })
    }

    console.log("sign received", razorpay_signature)
    console.log("sig generated", expectedSignature)
}

// const paymentverification = async (req, res) => {
    // const orderId = "64e358d52a7b927c2eee15b6"; // Replace this with the actual order ID
    // const order = await Order.findOne({ _id: orderId });

//     if (order) {
//         res.json(order);
//     } else {
//         res.status(404).json({ message: "Order not found" });
//     }
// };

module.exports = { createOrder, checkout, paymentverification };


