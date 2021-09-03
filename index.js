const express = require('express');
const mongoose = require('mongoose');
const app = express();
//const dbUrl = "mongodb://localhost:27017";
const dbUrl = "mongodb+srv://detprof:B0gard1nG@challenge-api.vnskf.mongodb.net/users?retryWrites=true&w=majority";
const appPort = 3696;

var indexRouter = require('./routes/index');
var userRouter = require('./routes/user');

mongoose.connect(dbUrl, { useNewUrlParser: true });
const conn = mongoose.connection;

app.use(express.urlencoded());
app.use(express.json());

app.use('/', indexRouter);
app.use('/user', userRouter);

try {
    conn.on('open', () => {
        console.log("Mongodb connected");
    })
} catch (error) {
    console.log("Error: " + error);
}

app.listen(appPort, () => {
    console.log("Server started");
})