'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.handleText = handleText;

function handleText(message, replyToken, source, client) {
    switch (message.text.toLowerCase()) {
        case 'test':
            client.replyMessage(replyToken, [{
                type: 'text',
                text: 'Tes ini adalah tes emot \uDBC0\uDC30'
            }]);
    }
}