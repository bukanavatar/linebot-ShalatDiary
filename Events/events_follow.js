export default function (replyToken, source, client) {
    const idUser = source.userId;
    if (idUser) {
        return client.getProfile(idUser)
            .then(profile => {
                client.replyMessage(replyToken, [{
                    type: 'text',
                    text: `Halo ${profile.displayName}, terimakasih sudah menambahkan kami sebagai teman \udbc0\udc30, Shalat Diary merupakan chatbot yang memudahkan anda untuk memantau perkembangan shalat anda dari waktu ke waktu. Anda bisa melihat apakah lebih sering shalat sendiri, berjamaah atau bahkan tidak salat. Semoga bisa bermanfaat`,
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