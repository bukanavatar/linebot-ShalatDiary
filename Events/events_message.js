export function handleText(message, replyToken, source, client) {
    switch (message.text.toLowerCase()) {
        case 'test':
            client.replyMessage(replyToken, [{
                type: 'text',
                text: 'Tes ini adalah tes emot \udbc0\udc30'
            }]);
    }
}