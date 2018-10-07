export default function () {
    return {
        type: 'text',
        text: 'Sepertinya kamu butuh bantuan, silahkan pilih menu dibawah ini ya',
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
                    label: "Statistik Shalat",
                    text: "Statistik Shalat"
                }
            }, {
                type: "action",
                action: {
                    type: "message",
                    label: "Tambah Record Shalat",
                    text: "Statistik Shalat"
                }
            }]
        }
    }
}