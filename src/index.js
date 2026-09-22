const express = require('express'); 

const { ServerConfig , Logger } = require('./config');
const apiRoutes = require('./routes/index.js');
const errorHandler = require('./utils/error-handler.js');
const mongoSanitize = require("express-mongo-sanitize");
const morgan = require("morgan")
const helmet = require("helmet")
const dns = require("dns")
const compression = require("compression")
const cors = require("cors")
// const xss = require("xss-clean");
const { Limiter } = require('./validations');
const { ConnectDataBase } = require('./db/index.js');


dns.setServers(["8.8.8.8", "1.1.1.1"])
require("dotenv").config()
const app = express();


// ----------------- DATABASE ENTRY  -----------------//
ConnectDataBase()
// ----------------- DATABASE ENTRY  -----------------//



// ----------------- MIDDELWARES -----------------//
app.use(express.json())
app.use(helmet())
app.use(mongoSanitize());
app.use(
    cors({
        origin: process.env.CLIENT_URL,
        credentials: true,
    })
);
app.use(express.urlencoded({extended  : true})) 
// app.use(xss()) // 
app.use(compression()) // Typically reduces response size by 60–80%.
// ----------------- MIDDELWARES -----------------//


// ----------------- Morgan for Api log endPoint -----------------//
app.use(morgan(function (tokens, req, res) {
    return [
        tokens.method(req, res),
        tokens.url(req, res),
        tokens.status(req, res),
        tokens.res(req, res, 'content-length'), '-',
        tokens['response-time'](req, res), 'ms'
    ].join(' ')
}))
// ----------------- Morgan for Api log endPoint -----------------// 



// ----------------- ALL ROUTES -----------------//
app.use("/api" , Limiter.apiLimiter  , apiRoutes)
// ----------------- ALL ROUTES -----------------//



// ----------------- SERVER RUNNING -----------------//
app.listen(ServerConfig.PORT, () => {
    console.log(`Successfully started the server on PORT : ${ServerConfig.PORT}`);
    // Logger.info("Successfully started " , {}) you can enable to log the messages
});

// ----------------- SERVER RUNNING -----------------//


// ----------------- GLOBAL ERROR HANDLER -----------------//
app.use(errorHandler)
// ----------------- GLOBAL ERROR HANDLER -----------------//

