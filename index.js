const Client = require("./handlers/ClientStart.js");
const client = new Client();
// start bot
client.start();
// AntiCrash
process.on("unhandledRejection", (reason, p) => {
    console.log("unhandledRejection");
    console.log(reason, p);
    client.channels.cache.get('1137652594613948446').send(`${reason}`);
});
process.on("uncaughtException", (err, origin) => {
    console.log("uncaughtException");
    console.log(err, origin);
    client.channels.cache.get('1137652594613948446').send(`${err}`);
});
process.on("uncaughtExceptionMonitor", (err, origin) => {
    console.log("uncaughtExceptionMonitor");
    console.log(err, origin);
    client.channels.cache.get('1137652594613948446').send(`${err}`);
});