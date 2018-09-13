export function handlePostback(replyToken, source, postback, client, db) {
    const idUser = source.userId;
    return client.getProfile(idUser)
        .then(profile => {
            const profileId = profile.userId;
            switch (postback.data) {
                case 'changeLocation':
                    const dbref = db.collection('users').doc(profileId).set({
                        'fLocationGanti': 1
                    }, {merge: true}).catch(err => console.log("disini ada error", err));
                    client.replyMessage(replyToken, {
                        type: "text",
                        text: "Silahkan share lokasi anda"
                    });
            }
        });
}