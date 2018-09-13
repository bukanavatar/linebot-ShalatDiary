import admin from 'firebase-admin';

import serviceAccount from '../shalat-diary-b25ad401ff6c.json';

export function follow(replyToken, source, client) {
    const idUser = source.userId;
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
    const db = admin.firestore();

    let profile = {};
    if (idUser) {
        return client.getProfile(idUser)
            .then(profile => {
                const dbRef = db.collection('users').doc(profile.userId);
                const setUser = dbRef.set({
                    'uid': profile.userId,
                    'displayName': profile.displayName
                });

                client.replyMessage(replyToken, [{
                    type: 'text',
                    text: `Halo ${profile.displayName}, terima kasih sudah menambahkan kami sebagai teman \udbc0\udc30, Shalat Diary merupakan chatbot yang memudahkan anda untuk memantau perkembangan shalat anda dari waktu ke waktu . Anda bisa melihat apakah lebih sering shalat sendiri, berjamaah atau bahkan tidak salat. Semoga bisa bermanfaat \udbc0\udc01`,
                }, {
                    type: "sticker",
                    packageId: "1",
                    stickerId: "144"
                }])
            }).catch(err => console.log(err));
    } else {
        return client.replyMessage(replyToken, `Bot can't use profile API without user ID`);
    }
}