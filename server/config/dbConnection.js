

const mongoose = require('mongoose')
async function dbConnect() {
    try {
        await mongoose.connect(process.env.DB_CONNECT_URL,{
            dbName:process.env.DB_NAME
        });
        console.log('connect ok!')
    } catch (error) {
        console.log('connect fail',error.message)
    }
}
module.exports = {dbConnect}