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
        let API_URL = '';
        let respJadwalShalat;
        switch (message.text.toLowerCase()) {
            case  'jadwal shalat':
                //1 - Get Lokasi Awal
                const dbRef = await db.collection('users').doc(profileId).collection('lokasi').doc('lokasiAwal').get();
                const latitude = dbRef.data().latitude;
                const longitude = dbRef.data().longitude;
                const address = dbRef.data().address;
                const API_UNSPLASH = 'https://api.unsplash.com/photos/random?page=1&query=mosque&orientation=landscape&client_id=8927155d86c8a4f2f7ddc93bf355113f0a9f52e96e945d873456023e60c4ca20';
                let imageMosque = '';
                API_URL = `https://time.siswadi.com/pray/?lat=${latitude}&lng=${longitude}`;
                respJadwalShalat = await axios.get(API_URL);
                //2 - Get Random Image
                let respUnsplash = await axios.get(API_UNSPLASH);
                imageMosque = respUnsplash.data.urls.regular;
                //4 - Send Reply Message
                await client.replyMessage(replyToken, flex_jadwalShalat(imageMosque, address, respJadwalShalat));
                break;
            case 'tambah shalat':
                const dbRefTambah = await db.collection('users').doc(profileId).collection('lokasi').doc('lokasiAwal').get();
                const lat = dbRefTambah.data().latitude;
                const long = dbRefTambah.data().longitude;
                const API_JAM = `http://api.timezonedb.com/v2.1/get-time-zone?key=S0TR51M7YRLS&format=json&by=position&lat=${lat}&lng=${long}&time=${Math.ceil(timestamp / 1000)}`;
                console.log(lat, long);
                let respWaktuSekarang = await axios.get(API_JAM);
                console.log(respWaktuSekarang);
                API_URL = `https://time.siswadi.com/pray/?lat=${lat}&lng=${long}`;
                respJadwalShalat = await axios.get(API_URL);
                const waktuSekarang = moment(respWaktuSekarang.data.formatted, "YYYY-MM-DD HH:mm:ss").format("HH:mm").toString();
                tanggalSekarang = moment(respWaktuSekarang.data.formatted, "YYYY-MM-DD HH:mm:ss").format("YYYY-MM-DD").toString();
                console.log(respJadwalShalat);
                const waktuSubuh = respJadwalShalat.data.data.Fajr;
                const waktuDzuhur = respJadwalShalat.data.data.Dhuhr;
                const waktuAshar = respJadwalShalat.data.data.Asr;
                const waktuMaghrib = respJadwalShalat.data.data.Maghrib;
                const waktuIsya = respJadwalShalat.data.data.Isha;
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
                console.log("2");
                const tanggal = moment(tanggalSekarang);
                const dbRefTanggal = dbRef.collection('tanggal')
                    .doc(data.fTambahShalatKemarin === 1 ? tanggal.subtract(1, 'days').format("YYYY-MM-DD").toString() : tanggal.format("YYYY-MM-DD").toString());

                const getTanggal = await dbRefTanggal.get();
                console.log("2");
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
                    console.log("3");
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
                    console.log("4");
                    //Send reply message
                    await client.replyMessage(replyToken, {
                        type: 'text',
                        text: 'Berhasil Gan'
                    })
                } else {
                    await dbRefTanggal.set({
                        [shalatSekarang]: objectShalat
                    }, {merge: true});
                    console.log("5");
                    await dbRef.set({
                        'fTambahShalat': 0,
                        'fTambahShalatKemarin': 0,
                    }, {merge: true});
                    console.log("6");
                    await client.replyMessage(replyToken, {
                        type: 'text',
                        text: 'Berhasil Gan'
                    });
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
        const setFlagLocationZero = refDb.set({
            'fLocationAwal': 0
        }, {merge: true});

        if (data.fLocationAwal === 1) {
            await refDbLokasiAwal.set(objectGantiLokasi, {merge: true});
            await setFlagLocationZero;
            await client.replyMessage(replyToken, template_shareLokasi(message));
        } else if (data.fLocationGanti === 1) {
            await refDbLokasiAwal.set(objectGantiLokasi, {merge: true});
            await setFlagLocationZero;
            await client.replyMessage(replyToken, template_updateLokasi(message));
        }
    } catch (e) {
        console.log("Handle Location Error", e);
    }
}