const fs = require('fs');
const path = require('path');

let sessionFile = null;

function lstat(p) {
    try {
        return fs.lstatSync(p);
    } catch (err) {
        return null;
    }
}

// Menerima JSON sesi langsung ({...}) atau JSON yang di-encode base64.
// Wajib punya refresh_token, karena token inilah yang dipakai auto-refresh.
function parseSession(raw) {
    if (!raw || typeof raw !== 'string') return null;
    const text = raw.trim();
    if (!text) return null;
    const json = text.startsWith('{') ? text : Buffer.from(text, 'base64').toString('utf8');
    const parsed = JSON.parse(json);
    if (!parsed || typeof parsed !== 'object' || !parsed.refresh_token) return null;
    return parsed;
}

function seedFromEnv(target) {
    const session = parseSession(process.env.GOPAY_SESSION_JSON);
    if (!session) return false;
    fs.writeFileSync(target, JSON.stringify(session, null, 2));
    return true;
}

// SESSION_FILE milik sessionManager dipatok ke __dirname, jadi tidak bisa
// dipindah murni lewat env. Kalau GOPAY_SESSION_FILE diisi (mis. volume
// Railway /data), kita ganti SESSION_FILE dengan symlink ke path persisten itu
// supaya baca-tulis auto-refresh otomatis mengarah ke sana.
function initSessionStorage(defaultFile) {
    const localFile = path.resolve(defaultFile);
    const override = process.env.GOPAY_SESSION_FILE ? path.resolve(process.env.GOPAY_SESSION_FILE) : null;
    sessionFile = override || localFile;

    if (override && override !== localFile) {
        fs.mkdirSync(path.dirname(override), { recursive: true });
        const localStat = lstat(localFile);
        if (localStat && !localStat.isSymbolicLink() && !fs.existsSync(override)) {
            fs.copyFileSync(localFile, override);
        }
        if (localStat) fs.rmSync(localFile, { force: true });
        if (!lstat(localFile)) fs.symlinkSync(override, localFile);
    }

    const seeded = !fs.existsSync(sessionFile) && seedFromEnv(sessionFile);
    return { sessionFile, durable: Boolean(override), seeded, configured: fs.existsSync(sessionFile) };
}

function getSessionFile() {
    return sessionFile;
}

function writeSession(session) {
    if (!sessionFile) throw new Error('Penyimpanan sesi belum diinisialisasi');
    fs.mkdirSync(path.dirname(sessionFile), { recursive: true });
    fs.writeFileSync(sessionFile, JSON.stringify(session, null, 2));
    return sessionFile;
}

module.exports = { initSessionStorage, getSessionFile, writeSession, parseSession };
