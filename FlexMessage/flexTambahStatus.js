export default function (waktuShalat) {
    return {
        type: "flex",
        altText: "Tambahkan Status Shalat kamu",
        contents: {
            type: 'bubble',
            hero: {
                type: 'image',
                url: 'https://firebasestorage.googleapis.com/v0/b/shalatdiary.appspot.com/o/Tambah-Shalat.jpg?alt=media&token=c1893b77-3f82-42b1-89c2-0dbe5d2957d4',
                size: 'full',
                aspectRatio: '20:13',
                aspectMode: 'cover'
            },
            body: {
                type: 'box',
                layout: 'vertical',
                spacing: 'md',
                action: {
                    type: 'uri',
                    uri: 'https://linecorp.com'
                },
                contents: [
                    {
                        type: 'text',
                        text: `Bagaimana Shalat ${waktuShalat} mu?`,
                        wrap: true,
                        size: 'md',
                        align: 'start',
                        weight: 'bold'
                    },
                    {
                        type: 'text',
                        text: 'Silhakan pilih sesuai status shalat kamu',
                        wrap: true,
                        color: '#aaaaaa',
                        size: 'xs'
                    }
                ]
            },
            footer: {
                type: 'box',
                layout: 'vertical',
                spacing: 'sm',
                contents: [
                    {
                        type: 'box',
                        layout: 'horizontal',
                        spacing: 'sm',
                        contents: [
                            {
                                type: 'button',
                                style: 'primary',
                                height: 'sm',
                                color: '#2ed573',
                                flex: 3,
                                action: {
                                    type: 'message',
                                    label: 'Jamaah',
                                    text: 'jamaah'
                                }
                            },
                            {
                                type: 'button',
                                style: 'primary',
                                height: 'sm',
                                color: '#ffa502',
                                flex: 3,
                                action: {
                                    type: 'message',
                                    label: 'Sendiri',
                                    text: 'sendiri'
                                }
                            }
                        ]
                    },
                    {
                        type: 'box',
                        layout: 'horizontal',
                        spacing: 'sm',
                        contents: [
                            {
                                type: 'button',
                                style: 'primary',
                                height: 'sm',
                                color: '#1e90ff',
                                flex: 3,
                                action: {
                                    type: 'message',
                                    label: 'Telat',
                                    text: 'telat'
                                }
                            },
                            {
                                type: 'button',
                                style: 'primary',
                                height: 'sm',
                                color: '#ff4757',
                                flex: 3,
                                action: {
                                    type: 'message',
                                    label: 'Tidak Shalat',
                                    text: 'tidak shalat'
                                }
                            }
                        ]
                    }
                ]
            }
        }
    }
}
