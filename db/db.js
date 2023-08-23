const mongoose = require("mongoose")

const connectDB = async() => {
    try {
        const conn = await mongoose.connect("mongodb+srv://cherrypops_1234:cherrypops_1234@cherrypops.pvlgnmd.mongodb.net/")
        console.log(`Mongodb connected on host:${conn.connection.host}`)
    } catch (error) {
        console.log(error.message)
    }
}

module.exports = connectDB;