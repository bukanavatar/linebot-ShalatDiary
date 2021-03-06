//Regular Imports
import https from 'https';
import fs from 'fs';
import express from 'express';
import {Client, middleware} from '@line/bot-sdk';
import firebase from './Firebase';
import schedule from 'node-schedule';
import axios from 'axios';
import moment from 'moment';
//Events
import {follow} from './Events/events_follow';
import {handleLocation, handleText} from './Events/events_message';
import {handlePostback} from "./Events/events_postback";

const VoiceResponse = require('twilio').twiml.VoiceResponse;

const app = express();

const CHANNEL_ACCESS_TOKEN = 'D9JnIsMjrRUysTqDg7KCrWZjlNZoJxl3SfoW8C1B3ICB5pVnsLzqos8UogA12/ZFaKQMrYdjhybkzu6DI6/kct/R4JMGA6ffxanqgilP67y7RjmsARwQ9EGoRpseCO0H06G4cRwU0MD5Q73Xa6vwhQdB04t89/1O/w1cDnyilFU=';
const CHANNEL_SECRET = '26ace68ef19ead93d2e88e83cba4a1a6';
const config = {
    channelAccessToken: CHANNEL_ACCESS_TOKEN,
    channelSecret: CHANNEL_SECRET,
};
const client = new Client(config);
const db = firebase.firestore();
const twiml = new VoiceResponse();
const BASE_URL = 'https://bukanavatar.com:1234/api';

async function scheduleTime() {
    const dbRef = await db.collection('users').doc('U5b8038d4acf2c3c808e89bd8fe75f281').collection('lokasi').doc('lokasiAwal').get();
    const latitude = dbRef.data().latitude;
    const longitude = dbRef.data().longitude;
    const API_TIME = `http://api.timezonedb.com/v2.1/get-time-zone?key=S0TR51M7YRLS&format=json&by=position&lat=${latitude}&lng=${longitude}`;
    const respWaktuSekarang = await axios.get(API_TIME);
    const timezoneSekarang = respWaktuSekarang.zoneName;
    const API_TIMEZONE = `http://api.timezonedb.com/v2.1/convert-time-zone?key=S0TR51M7YRLS&format=json&from=${timezoneSekarang}&to=Africa/Ouagadougou`;
    const respGMT = await axios.get(API_TIMEZONE);
    const timeStampGMT = respGMT.offset;

    const date = new Date(parseInt(timeStampGMT.replace("-", "")) * 1000).toISOString();
    const dateObj = moment(date);
    const HOUR_OFFSET = dateObj.utc().format("HH");
    const MINUTE_OFFSET = dateObj.utc().format("mm");
    let kali = 1;
    if (timeStampGMT.substring(0, 1) === "-") {
        kali = -1;
    }
    const j = schedule.scheduleJob({hour: 6 + (HOUR_OFFSET * kali), minute: 57 + (MINUTE_OFFSET * kali)}, async () => {
        axios.get(`${BASE_URL}/api/callme`)
            .then(a => console.log(a))
            .catch(e => console.log("error", e));
        console.log("Memanggil");
    });
}

scheduleTime();
app.get('/api/callme', (req, res) => {
    const accountSid = 'AC3a09d93295e6770f86ae5b808aae0de5';
    const authToken = '2e562f97155067193df7e49f02389b06';
    const client = require('twilio')(accountSid, authToken);

    client.calls
        .create({
            url: `${BASE_URL}/callshalat`,
            from: '+12408001822',
            to: '+6282239473609'
        })
        .then(call => res.send(call.sid))
        .then(res.send("Masuk Pak Eko"))
        .done();
});

app.post('/api/record', (req, res) => {
    twiml.say('Wokay');
    res.type('text/xml');
    res.send(twiml.toString());
});
app.post('/api/callshalat', (req, res) => {
    twiml.play('https://firebasestorage.googleapis.com/v0/b/shalatdiary.appspot.com/o/audio%2FadzanSubuh.mp3?alt=media&token=9506dde7-e757-48cc-84ac-8d47a618fc25');
    res.type('text/xml');
    res.send(twiml.toString());
});
app.post('/callback', middleware(config), (req, res) => {
    res.writeHead(200);
    Promise
        .all(req.body.events.map(handleEvent))
        .then(result => {
            res.json(result);
            console.log(result);
        })
        .catch(err => {
            console.log(err);
            res.status(500).end();
        });
});

function handleEvent(event) {
    switch (event.type) {
        case 'follow':
            return follow(event.replyToken, event.source, client, db);
        case 'postback':
            return handlePostback(event.replyToken, event.source, event.postback, client, db);
        case 'message':
            const message = event.message;
            switch (message.type) {
                case 'text':
                    return handleText(message, event.replyToken, event.source, event.timestamp, client, db);
                case 'location':
                    return handleLocation(message, event.replyToken, event.source, client, db);
            }
        case 'datetimepicker':

    }
}

const options = {
    key: fs.readFileSync("/etc/letsencrypt/live/bukanavatar.com/privkey.pem"),
    cert: fs.readFileSync("/etc/letsencrypt/live/bukanavatar.com/fullchain.pem")
};

https.createServer(options, app).listen(1234);