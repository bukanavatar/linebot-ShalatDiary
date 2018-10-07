import moment from 'moment';

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
                    console.log(postback.params.date);
                    const liff = `line://app/1507502538-5MDgDEQO?user=${idUser}&&date=${moment(postback.params.date).format("YYYY-MM-DD").toString()}`;
                    client.replyMessage(replyToken, {
                        "type": "template",
                        "altText": `Buka statistik untuk tanggal ${moment(postback.params.date).format("DD MMMM YYYY")}?`,
                        "template": {
                            "type": "confirm",
                            "text": `Buka statistik untuk tanggal ${moment(postback.params.date).format("DD MMMM YYYY")}?`,
                            "actions": [
                                {
                                    "type": "uri",
                                    "label": "Iya",
                                    "uri": liff.toString()
                                },
                                {
                                    "type": "message",
                                    "label": "Tidak",
                                    "text": "tidak"
                                }
                            ]
                        }
                    })

            }
        });
}