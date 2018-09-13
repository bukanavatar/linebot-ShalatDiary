import axios from 'axios';

export function handleText(message, replyToken, source, client, db) {
    const idUser = source.userId;
    return client.getProfile(idUser)
        .then(profile => {
            const profileId = profile.userId;
            switch (message.text.toLowerCase()) {
                case 'test':
                    const getDoc = db.collection('users').doc(profileId).get()
                        .then(doc => {
                            console.log(doc.data());
                            client.replyMessage(replyToken, [{
                                type: 'text',
                                text: doc.data()
                            }])
                        }).catch(err => console.log("ada error", err));
                    break;
                case 'jadwal shalat':
                    const dbRefLoc = db.collection('users').doc(profileId).collection('lokasi').doc('lokasiAwal').get()
                        .then(doc => {
                            const latitude = doc.data().latitude;
                            const longitude = doc.data().longitude;
                            const API_URL = `https://time.siswadi.com/pray/?lat=${latitude}&lng=${longitude}`;
                            axios.get(API_URL)
                                .then(res => {
                                    console.log(res.data);
                                    client.replyMessage(replyToken, {
                                        type: 'template',
                                        altText: 'Image carousel alt text',
                                        template: {
                                            type: 'image_carousel',
                                            columns: [
                                                {
                                                    imageUrl: 'https://www.w3schools.com/w3css/img_snowtops.jpg',
                                                    action: {label: 'Go to LINE', type: 'uri', uri: 'https://line.me'},
                                                },
                                                {
                                                    imageUrl: 'https://www.w3schools.com/w3css/img_snowtops.jpg',
                                                    action: {
                                                        label: 'Say hello1',
                                                        type: 'postback',
                                                        data: 'hello こんにちは'
                                                    },
                                                },
                                                {
                                                    imageUrl: 'https://www.w3schools.com/w3css/img_snowtops.jpg',
                                                    action: {label: 'Say message', type: 'message', text: 'Rice=米'},
                                                },
                                                {
                                                    imageUrl: 'https://www.w3schools.com/w3css/img_snowtops.jpg',
                                                    action: {
                                                        label: 'datetime',
                                                        type: 'datetimepicker',
                                                        data: 'DATETIME',
                                                        mode: 'datetime',
                                                    },
                                                },
                                            ]
                                        },
                                    }).catch(err => console.log("Error saat mengambil url", err));
                                }).catch(err => console.log("Axios error get", err));
                        });
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
                        const dataMessage = [message.address.toString(), message.latitude.toString(), message.longitude.toString()];
                        const setAwal = refDb.collection('lokasi').doc('lokasiAwal').set({
                            'address': dataMessage[0],
                            'latitude': dataMessage[1],
                            'longitude': dataMessage[2],
                        }, {merge: true}).catch(err => console.log("Ada Eror", err));
                        const setFlag = refDb.set({
                            'fLocationAwal': 0
                        }, {merge: true}).then(() => {
                            client.replyMessage(replyToken, {
                                type: 'text',
                                text: `Terima kasih sudah share lokasimu, sekarang kamu berada di ${message.address}`
                            });
                        });
                    }
                }).catch(err => console.log("Get Doc Error", err));
        }).catch(err => console.log("Error get User dari Location", err));
}