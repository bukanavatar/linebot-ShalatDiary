export function handleText(message, replyToken, source, client, db) {
    switch (message.text.toLowerCase()) {
        case 'test':
            const getDoc = db.collection('users').doc('U5b8038d4acf2c3c808e89bd8fe75f281').get()
                .then(doc => {
                    console.log(doc.data());
                    sendMessage(doc);
                });
    }

    function sendMessage(doc) {
        client.replyMessage(replyToken, [{
            type: 'text',
            text: doc.data()
        }])
            .catch(err => console.log("ada error", err));
    }
}

export function handleLocation(message, replyToken, source, client, flag) {

    replyToken
}