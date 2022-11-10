const mongoose = require('mongoose');
//TODO change database according to assignment
const CONNECTION_STRING = 'mongodb://localhost:27017/...';

module.exports = async (app) => {
    try{
        await mongoose.connect(CONNECTION_STRING, {
            useUnifiedTopology: true,
            useNewUrlParser: true
        });
        console.log('Database connected...');
    }catch(err){
        console.error("Error initiazlizing database!");
        console.error(err.message);
        process.exit(1);
    };
};