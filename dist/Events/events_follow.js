"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function (replyToken, source, client) {
    var idUser = source.userId;
    if (idUser) {
        return client.getProfile(idUser).then(function (profile) {
            client.replyMessage(replyToken, [{
                type: 'text',
                text: "Halo " + profile.displayName + ", terimakasih sudah menambahkan kami sebagai teman \uDBC0\uDC30, Shalat Diary merupakan chatbot yang memudahkan anda untuk memantau perkembangan shalat anda dari waktu ke waktu. Anda bisa melihat apakah lebih sering shalat sendiri, berjamaah atau bahkan tidak salat. Semoga bisa bermanfaat"
            }, {
                type: "sticker",
                packageId: "1",
                stickerId: "144"
            }]);
        }).catch(function (err) {
            return console.log(err);
        });
    } else {
        return client.replyMessage(replyToken, "Bot can't use profile API without user ID");
    }
};