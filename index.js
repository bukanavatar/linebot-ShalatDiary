const express = require('express');
const middleware = require('@line/bot-sdk').middleware;
const JSONParseError = require('@line/bot-sdk').JSONParseError;
const SignatureValidationFailed = require('@line/bot-sdk').SignatureValidationFailed;
const Client = require('@line/bot-sdk').Client;

const app = express();

const config = {
    channelAccessToken: 'D9JnIsMjrRUysTqDg7KCrWZjlNZoJxl3SfoW8C1B3ICB5pVnsLzqos8UogA12/ZFaKQMrYdjhybkzu6DI6/kct/R4JMGA6ffxanqgilP67y7RjmsARwQ9EGoRpseCO0H06G4cRwU0MD5Q73Xa6vwhQdB04t89/1O/w1cDnyilFU=',
    channelSecret: '26ace68ef19ead93d2e88e83cba4a1a6'
};
const client = new Client(config);

app.post('/webhook', middleware(config), (req, res) => {
    Promise
        .all(req.body.events.map(handleEvent))
        .then(result => res.json(result))
        .catch(err => {
            console.log(err);
            res.status(500).end();
        });
});
app.get('/test', (req, res) => {
    res.send("working");
});
function handleEvent(event) {
    if (event.type !== "message" || event.message.type !== "text") {
        return Promise.resolve(null)
    }
    const echo = {
        type: 'text',
        text: event.message.text
    };
    return client.replyMessage(event.replyToken, echo);
}

// app.use((err, req, res, next) => {
//     if (err instanceof SignatureValidationFailed) {
//         res.status(401).send(err.signature);
//         return
//     } else if (err instanceof JSONParseError) {
//         res.status(400).send(err.raw);
//         return
//     }
//     next(err)
// });

app.listen(8080, () => {
    console.log('Listening on Port 8080');
});