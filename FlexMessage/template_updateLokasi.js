import quickReply from "./quickReply";

export default function (message) {
    return {
        type: 'text',
        text: `Lokasi kamu sudah diperbarui \udbc0\udc33, sekarang kamu berada di ${message.address.toString()}`,
        quickReply: quickReply()
    }
}