import quickReply from "./quickReply";

export default function (imageMosque, address, res) {
    return {
        type: "flex",
        altText: "Jadwal Shalat hari ini",
        quickReply: quickReply(),
        contents: {
            type: "bubble",
            hero: {
                type: "image",
                url: imageMosque,
                size: "full",
                aspectRatio: "20:13",
                aspectMode: "cover",
                action: {
                    type: "uri",
                    uri: "http://linecorp.com/"
                }
            },
            body: {
                type: "box",
                layout: "vertical",
                contents: [
                    {
                        type: "text",
                        text: "Jadwal Shalat",
                        weight: "bold",
                        color: "#409665",
                        size: "xl"
                    },
                    {
                        type: "text",
                        margin: "sm",
                        text: `${address}`,
                        wrap: true,
                        size: "xs",
                        color: "#b2b2b2"
                    },
                    {
                        type: "box",
                        layout: "vertical",
                        margin: "lg",
                        spacing: "sm",
                        contents: [
                            {
                                type: "box",
                                layout: "horizontal",
                                spacing: "xl",
                                contents: [
                                    {
                                        type: "text",
                                        text: "Subuh",
                                        color: "#aaaaaa",
                                        size: "xs",
                                        flex: 3
                                    },

                                    {
                                        type: "text",
                                        text: `${res.timings.Fajr.substring(0, 6)}`,
                                        wrap: true,
                                        align: "end",
                                        color: "#666666",
                                        size: "sm",
                                        flex: 3
                                    }
                                ]
                            },
                            {
                                type: "box",
                                layout: "horizontal",
                                spacing: "xl",
                                contents: [
                                    {
                                        type: "text",
                                        text: "Dzuhur",
                                        color: "#aaaaaa",
                                        size: "xs",
                                        flex: 3
                                    },

                                    {
                                        type: "text",
                                        text: `${res.timings.Dhuhr.substring(0, 6)}`,
                                        wrap: true,
                                        align: "end",
                                        color: "#666666",
                                        size: "sm",
                                        flex: 3
                                    }
                                ]
                            },
                            {
                                type: "box",
                                layout: "horizontal",
                                spacing: "xl",
                                contents: [
                                    {
                                        type: "text",
                                        text: "Ashar",
                                        color: "#aaaaaa",
                                        size: "xs",
                                        flex: 3
                                    },

                                    {
                                        type: "text",
                                        text: `${res.timings.Asr.substring(0, 6)}`,
                                        wrap: true,
                                        align: "end",
                                        color: "#666666",
                                        size: "sm",
                                        flex: 3
                                    }
                                ]
                            },
                            {
                                type: "box",
                                layout: "horizontal",
                                spacing: "xl",
                                contents: [
                                    {
                                        type: "text",
                                        text: "Maghrib",
                                        color: "#aaaaaa",
                                        size: "xs",
                                        flex: 3
                                    },

                                    {
                                        type: "text",
                                        text: `${res.timings.Maghrib.substring(0, 6)}`,
                                        wrap: true,
                                        align: "end",
                                        color: "#666666",
                                        size: "sm",
                                        flex: 3
                                    }
                                ]
                            },
                            {
                                type: "box",
                                layout: "horizontal",
                                spacing: "xl",
                                contents: [
                                    {
                                        type: "text",
                                        text: "Isya",
                                        color: "#aaaaaa",
                                        size: "xs",
                                        flex: 3
                                    },

                                    {
                                        type: "text",
                                        text: `${res.timings.Isha.substring(0, 6)}`,
                                        wrap: true,
                                        align: "end",
                                        color: "#666666",
                                        size: "sm",
                                        flex: 3
                                    }
                                ]
                            }
                        ]
                    }
                ]
            },
            footer: {
                type: "box",
                layout: "vertical",
                spacing: "sm",
                contents: [
                    {
                        type: "button",
                        style: "primary",
                        height: "sm",
                        action: {
                            type: "postback",
                            label: "Ganti Lokasi",
                            data: "changeLocation"
                        }
                    },
                    {
                        type: "spacer",
                        size: "sm"
                    }
                ],
                flex: 0
            }
        }
    }
}