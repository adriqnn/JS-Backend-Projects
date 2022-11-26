const express = require('express');
const databaseConfig = require('./config/database');
const expressConfig = require('./config/express');
const routesConfig = require('./config/routes');

async function start(){
    const app = express();
    
    expressConfig(app);
    routesConfig(app);
    await databaseConfig(app);
    
    app.listen(3000, () => console.log('Server listening on port 3000'));
}
start();