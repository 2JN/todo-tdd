const mongoose = require('mongoose')

async function connect() {
  try {
    await mongoose.connect(
      `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@cluster0.zimfg.mongodb.net/test`
    )
  } catch (err) {
    console.error(err)
  }
}

exports.connect = connect
