
export function handleText(message, replyToken, source, client) {
    switch (message.text.toLowerCase()) {
        case 'test':
            const getDoc = db.collection('users').doc(profile.userId).get()
                .then(doc => {
                    console.log(doc.data());
                    client.replyMessage(replyToken, [{
                        type: 'text',
                        text: doc.data()
                    }]);
                });
    }
}

export function handleLocation(message, replyToken, source, client, flag) {

    replyToken
}