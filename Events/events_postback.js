export function handlePostback(replyToken, source, postback, client, db) {
    const idUser = source.userId;
    console.log(postback.data);
    return client.getProfile(idUser)
        .then(profile => {
            const profileId = profile.userId;
            switch (postback.data) {
                case 'changeLocation':
                    const dbref = db.collection('users').doc(profileId).set({
                        'fLocationGanti': 1
                    }, {merge: true}).catch(err => console.log("Error ketika set DBref LocationGanti", err));
                    client.replyMessage(replyToken, {
                        type: "text",
                        text: "Silahkan share lokasimu yang baru",
                        quickReply: {
                            items: [{
                                type: "action",
                                action: {
                                    type: "location",
                                    label: "Kirim Lokasi Baru"
                                }
                            }]
                        }
                    });
                    break;
                case 'customdate':
                    client.replyMessage(replyToken, {
                        type: 'text',
                        text: "berhasil"
                    })

            }
        });
}