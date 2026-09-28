import { Client, LocalAuth, MessageMedia } from 'whatsapp-web.js';
import qrcode from 'qrcode';
import path from 'path';
import fs from 'fs';

// Store global status for companies (so hot reloads don't kill it if running)
const globalStatus: Record<string, { status: string, qr: string | null, client: Client | null }> = (global as any).whatsappStatuses || {};
if (!(global as any).whatsappStatuses) {
    (global as any).whatsappStatuses = globalStatus;
}

export const getSessionPath = (companyId: string) => {
    const dirName = ['whatsapp', 'sessions'].join('_');
    return path.join(process.cwd(), dirName, `session-${companyId}`);
};

export const getWhatsAppStatus = async (companyId: string) => {
    if (globalStatus[companyId] && globalStatus[companyId].status !== 'DISCONNECTED') {
        return { status: globalStatus[companyId].status, qr: globalStatus[companyId].qr };
    }
    // If not running, check if session folder exists (meaning they logged in previously)
    if (fs.existsSync(getSessionPath(companyId))) {
        return { status: 'CONNECTED_OFFLINE', qr: null }; // Means we have a session but browser is closed to save RAM
    }
    return { status: 'DISCONNECTED', qr: null };
};

export const initWhatsApp = async (companyId: string) => {
    // If already running, return
    if (globalStatus[companyId]?.client) {
        return;
    }

    globalStatus[companyId] = { status: 'STARTING', qr: null, client: null };

    const dirName = ['whatsapp', 'sessions'].join('_');
    const client = new Client({
        authStrategy: new LocalAuth({
            clientId: companyId,
            dataPath: path.join(process.cwd(), dirName)
        }),
        puppeteer: {
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-gpu']
        }
    });

    globalStatus[companyId].client = client;

    client.on('qr', async (qr) => {
        globalStatus[companyId].status = 'QR_READY';
        globalStatus[companyId].qr = await qrcode.toDataURL(qr);
    });

    client.on('ready', () => {
        globalStatus[companyId].status = 'CONNECTED';
        globalStatus[companyId].qr = null;
    });

    client.on('authenticated', () => {
        globalStatus[companyId].status = 'AUTHENTICATED';
    });

    client.on('auth_failure', () => {
        globalStatus[companyId].status = 'DISCONNECTED';
    });

    client.on('disconnected', () => {
        globalStatus[companyId].status = 'DISCONNECTED';
        globalStatus[companyId].client = null;
    });

    try {
        await client.initialize();
    } catch (e) {
        globalStatus[companyId] = { status: 'ERROR', qr: null, client: null };
        console.error('WhatsApp Init Error:', e);
    }
};

export const logoutWhatsApp = async (companyId: string) => {
    const client = globalStatus[companyId]?.client;
    if (client) {
        try {
            await client.logout();
            await client.destroy();
        } catch(e) {}
    }
    
    const sessionPath = getSessionPath(companyId);
    if (fs.existsSync(sessionPath)) {
        fs.rmSync(sessionPath, { recursive: true, force: true });
    }
    
    globalStatus[companyId] = { status: 'DISCONNECTED', qr: null, client: null };
};

export const sendWhatsAppMessage = async (companyId: string, phone: string, message: string, mediaBase64?: string, mediaMimeType?: string, mediaFilename?: string) => {
    return new Promise(async (resolve, reject) => {
        let client = globalStatus[companyId]?.client;
        let needsToWaitForReady = false;
        
        // If no client, we need to initialize (On-Demand)
        if (!client) {
            needsToWaitForReady = true;
            const dirName = ['whatsapp', 'sessions'].join('_');
            client = new Client({
                authStrategy: new LocalAuth({
                    clientId: companyId,
                    dataPath: path.join(process.cwd(), dirName)
                }),
                puppeteer: {
                    headless: true,
                    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-gpu']
                }
            });
            globalStatus[companyId] = { status: 'STARTING', qr: null, client };

            // If it asks for QR while sending, it means session is lost/invalid
            client.on('qr', async () => {
                client?.destroy();
                globalStatus[companyId] = { status: 'DISCONNECTED', qr: null, client: null };
                reject(new Error('WhatsApp is not connected. Please go to settings and connect first.'));
            });

            try {
                client.initialize().catch(e => reject(e));
            } catch(e) {
                return reject(e);
            }
        }

        const executeSend = async () => {
            try {
                let sanitizedNumber = phone.replace(/\D/g, '');
                
                // Comprehensive Saudi / International number sanitization
                if (sanitizedNumber.startsWith('00')) {
                    sanitizedNumber = sanitizedNumber.substring(2);
                }
                
                if (sanitizedNumber.startsWith('05') && sanitizedNumber.length === 10) {
                    sanitizedNumber = '966' + sanitizedNumber.substring(1);
                } else if (sanitizedNumber.startsWith('5') && sanitizedNumber.length === 9) {
                    sanitizedNumber = '966' + sanitizedNumber;
                } else if (sanitizedNumber.startsWith('96605')) {
                    sanitizedNumber = '9665' + sanitizedNumber.substring(5);
                }
                
                // Bypass getNumberId as it throws minified error 't: t' from WhatsApp Web internal scripts
                const serializedId = sanitizedNumber + '@c.us';

                console.log("WHATSAPP SENDING TO:", serializedId);

                if (mediaBase64) {
                    const base64Data = mediaBase64.includes(',') ? mediaBase64.split(',')[1] : mediaBase64;
                    console.log(`MEDIA SEND: filename=${mediaFilename}, mimeType=${mediaMimeType}, base64Length=${base64Data.length}`);
                    const media = new MessageMedia(mediaMimeType || 'application/pdf', base64Data, mediaFilename || 'document.pdf');
                    
                    const res = await client!.sendMessage(serializedId, media, { caption: message });
                    console.log("WHATSAPP SEND WITH MEDIA RESULT SUCCESS");
                } else {
                    console.log("MEDIA IS EMPTY, SENDING TEXT ONLY");
                    const res = await client!.sendMessage(serializedId, message);
                    console.log("WHATSAPP SEND TEXT RESULT SUCCESS");
                }

                resolve(true);
            } catch (e: any) {
                console.error("WhatsApp executeSend Error:", e);
                console.error("WhatsApp Stack:", e?.stack);
                let msg = e?.message || e?.toString() || "Unknown WhatsApp Error";
                reject(new Error(msg));
            }
        };

        if (needsToWaitForReady) {
            client.on('ready', () => {
                globalStatus[companyId].status = 'CONNECTED';
                globalStatus[companyId].qr = null;
                executeSend();
            });
            
            // Timeout if ready doesn't fire in 45 seconds
            setTimeout(() => {
                if (globalStatus[companyId]?.status === 'STARTING') {
                    reject(new Error("WhatsApp connection timed out. Please try again."));
                }
            }, 45000);
        } else {
            // Already initialized and presumably ready
            executeSend();
        }
    });
};
