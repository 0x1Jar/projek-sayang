# 🪐 Universe of Love — Halisa Nurul Zakia ✨

Sebuah website hadiah / tribute romantis dengan estetika **Modern Neon Minimalism** (berdasarkan referensi konsep *"Universe Of Love"* dari TikTok @frontiend).

Didesain khusus untuk sang kekasih tercinta: **Halisa Nurul Zakia**.

---

## 🌟 Fitur Utama & Interaksi

1. **Interactive Cosmic Galaxy Canvas**:
   - Ratusan partikel bintang bercahaya neon (*Electric Cyan*, *Hot Neon Pink*, *Holographic Violet*, dan *Starlight White*).
   - Efek garis konstelasi dinamis saat bintang berdekatan.
   - Bintang jatuh (*meteor streaks*) yang melintas melintasi angkasa.
   - Gravitasi kursor mouse & sentuhan jari layar sentuh.

2. **Smooth Animations & Micro-Interactions**:
   - **Smooth Scroll Reveal**: Setiap seksi dan kartu meluncur halus ke layar dengan transisi *blur-to-focus* saat di-scroll.
   - **Interactive 3D Tilt**: Kartu-kartu kaca merespons pergerakan kursor mouse secara 3D (*perspective tilt*).
   - **Stardust Trail**: Taburan debu bintang neon berkilau saat mouse digerakkan atau layar disentuh.

3. **Hero Centerpiece & Constellation Heart**:
   - Tipografi modern neon glow dengan nama **HALISA NURUL ZAKIA**.
   - Jantung kosmik berdenyut dengan cincin orbit neon 3D.
   - Klik atau sentuh jantung untuk meletupkan taburan bintang cinta (*stardust burst*) dan memainkan melodi.

4. **Interaksi Input-Output: Starlight Wish Transmitter**:
   - **Input**: Halisa dapat memilih sinyal suasana hati (*Mood*: Kangen, Bahagia, Butuh Peluk, Pengen Jajan, Bisikan Rahasia) dan mengetikkan pesan atau harapan ke dalam *neon textarea*.
   - **Output Realtime**: 
     - Sistem membalas otomatis dengan pesan cinta romantis khusus yang diketik secara langsung (*smooth typewriter animation*).
     - Menembakkan bintang jatuh (*meteor streak*) melintasi langit galaksi!
     - Menyimpan pesan ke dalam **Papan Transmisi Bintang (Local Vault)** yang tersimpan secara lokal di browser dan bisa dibaca kapan saja oleh kalian berdua.

5. **Interaksi Input-Output: Cosmic Love Frequency Scanner**:
   - **Input**: Halisa menyentuh dan menahan tombol pemindai biometrik selama 2 detik (*Hold to scan*).
   - **Output Realtime**:
     - Animasi lingkaran neon SVG berputar dan persentase sinkronisasi menghitung naik dari `0%` hingga `1000%`.
     - Denting lonceng kosmik (*celestial chime*), getaran haptic, dan ledakan stardust.
     - Membuka pengumuman rahasia: *"1000% INFINITE LOVE MATCH — Ditakdirkan bersama selamanya!"*.

6. **Live Orbit Counter (Penghitung Waktu Hubungan)**:
   - Menghitung secara otomatis dan *real-time* jumlah hari, jam, menit, dan detik sejak kalian pertama bersama.

7. **Constellation of Reasons ("Why You Are My Universe")**:
   - Kartu-kartu kaca minimalis beraksen neon yang berisi alasan-alasan manis mengapa Halisa adalah duniamu yang paling berharga.

8. **Aesthetic Memory Gallery**:
   - Galeri memori dengan bingkai kosmik modern bergradasi neon.
   - Siap diganti dengan foto-foto kenangan asli kalian.

9. **Interactive Holographic Love Capsule (Surat Rahasia)**:
   - Kapsul digital terenkripsi yang bisa diklik untuk membuka surat cinta bernuansa holografik khusus untuk Halisa.
   - Tombol interaktif *"Kirim Peluk & Cium Virtual"* yang memunculkan hujan hati neon.

10. **The Celestial Question ("Will You Always Stay In My Universe?")**:
    - Pertanyaan interaktif:
      - Tombol **"I Wanna Be Yours, Forever! ✨"**: Memunculkan perayaan kembang api stardust cinta dan memutar musik.
      - Tombol **"Hmm, mikir dulu... 😜"**: Tombol jahil yang otomatis menghindar atau lari saat kursor diarahkan atau disentuh!

11. **Dual-Mode Ambient Music Player**:
    - **Mode File Asli**: Cukup masukkan file lagu favorit (seperti lagu *"I Wanna Be Yours"*) dengan nama `music.mp3` ke dalam folder ini.
    - **Mode Fallback Otomatis (Web Audio API)**: Jika belum ada file MP3, website secara otomatis memainkan alunan synthesizer lofi ambient romantis (*chord progression Fmaj7 - Dm7*) yang menenangkan tanpa perlu koneksi internet.

---

## 🚀 Cara Menjalankan Website di Laptop / Komputer

Kamu bisa langsung melihat hasilnya:
1. Buka folder ini di Finder / File Explorer.
2. Klik ganda file **`index.html`** untuk membukanya langsung di browser (Chrome, Safari, Edge, Firefox).

Atau menggunakan lokal server Python:
```bash
python3 -m http.server 3000
```
Lalu buka browser di `http://localhost:3000`.

---

## 🌐 Cara Deploy ke Vercel via GitHub

Website ini sudah 100% siap di-deploy ke Vercel dengan konfigurasi file `vercel.json` bawaan:

### Langkah 1: Buat Repository Baru di GitHub
1. Buka [github.com/new](https://github.com/new).
2. Beri nama repository (misal: `universe-halisa` atau `projek-sayang`).
3. Pilih **Public** (atau Private), lalu klik **Create repository**.

### Langkah 2: Hubungkan & Push Repository Lokal
Buka Terminal di Mac dan jalankan perintah berikut:
```bash
cd "/Volumes/DATA/projek sayang"
git remote add origin https://github.com/USERNAME_GITHUBMU/universe-halisa.git
git branch -M main
git push -u origin main
```
*(Ganti `USERNAME_GITHUBMU` dengan username GitHub milikmu).*

### Langkah 3: Import ke Vercel
1. Buka [vercel.com](https://vercel.com) dan login menggunakan akun GitHub-mu.
2. Klik tombol **"Add New..."** > **"Project"**.
3. Pilih repository `universe-halisa` yang baru saja kamu push.
4. Pada bagian *Framework Preset*, pilih **Other** (karena website ini adalah Pure Static HTML/CSS/JS).
5. Klik **"Deploy"**.

Dalam waktu kurang dari 30 detik, website kamu sudah aktif secara global dengan domain gratis dari Vercel (contoh: `https://universe-halisa.vercel.app`) dan siap kamu kirimkan ke Halisa! ✨

---

*Selamat merayakan cinta di galaksi yang indah bersama Halisa Nurul Zakia! 💖🪐*
