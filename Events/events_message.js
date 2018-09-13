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
            const getDoc = db.collection('users').doc(profile.userId).get()
                .then(doc => {
                    const data = doc.data();
                    if (data.fLocationAwal === 1) {
                        const refDb = db.collection('users').doc(profile.userId);
                        const setDbAwal = refDb.collection('lokasi').doc('lokasiAwal')
                            .set({
                                title: message.title,
                                address: message.address,
                                latitude: message.latitude,
                                longitude: message.longitude
                            }).catch(err => console.log("Set DB Awal Error", err));
                        const setFlag = refDb.set({
                            fLocationAwal: 0
                        }, {merge: true}).catch(err => console.log("Set Flag Error", err));
                    }
                }).catch(err => console.log("Get Doc Error", err));
        }).catch(err => console.log("Error get User dari Location", err));
}