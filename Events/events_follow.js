export async function follow(replyToken, source, client, db) {
    const idUser = source.userId;
    if (idUser) {
        try {
            const profile = await client.getProfile(idUser);
            const getDoc = await db.collection('users').doc(profile.userId).get();
            if (!getDoc.exists) {
                console.log("User Not Exist");
                const dbRef = await db.collection('users').doc(profile.userId);
                const setUser = dbRef.set({
                    'uid': profile.userId,
                    'displayName': profile.displayName,
                    'fLocationAwal': 1
                });
                callReplyMessage(profile, true);
            } else {
                console.log('User is Exist');
                callReplyMessage(profile, false)
            }
        } catch (e) {
            console.log("Ada error here", e);
        }
    } else {
        return client.replyMessage(replyToken, `Bot can't use profile API without user ID`);
    }

    function callReplyMessage(profile, userBaru) {
        let textReplyMessage = [{
            type: 'text',
            text: `Halo ${profile.displayName}, terima kasih sudah menambahkan kami sebagai teman \udbc0\udc30, Shalat Diary merupakan chatbot yang memudahkan anda untuk memantau perkembangan shalat anda dari waktu ke waktu . Anda bisa melihat apakah lebih sering shalat sendiri, berjamaah atau bahkan tidak salat. Semoga bisa bermanfaat \udbc0\udc01`,
        }, {
            type: "sticker",
            packageId: "1",
            stickerId: "114"
        }];
        if (userBaru) {
            textReplyMessage = [...textReplyMessage, {
                type: 'template',
                altText: 'Share Lokasi Awal',
                template: {
                    type: 'buttons',
                    thumbnailImageUrl: 'https://images.unsplash.com/photo-1533615767566-273ffe95ed17?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=030e680a09fbe23f188b56248a6e30e6&auto=format&fit=crop&w=1027&q=80',
                    title: 'Share Lokasimu',
                    text: 'Silahkan share lokasimu untuk keperluan chatbot ini',
                    actions: [
                        {label: 'Share Lokasi', type: 'location'}
                    ],
                },
            }];
            client.replyMessage(replyToken, textReplyMessage).catch(err => {
                console.log("Error Replying message", err);
            })
        } else {
            client.replyMessage(replyToken, textReplyMessage).catch(err => {
                console.log("Error Replying message", err);
            })
        }

    }
}