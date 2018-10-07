import quickReply from "./quickReply";

export default function () {
    return {
        type: 'text',
        text: 'Sepertinya kamu butuh bantuan \udbc0\udc93, silahkan pilih menu dibawah ini ya \udbc0\udc30',
        quickReply: quickReply()
    }
}