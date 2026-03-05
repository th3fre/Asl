const firebaseConfig = { apiKey: "AIzaSyBaym_8TLzuSUbV4FBV09YoONy_Es-mjWA", authDomain: "adsserver-d1cd4.firebaseapp.com", projectId: "adsserver-d1cd4", appId: "1:305913961609:web:fc72b4e9ff963170993a58" };
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// إعلانات Start.io
const STARTAPP_ID = "206266196";
if(typeof startapp !== 'undefined') {
    startapp.init(STARTAPP_ID);
    startapp.loadBanner();
}

const player = videojs('main-player', { fluid: true });

function showInterstitial() {
    if (typeof startapp !== 'undefined') {
        startapp.loadInterstitial();
        startapp.showInterstitial();
    }
}

function showPageWithAd(id) {
    showInterstitial();
    showPage(id);
    if(document.getElementById('sidebar').classList.contains('active')) toggleSidebar();
}

function toggleSidebar() {
    document.getElementById('sidebar').classList.toggle('active');
    const overlay = document.getElementById('sidebarOverlay');
    overlay.style.display = overlay.style.display === 'block' ? 'none' : 'block';
}

function showPage(id) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById(id).classList.add('active');
}

function checkServers(urlStr) {
    showInterstitial();
    const servers = urlStr.split(',');
    if (servers.length > 1) {
        document.getElementById('serverModal').style.display = 'flex';
        const list = document.getElementById('serverList');
        list.innerHTML = '';
        servers.forEach((url, i) => {
            list.innerHTML += `<button class="server-btn" onclick="playFinal('${url.trim()}')">سيرفر ${i + 1}</button>`;
        });
    } else { playFinal(urlStr.trim()); }
}

function playFinal(url) {
    document.getElementById('serverModal').style.display = 'none';
    document.getElementById('videoWrapper').style.display = 'block';
    player.src({ src: url, type: url.includes('m3u8') ? 'application/x-mpegURL' : 'video/mp4' });
    player.play();
}

function stopVideo() {
    player.pause();
    document.getElementById('videoWrapper').style.display = 'none';
}

function toggleTheme() {
    document.body.classList.toggle('light-mode');
}

// جلب البيانات من فايربيز
db.collection('sections').orderBy('order', 'asc').onSnapshot(snap => {
    const res = document.getElementById('sectionsContainer'); res.innerHTML = '';
    snap.forEach(doc => { res.innerHTML += `<button onclick="openSub('${doc.id}')" class="channel-button"><span>${doc.data().title}</span><i class="fas fa-chevron-left opacity-20 text-xs"></i></button>`; });
});

function openSub(id) {
    showPage('subPage');
    db.collection('items').where('sectionId', '==', id).onSnapshot(snap => {
        const res = document.getElementById('subContent'); res.innerHTML = '';
        snap.forEach(doc => { res.innerHTML += `<div class="card bg-[#161b22] p-3 rounded-xl text-center" onclick="checkServers('${doc.data().url}')"><img src="${doc.data().logo}" class="h-10 mx-auto mb-2"><p class="text-[10px] font-bold">${doc.data().name}</p></div>`; });
    });
}

db.collection('matches').onSnapshot(snap => {
    const container = document.getElementById('matchesContainer'); container.innerHTML = '';
    snap.forEach(doc => {
        const m = doc.data();
        container.innerHTML += `<div class="match-card" onclick="checkServers('${m.mUrl}')"><div class="flex justify-between items-center text-center"><div class="w-1/3"><img src="${m.logo1}" class="w-8 h-8 mx-auto"><p class="text-[10px] mt-1">${m.team1}</p></div><div class="text-green-500 font-bold text-sm">VS</div><div class="w-1/3"><img src="${m.logo2}" class="w-8 h-8 mx-auto"><p class="text-[10px] mt-1">${m.team2}</p></div></div></div>`;
    });
});
