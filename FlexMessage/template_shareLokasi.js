import quickReply from "./quickReply";

export default function (message) {
    return {
        type: 'text',
        text: `Terima kasih sudah share lokasimu \udbc0\udc33, sekarang kamu berada di ${message.address.toString()}`,
        quickReply: quickReply()
    }
}