const { makeid } = require('./gen-id');
const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();
const pino = require('pino');
const logger = pino({ level: 'info' });
const {
    makeWASocket,
    useMultiFileAuthState,
    delay,
    Browsers,
    makeCacheableSignalKeyStore,
    fetchLatestBaileysVersion,
    DisconnectReason,
} = require('@whiskeysockets/baileys');
const axios = require('axios');

function removeFile(filePath) {
    if (!fs.existsSync(filePath)) return false;
    fs.rmSync(filePath, { recursive: true, force: true });
}

function generateRandomText() {
    const prefix = "3EB";
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let randomText = prefix;
    for (let i = prefix.length; i < 22; i++) {
        randomText += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return randomText;
}

async function GIFTED_MD_PAIR_CODE(id, num, res) {
    const { state, saveCreds } = await useMultiFileAuthState(path.join(__dirname, 'temp', id));
    const { version, isLatest } = await fetchLatestBaileysVersion();
    try {
        const sock = makeWASocket({
            auth: {
                creds: state.creds,
                keys: makeCacheableSignalKeyStore(state.keys, logger),
            },
            printQRInTerminal: false,
            generateHighQualityLinkPreview: true,
            logger: logger,
            syncFullHistory: false,
            browser: Browsers.macOS('Safari'),
        });

        if (!sock.authState.creds.registered) {
            await delay(1500);
            num = num.replace(/[^0-9]/g, '');
            const code = await sock.requestPairingCode(num);
            if (!res.headersSent) {
                res.send({ code });
            }
        }

        sock.ev.on('creds.update', saveCreds);
        sock.ev.on('connection.update', async (update) => {
            const { connection, lastDisconnect } = update;

            if (connection === 'open') {
                await delay(5000);
                const credsFilePath = path.join(__dirname, 'temp', id, 'creds.json');
                try {
                    const credsData = fs.readFileSync(credsFilePath, 'utf-8');
                    const base64Session = Buffer.from(credsData).toString('base64');
                    const md = "ANJU-XPRO~" + base64Session;
                    const codeMessage = await sock.sendMessage(sock.user.id, { text: md });
                    
                    let cap = `
🔐 *𝙳𝙾 𝙽𝙾𝚃 𝚂𝙷𝙰𝚁𝙴 𝚃𝙷𝙸𝚂 𝙲𝙾𝙳𝙴 𝚆𝙸𝚃𝙷 𝙰𝙽𝚈𝙾𝙽𝙴!!*

Use this code to create your own *Danuzz-MD* WhatsApp User Bot. 🤖

🛠️ *To add your SESSION_ID:*  
1. Open the \`session.js\` file in the repo.  
2. Paste your session like this:  
\`\`\`js
module.exports = {
  SESSION_ID: 'PASTE_YOUR_SESSION_ID_HERE'
}
\`\`\`  
3. Save the file and run the bot. ✅

⚠️ *NEVER SHARE YOUR SESSION ID WITH ANYONE!*
`;
                    await sock.sendMessage(sock.user.id, {
                        text: cap,
                        contextInfo: {
                            externalAdReply: {
                                title: "QUEEN ANJU XPRO ✅",
                                thumbnailUrl: "https://telegra.ph/file/adc46970456c26cad0c15.jpg",
                                sourceUrl: "https://whatsapp.com/channel/0029Vaj5XmgFXUubAjlU5642",
                                mediaType: 2,
                                renderLargerThumbnail: true,
                                showAdAttribution: true,
                            },
                        },
                    }, { quoted: codeMessage });

                    await sock.ws.close();
                    removeFile(path.join(__dirname, 'temp', id));
                    logger.info(`👤 ${sock.user.id} 𝗖𝗼𝗻𝗻𝗲𝗰𝘁𝗲𝗱 ✅ 𝗥𝗲𝘀𝘁𝗮𝗿𝘁𝗶𝗻𝗴 𝗽𝗿𝗼𝗰𝗲𝘀𝘀...`);
                    process.exit(0);
                } catch (error) {
                    logger.error(`Error in connection update: ${error.message}`);
                    const errorMessage = await sock.sendMessage(sock.user.id, { text: error.message });
                    let cap = `
🔐 *𝙳𝙾 𝙽𝙾𝚃 �𝚂𝙷𝙰𝚁𝙴 𝚃𝙷𝙸𝚂 𝙲𝙾𝙳𝙴 �𝚆𝙸𝚃𝙷 𝙰𝙽𝚈𝙾𝙽𝙴!!*

Use this code to create your own *𝚀𝚄𝙴𝙴𝙽 𝙰𝙽𝙹𝚄 𝚇𝙿𝚁𝙾* WhatsApp User Bot. 🤖

📂 *WEBSITE:*  
👉 https://xpro-botz-ofc.vercel.app/

🛠️ *To add your SESSION_ID:*  
1. Open the \`session.js\` file in the repo.  
2. Paste your session like this:  
\`\`\`js
module.exports = {
  SESSION_ID: 'PASTE_YOUR_SESSION_ID_HERE'
}
\`\`\`  
3. Save the file and run the bot. ✅

⚠️ *NEVER SHARE YOUR SESSION ID WITH ANYONE!*
`;
                    await sock.sendMessage(sock.user.id, {
                        text: cap,
                        contextInfo: {
                            externalAdReply: {
                                title: "Danuzz-MD",
                                thumbnailUrl: "https://sdmntpreastus.oaiusercontent.com/files/00000000-c35c-61f9-a531-d36dae2240f8/raw?se=2025-08-25T08%3A24%3A15Z&sp=r&sv=2024-08-04&sr=b&scid=a85b21f3-845f-5c44-bf41-5d6c174dd115&skoid=02b7f7b5-29f8-416a-aeb6-99464748559d&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2025-08-24T18%3A26%3A43Z&ske=2025-08-25T18%3A26%3A43Z&sks=b&skv=2024-08-04&sig=6w%2BxsmXLhbhnlMRHrTiy1WqGdxSvErGUNt6PKK1b5wI%3D",
                                mediaType: 2,
                                renderLargerThumbnail: true,
                                showAdAttribution: true,
                            },
                        },
                    }, { quoted: errorMessage });
                }
            } else if (connection === 'close' && lastDisconnect?.error?.output?.statusCode !== 401) {
                logger.warn('Connection closed. Retrying...');
                await delay(10000);
                GIFTED_MD_PAIR_CODE(id, num, res);
            }
        });
    } catch (error) {
        logger.error(`Error in GIFTED_MD_PAIR_CODE: ${error.message}`);
        removeFile(path.join(__dirname, 'temp', id));
        if (!res.headersSent) {
            res.send({ code: "❗ Service Unavailable" });
        }
    }
}

router.get('/', async (req, res) => {
    const id = makeid();
    const num = req.query.number;
    if (!num) {
        return res.status(400).send({ error: 'Number is required' });
    }
    await GIFTED_MD_PAIR_CODE(id, num, res);
});

setInterval(() => {
    logger.info('☘️ 𝗥𝗲𝘀𝘁𝗮𝗿𝘁𝗶𝗻𝗴 𝗽𝗿𝗼𝗰𝗲𝘀𝘀...');
    process.exit(0);
}, 1800000);

module.exports = router;
