import axios from 'axios';
import moment from 'moment';

export function handleText(message, replyToken, source, timestamp, client, db) {
    const idUser = source.userId;
    return client.getProfile(idUser)
        .then(profile => {
            const profileId = profile.userId;
            switch (message.text.toLowerCase()) {
                case 'test':
                    client.replyMessage(replyToken, {
                        type: 'text',
                        text: moment.unix(timestamp).format("DD MMM YYYY")
                    });
                    break;
                case 'jadwal shalat':
                    const dbRefLoc = db.collection('users').doc(profileId).collection('lokasi').doc('lokasiAwal').get()
                        .then(doc => {
                            const latitude = doc.data().latitude;
                            const longitude = doc.data().longitude;
                            const address = doc.data().address;
                            const API_UNSPLASH = 'https://api.unsplash.com/photos/random?page=1&query=mosque&orientation=landscape&client_id=8927155d86c8a4f2f7ddc93bf355113f0a9f52e96e945d873456023e60c4ca20';
                            const API_URL = `https://time.siswadi.com/pray/?lat=${latitude}&lng=${longitude}`;
                            let imageMosque = '';
                            axios.get(API_UNSPLASH)
                                .then(resp => {
                                    imageMosque = resp.data.urls.regular;
                                    axios.get(API_URL)
                                        .then(res => {
                                            console.log(res.data);
                                            client.replyMessage(replyToken, {
                                                type: "flex",
                                                altText: "Flex Jadwal Shalat",
                                                contents: {
                                                    type: "bubble",
                                                    hero: {
                                                        type: "image",
                                                        url: imageMosque,
                                                        size: "full",
                                                        aspectRatio: "20:13",
                                                        aspectMode: "cover",
                                                        action: {
                                                            type: "uri",
                                                            uri: "http://linecorp.com/"
                                                        }
                                                    },
                                                    body: {
                                                        type: "box",
                                                        layout: "vertical",
                                                        contents: [
                                                            {
                                                                type: "text",
                                                                text: "Jadwal Shalat",
                                                                weight: "bold",
                                                                color: "#409665",
                                                                size: "xl"
                                                            },
                                                            {
                                                                type: "text",
                                                                margin: "sm",
                                                                text: `${address}`,
                                                                wrap: true,
                                                                size: "xs",
                                                                color: "#b2b2b2"
                                                            },
                                                            {
                                                                type: "box",
                                                                layout: "vertical",
                                                                margin: "lg",
                                                                spacing: "sm",
                                                                contents: [
                                                                    {
                                                                        type: "box",
                                                                        layout: "horizontal",
                                                                        spacing: "xl",
                                                                        contents: [
                                                                            {
                                                                                type: "text",
                                                                                text: "Subuh",
                                                                                color: "#aaaaaa",
                                                                                size: "xs",
                                                                                flex: 3
                                                                            },

                                                                            {
                                                                                type: "text",
                                                                                text: `${res.data.data.Fajr}`,
                                                                                wrap: true,
                                                                                align: "end",
                                                                                color: "#666666",
                                                                                size: "sm",
                                                                                flex: 3
                                                                            }
                                                                        ]
                                                                    },
                                                                    {
                                                                        type: "box",
                                                                        layout: "horizontal",
                                                                        spacing: "xl",
                                                                        contents: [
                                                                            {
                                                                                type: "text",
                                                                                text: "Dzuhur",
                                                                                color: "#aaaaaa",
                                                                                size: "xs",
                                                                                flex: 3
                                                                            },

                                                                            {
                                                                                type: "text",
                                                                                text: `${res.data.data.Dhuhr}`,
                                                                                wrap: true,
                                                                                align: "end",
                                                                                color: "#666666",
                                                                                size: "sm",
                                                                                flex: 3
                                                                            }
                                                                        ]
                                                                    },
                                                                    {
                                                                        type: "box",
                                                                        layout: "horizontal",
                                                                        spacing: "xl",
                                                                        contents: [
                                                                            {
                                                                                type: "text",
                                                                                text: "Ashar",
                                                                                color: "#aaaaaa",
                                                                                size: "xs",
                                                                                flex: 3
                                                                            },

                                                                            {
                                                                                type: "text",
                                                                                text: `${res.data.data.Asr}`,
                                                                                wrap: true,
                                                                                align: "end",
                                                                                color: "#666666",
                                                                                size: "sm",
                                                                                flex: 3
                                                                            }
                                                                        ]
                                                                    },
                                                                    {
                                                                        type: "box",
                                                                        layout: "horizontal",
                                                                        spacing: "xl",
                                                                        contents: [
                                                                            {
                                                                                type: "text",
                                                                                text: "Maghrib",
                                                                                color: "#aaaaaa",
                                                                                size: "xs",
                                                                                flex: 3
                                                                            },

                                                                            {
                                                                                type: "text",
                                                                                text: `${res.data.data.Maghrib}`,
                                                                                wrap: true,
                                                                                align: "end",
                                                                                color: "#666666",
                                                                                size: "sm",
                                                                                flex: 3
                                                                            }
                                                                        ]
                                                                    },
                                                                    {
                                                                        type: "box",
                                                                        layout: "horizontal",
                                                                        spacing: "xl",
                                                                        contents: [
                                                                            {
                                                                                type: "text",
                                                                                text: "Isya",
                                                                                color: "#aaaaaa",
                                                                                size: "xs",
                                                                                flex: 3
                                                                            },

                                                                            {
                                                                                type: "text",
                                                                                text: `${res.data.data.Isha}`,
                                                                                wrap: true,
                                                                                align: "end",
                                                                                color: "#666666",
                                                                                size: "sm",
                                                                                flex: 3
                                                                            }
                                                                        ]
                                                                    }
                                                                ]
                                                            }
                                                        ]
                                                    },
                                                    footer: {
                                                        type: "box",
                                                        layout: "vertical",
                                                        spacing: "sm",
                                                        contents: [
                                                            {
                                                                type: "button",
                                                                style: "primary",
                                                                height: "sm",
                                                                action: {
                                                                    type: "postback",
                                                                    label: "Ganti Lokasi",
                                                                    data: "changeLocation",
                                                                    text: "Ganti Lokasi"
                                                                }
                                                            },
                                                            {
                                                                type: "spacer",
                                                                size: "sm"
                                                            }
                                                        ],
                                                        flex: 0
                                                    }
                                                }
                                            }).catch(err => console.log("Error saat mengambil url", err));
                                        }).catch(err => console.log("Axios error get", err));
                                });
                        });
                    break;
                case 'tambah shalat':
                    const dbLocRef = db.collection('users').doc(profileId).collection('lokasi').doc('lokasiAwal').get()
                        .then(doc => {
                            const latitude = doc.data().latitude;
                            const longitude = doc.data().longitude;
                            const address = doc.data().address;
                            const API_URL = `https://time.siswadi.com/pray/?lat=${latitude}&lng=${longitude}`;
                            axios.get(API_URL)
                                .then(res => {
                                    const API_JAM = `http://api.timezonedb.com/v2.1/get-time-zone?key=S0TR51M7YRLS&format=json&by=position&lat=${latitude}&lng=${longitude}&time=${timestamp}`;
                                    axios.get(API_JAM)
                                        .then(resp => {
                                            const waktuSekarang = resp.data.formatted;

                                        });
                                })
                        })
            }
        })

}

export function handleLocation(message, replyToken, source, client, db) {
    const idUser = source.userId;
    return client.getProfile(idUser)
        .then(profile => {
            const profileId = profile.userId;
            const getDoc = db.collection('users').doc(profileId).get()
                .then(doc => {
                    const data = doc.data();
                    //Jika User baru menambahkan bot
                    if (data.fLocationAwal === 1) {
                        const refDb = db.collection('users').doc(profileId);
                        const setAwal = refDb.collection('lokasi').doc('lokasiAwal').set({
                            'address': message.address.toString(),
                            'latitude': message.latitude.toString(),
                            'longitude': message.longitude.toString(),
                        }, {merge: true}).catch(err => console.log("Ada Eror", err));
                        const setFlag = refDb.set({
                            'fLocationAwal': 0
                        }, {merge: true}).then(() => {
                            client.replyMessage(replyToken, {
                                type: 'text',
                                text: `Terima kasih sudah share lokasimu, sekarang kamu berada di ${message.address.toString()}`,
                                quickReply: {
                                    items: [{
                                        type: "action",
                                        action: {
                                            type: "message",
                                            label: "Jadwal Shalat",
                                            text: "Jadwal Shalat"
                                        }
                                    }]
                                }
                            });
                        });
                    } else if (data.fLocationGanti === 1) {
                        const refDb = db.collection('users').doc(profileId);
                        const setGantiLoc = refDb.collection('lokasi').doc('lokasiAwal').set({
                            'address': message.address.toString(),
                            'latitude': message.latitude.toString(),
                            'longitude': message.longitude.toString(),
                        }, {merge: true}).catch(err => console.log("Ada error ketika mengupdate tempat", err));
                        const setFlag = refDb.set({
                            'fLocationGanti': 0
                        }, {merge: true}).then(() => {
                            client.replyMessage(replyToken, {
                                type: 'text',
                                text: `Lokasi kamu sudah diupdate, sekarang kamu berada di ${message.address.toString()}`,
                                quickReply: {
                                    items: [{
                                        type: "action",
                                        action: {
                                            type: "message",
                                            label: "Jadwal Shalat",
                                            text: "Jadwal Shalat"
                                        }
                                    }, {
                                        type: "action",
                                        action: {
                                            type: "message",
                                            label: "Test",
                                            text: "test"
                                        }
                                    }]
                                }
                            });
                        });
                    }
                }).catch(err => console.log("Get Doc Error", err));
        }).catch(err => console.log("Error get User dari Location", err));
}