export default function (message) {
    return {
        type: 'text',
        text: `Lokasi kamu sudah diperbarui, sekarang kamu berada di ${message.address.toString()}`,
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
                    label: "Test",
                    text: "test"
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