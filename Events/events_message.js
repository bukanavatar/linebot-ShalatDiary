export function handleText(message, replyToken, source, client, db) {
    switch (message.text.toLowerCase()) {
        case 'test':
            const getDoc = db.collection('users').doc('U5b8038d4acf2c3c808e89bd8fe75f281').get()
                .then(doc => {
                    console.log(doc.data());
                });
            client.replyMessage(replyToken, [{
                type: 'text',
                text: doc.data()
            }])
                .catch(err => console.log("ada error", err));
    }
}

export function handleLocation(message, replyToken, source, client, db) {
    const idUser = source.userId;
    return client.getProfile(idUser)
        .then(profile => {
            const profileId = profile.userId;
            const getDoc = db.collection('users').doc(profileId).get()
                .then(doc => {
                    const data = doc.data();
                    if (data.fLocationAwal === 1) {
                        client.replyMessage(replyToken, {
                            type: 'text',
                            text: `${message.latitude},${message.title},${message.longitude},${message.address}`
                        });
                        const refDb = db.collection('users').doc(profileId);
                        const dataMessage = [message.title.toString(), message.address.toString(), message.latitude.toString(), message.longitude.toString()];
                        const setAwal = refDb.collection('lokasi').doc('lokasiAwal').set({
                            'address': dataMessage[1],
                            'latitude': dataMessage[2],
                            'longitude': dataMessage[3],
                        }, {merge: true}).catch(err => console.log("Ada Eror", err));
                        const setFlag = refDb.set({
                            'fLocationAwal': 0
                        }, {merge: true});
                    }
                }).catch(err => console.log("Get Doc Error", err));
        }).catch(err => console.log("Error get User dari Location", err));
}