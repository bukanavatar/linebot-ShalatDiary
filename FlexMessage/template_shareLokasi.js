export default function (message) {
    return {
        type: 'text',
        text: `Terima kasih sudah share lokasimu, sekarang kamu berada di ${message.address.toString()}`,
        quickReply: {
            items: [{
                type: "action",
                action: {
                    type: "message",
                    label: "Jadwal Shalat",
                    text: "Jadwal Shalat"
                }
            }, {
                type: "action",
                action: {
                    type: "message",
                    label: "Tambah Record Shalat",
                    text: "tambah shalat"
                }
            }]
        }
    }
}