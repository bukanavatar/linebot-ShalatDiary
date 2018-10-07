import axios from 'axios';
import moment from 'moment';
import flexTambahStatus from "../FlexMessage/flexTambahStatus";
import template_shareLokasi from "../FlexMessage/template_shareLokasi";
import template_updateLokasi from "../FlexMessage/template_updateLokasi";
import flex_jadwalShalat from "../FlexMessage/flex_jadwalShalat";
import template_defaultMessage from "../FlexMessage/template_defaultMessage";

let tanggalSekarang = '';
let shalatSekarang = '';
const waktuShalat = ['Jamaah', 'Sendiri', 'Telat', 'Tidak Shalat'];
let profileId = '';

export async function handleText(message, replyToken, source, timestamp, client, db) {
    try {
        const idUser = source.userId;
        let profile = await client.getProfile(idUser);
        profileId = profile.userId;
        let API_URL, respJadwalShalat, bulanSekarang, dbRef, latitude, longitude;
        switch (message.text.toLowerCase()) {
            case 'statistik shalat':
                await client.replyMessage(replyToken, {
                    "type": "template",
                    "altText": "this is a image carousel template",
                    "template": {
                        "type": "image_carousel",
                        "columns": [
                            {
                                "imageUrl": "https://example.com/bot/images/item1.jpg",
                                "action": {
                                    "type": "postback",
                                    "label": "Buy",
                                    "data": "action=buy&itemid=111"
                                }
                            },
                            {
                                "imageUrl": "https://example.com/bot/images/item2.jpg",
                                "action": {
                                    "type": "message",
                                    "label": "Yes",
                                    "text": "yes"
                                }
                            },
                            {
                                "imageUrl": "https://example.com/bot/images/item3.jpg",
                                "action": {
                                    "type": "uri",
                                    "label": "View detail",
                                    "uri": "http://example.com/page/222"
                                }
                            }
                        ]
                    }
                });
                break;
            case  'jadwal shalat':
                //1 - Get Lokasi Awal
                dbRef = await db.collection('users').doc(profileId).collection('lokasi').doc('lokasiAwal').get();
                latitude = dbRef.data().latitude;
                longitude = dbRef.data().longitude;
                const address = dbRef.data().address;
                const API_UNSPLASH = 'https://api.unsplash.com/photos/random?page=1&query=mosque&orientation=landscape&client_id=8927155d86c8a4f2f7ddc93bf355113f0a9f52e96e945d873456023e60c4ca20';
                let imageMosque = '';
                //http://api.aladhan.com/v1/calendar?latitude=51.508515&longitude=-0.1254872&method=2&month=4&year=2017
                API_URL = `http://api.aladhan.com/v1/calendar?latitude=${latitude}&longitude=${longitude}&method=2`;
                respJadwalShalat = await axios.get(API_URL);
                //2 - Get Random Image
                let respUnsplash = await axios.get(API_UNSPLASH);
                const API_TIME = `http://api.timezonedb.com/v2.1/get-time-zone?key=S0TR51M7YRLS&format=json&by=position&lat=${latitude}&lng=${longitude}&time=${Math.ceil(timestamp / 1000)}`;
                let respWaktuSekarangA = await axios.get(API_TIME);
                bulanSekarang = moment(respWaktuSekarangA.data.formatted, "YYYY-MM-DD HH:mm:ss").format("M").toString();
                imageMosque = respUnsplash.data.urls.regular;
                //4 - Send Reply Message
                let todayPrayer = respJadwalShalat.data.data[parseInt(bulanSekarang) - 1];
                await client.replyMessage(replyToken, flex_jadwalShalat(imageMosque, address, todayPrayer));
                break;
            case 'tambah shalat':
                dbRef = await db.collection('users').doc(profileId).collection('lokasi').doc('lokasiAwal').get();
                latitude = dbRef.data().latitude;
                longitude = dbRef.data().longitude;
                const API_JAM = `http://api.timezonedb.com/v2.1/get-time-zone?key=S0TR51M7YRLS&format=json&by=position&lat=${latitude}&lng=${longitude}&time=${Math.ceil(timestamp / 1000)}`;
                let respWaktuSekarang = await axios.get(API_JAM);
                const waktuSekarang = moment(respWaktuSekarang.data.formatted, "YYYY-MM-DD HH:mm:ss").format("HH:mm").toString();
                bulanSekarang = moment(respWaktuSekarang.data.formatted, "YYYY-MM-DD HH:mm:ss").format("M").toString();
                tanggalSekarang = moment(respWaktuSekarang.data.formatted, "YYYY-MM-DD HH:mm:ss").format("YYYY-MM-DD").toString();
                API_URL = `http://api.aladhan.com/v1/calendar?latitude=${latitude}&longitude=${longitude}&method=2`;
                respJadwalShalat = await axios.get(API_URL);
                const waktuSubuh = respJadwalShalat.data.data[parseInt(bulanSekarang) - 1].timings.Fajr.substring(0, 6);
                const waktuDzuhur = respJadwalShalat.data.data[parseInt(bulanSekarang) - 1].timings.Dhuhr.substring(0, 6);
                const waktuAshar = respJadwalShalat.data.data[parseInt(bulanSekarang) - 1].timings.Asr.substring(0, 6);
                const waktuMaghrib = respJadwalShalat.data.data[parseInt(bulanSekarang) - 1].timings.Maghrib.substring(0, 6);
                const waktuIsya = respJadwalShalat.data.data[parseInt(bulanSekarang) - 1].timings.Isha.substring(0, 6);
                if (waktuSekarang > waktuSubuh && waktuSekarang < waktuDzuhur) {
                    await kirimTambahShalat("Subuh", profileId, false);
                } else if (waktuSekarang > waktuDzuhur && waktuSekarang < waktuAshar) {
                    await kirimTambahShalat("Dzuhur", profileId, false);
                } else if (waktuSekarang > waktuAshar && waktuSekarang < waktuMaghrib) {
                    await kirimTambahShalat("Ashar", profileId, false);
                } else if (waktuSekarang > waktuMaghrib && waktuSekarang < waktuIsya) {
                    await kirimTambahShalat("Maghrib", profileId, false);
                } else if (waktuSekarang > waktuIsya && waktuSekarang < "23:59") {
                    await kirimTambahShalat("Isya", profileId, false);
                } else if (waktuSekarang > "00:00" && waktuSekarang < waktuSubuh) {
                    await kirimTambahShalat("Isya", profileId, true);
                }
                break;
            case'jamaah':
                await setTambahShalat(waktuShalat[0], 80);
                break;
            case 'sendiri':
                await setTambahShalat(waktuShalat[1], 60);
                break;
            case 'telat':
                await setTambahShalat(waktuShalat[2], 40);
                break;
            case 'tidak shalat':
                await setTambahShalat(waktuShalat[3], 20);
                break;
            default:
                await client.replyMessage(replyToken, template_defaultMessage());
        }
    } catch (e) {
        console.log("Ada error Handle Text", e);
    }

    async function setTambahShalat(waktuShalatA, value) {
        const dbRef = db.collection('users').doc(profileId);
        try {
            const dbSnapshot = await dbRef.get();
            console.log(dbSnapshot.data());
            const data = dbSnapshot.data();
            //Only Executed if Flag
            if (data.fTambahShalat && data.fTambahShalat === 1) {
                const tanggal = moment(tanggalSekarang);
                const dbRefTanggal = dbRef.collection('tanggal')
                    .doc(data.fTambahShalatKemarin === 1 ? tanggal.subtract(1, 'days').format("YYYY-MM-DD").toString() : tanggal.format("YYYY-MM-DD").toString());

                const getTanggal = await dbRefTanggal.get();
                const objectShalat = {
                    'status': waktuShalatA,
                    'value': value
                };
                if (!getTanggal.exists) {
                    const objectBelum = {
                        'status': 'Belum Diisi',
                        'value': 0
                    };
                    await dbRefTanggal.set({
                        'Subuh': objectBelum,
                        'Dzuhur': objectBelum,
                        'Ashar': objectBelum,
                        'Maghrib': objectBelum,
                        'Isya': objectBelum,
                    }, {merge: true});
                    //Set Shalat
                    await dbRefTanggal.set({
                        //Inget Ang ini ada 2 dibawah juga habis else
                        [shalatSekarang]: objectShalat
                    }, {merge: true});
                    //Set Flag
                    await dbRef.set({
                        fTambahShalat: 0,
                        fTambahShalatKemarin: 0,
                    }, {merge: true});
                    //Send reply message
                    await client.replyMessage(replyToken, {
                        type: 'text',
                        text: 'Berhasil Gan'
                    });

                } else {
                    await dbRefTanggal.set({
                        [shalatSekarang]: objectShalat
                    }, {merge: true});
                    await dbRef.set({
                        'fTambahShalat': 0,
                        'fTambahShalatKemarin': 0,
                    }, {merge: true});
                    switch (waktuShalatA) {
                        case 'Jamaah':
                            await client.replyMessage(replyToken, {
                                type: 'text',
                                text: 'Baguss!!!\udbc0\udc2d pertahankan shalat berjamaahnya. Jangan lupa ajak teman-temanmu untuk menunaikan shalat berjamaah'
                            });
                            break;
                        case 'Telat':
                            await client.replyMessage(replyToken, {
                                type: 'text',
                                text: 'Baguss!!!\udbc0\udc2d pertahankan shalat berjamaahnya. Jangan lupa ajak teman-temanmu untuk menunaikan shalat berjamaah'
                            });
                            break;
                        case 'Sendiri':
                            await client.replyMessage(replyToken, [{
                                type: 'text',
                                text: 'Alhamdulillah \udbc0\udc90, bisa ditingkatkan lagi dengan sering shalat berjamaah di Masjid ya.\n\nDari Anas radhiyallahu ‘anhu bahwa Rasulullah shallallahu ‘alaihi wa sallam pada suatu malam mengakhirkan shalat Isya sampai tengah malam. Kemudian beliau menghadap kami setelah shalat, lalu bersabda,\n\nصَلاَةُ الْجَمَاعَةِ أَفْضَلُ مِنْ صَلاَةِ الْفَذِّ بِسَبْعٍ وَعِشْرِينَ دَرَجَةً\n\n“Shalat jamaah lebih baik 27 derajat dibanding shalat sendirian.” (HR. Bukhari, no. 645 dan Muslim, no. 650)"'
                            }]);
                            break;
                        case 'Tidak Shalat':
                            await client.replyMessage(replyToken, [{
                                type: 'text',
                                text: 'Astagfirullah \udbc0\udc85 \nNabi Shallallahu’alaihi Wasallam bersabda \nمَنْ حَافَظَ عَلَيْهَا كَانَتْ لَهُ نُوْرًا وَبُرْهَانًا وَنَجَاةً يَوْمَ الْقِيَامَةِ. \n“Barangsiapa yang menjaga shalat, dijadikan baginya cahaya, petunjuk dan keselamatan di hari kiamat.”'
                            }, {
                                type: 'text',
                                text: 'Mulailah untuk menjaga shalatnya ya \udbc0\udc7f'
                            }]);
                            break;
                    }
                }
            }
        } catch (e) {
            console.log("Error", e);
        }
    }

    async function kirimTambahShalat(waktuShalat, profileId, waktuKemarin) {
        const dbRef = db.collection('users').doc(profileId);
        shalatSekarang = waktuShalat;
        if (waktuKemarin) {
            //Set Flag kalau kemarin isya lewat jam 12
            await dbRef.set({
                'fTambahShalatKemarin': 1
            }, {merge: true});
        }
        //Set flag tambah shalat
        await dbRef.set({
            'fTambahShalat': 1
        }, {merge: true});
        try {
            await client.replyMessage(replyToken, flexTambahStatus(waktuShalat));
        } catch (e) {
            console.log("Ada error ketika kirim pesan tambah shalat", e);
        }
    }
}

export async function handleLocation(message, replyToken, source, client, db) {
    const idUser = source.userId;
    let profile = await client.getProfile(idUser);
    try {
        const profileId = profile.userId;
        let getDoc = await db.collection('users').doc(profileId).get();

        const data = getDoc.data();
        const refDb = db.collection('users').doc(profileId);
        const refDbLokasiAwal = refDb.collection('lokasi').doc('lokasiAwal');
        const objectGantiLokasi = {
            'address': message.address.toString(),
            'latitude': message.latitude.toString(),
            'longitude': message.longitude.toString(),
        };


        if (data.fLocationAwal === 1) {
            await refDbLokasiAwal.set(objectGantiLokasi, {merge: true});
            console.log("1");
            await refDb.set({
                'fLocationAwal': 0
            }, {merge: true});
            console.log("2");
            await client.replyMessage(replyToken, template_shareLokasi(message));
        } else if (data.fLocationGanti === 1) {
            await refDbLokasiAwal.set(objectGantiLokasi, {merge: true});
            console.log("1");
            await refDb.set({
                'fLocationGanti': 0
            }, {merge: true});
            console.log("2");
            await client.replyMessage(replyToken, template_updateLokasi(message));
        } else {
            await client.replyMessage(replyToken, template_defaultMessage());
        }
    } catch (e) {
        console.log("Handle Location Error", e);
    }
}