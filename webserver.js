const express = require('express');
const eApp = express();
const cors = require("cors")
const http = require("http")
const logger = require("./utils/BotstionLogger")
eApp.use(cors())
module.exports = function(client) {
    eApp.use(function (req, res) {
        res.send({status: client.status, guilds: client.guilds.size, users: client.users.size})
        logger.info("HTTP: Request from " + req.ip)
    })
    const eServer = http.createServer(eApp);
    eServer.listen(2325,"0.0.0.0", function listening() {
        logger.info('HTTP: Listening on' + eServer.address().port);
      });
}
