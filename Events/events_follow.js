export function follow(replyToken, source, client, db) {
    const idUser = source.userId;

    if (idUser) {
        return client.getProfile(idUser)
            .then(profile => {
                const getDoc = db.collection('users').doc(profile.userId).get()
                    .then(doc => {
                        if (!doc.exists) {
                            console.log('User Not Exist');
                            const dbRef = db.collection('users').doc(profile.userId);
                            const setUser = dbRef.set({
                                'uid': profile.userId,
                                'displayName': profile.displayName,
                                'fLocationAwal': 1
                            });
                            callReplyMessage(profile);
                        } else {
                            console.log('User is Exist');
                            callReplyMessage(profile)
                        }
                    }).catch(err => console.log(err));
            }).catch(err => console.log("Error getting document:", err));
    } else {
        return client.replyMessage(replyToken, `Bot can't use profile API without user ID`);
    }

    function callReplyMessage(profile) {
        client.replyMessage(replyToken, [{
            type: 'text',
            text: `Halo ${profile.displayName}, terima kasih sudah menambahkan kami sebagai teman \udbc0\udc30, Shalat Diary merupakan chatbot yang memudahkan anda untuk memantau perkembangan shalat anda dari waktu ke waktu . Anda bisa melihat apakah lebih sering shalat sendiri, berjamaah atau bahkan tidak salat. Semoga bisa bermanfaat \udbc0\udc01`,
        }, {
            type: "sticker",
            packageId: "1",
            stickerId: "114"
        }, {
            type: 'template',
            altText: 'Silahkan Share Lokasimu yang sekarang',
            template: {
                type: 'buttons',
                thumbnailImageUrl: 'https://images.unsplash.com/photo-1533615767566-273ffe95ed17?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=030e680a09fbe23f188b56248a6e30e6&auto=format&fit=crop&w=1027&q=80',
                imageAspectRatio: 'rectangle',
                imageSize: 'cover',
                title: 'Share Lokasimu',
                actions: [{
                    type: 'location',
                    label: 'Klik disini untuk share lokasi'
                }]
            }
        }]).catch(err => {
            console.log("Error Replying message", err);
        })
    }
}