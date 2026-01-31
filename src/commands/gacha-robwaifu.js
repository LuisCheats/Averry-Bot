import { promises as fs } from 'fs';

const charactersFilePath = './src/json/characters.json';
let charactersCache = null;
let lastCacheLoad = 0;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutos

async function loadCharacters() {
    const now = Date.now();
    if (charactersCache && (now - lastCacheLoad) < CACHE_TTL) {
        return charactersCache;
    }
    
    const data = await fs.readFile(charactersFilePath, 'utf-8');
    charactersCache = JSON.parse(data);
    lastCacheLoad = now;
    return charactersCache;
}

function flattenCharacters(charactersData) {
    return Object.values(charactersData).flatMap(series => 
        Array.isArray(series.characters) ? series.characters : []
    );
}

let handler = async (m, { conn, usedPrefix, command, text }) => {
    const ctxErr = (global.rcanalx || {});
    const ctxWarn = (global.rcanalw || {});
    const ctxOk = (global.rcanalr || {});
    
    const cooldownTime = 8 * 60 * 60 * 1000;
    const robCooldown = 24 * 60 * 60 * 1000;

    try {
        const chatData = global.db?.data?.chats?.[m.chat] || {};
        if (!chatData.gacha && m.isGroup) {
            return await conn.reply(m.chat, 'ꕤ Los comandos de *Gacha* están desactivados en este grupo.\n\nUn *administrador* puede activarlos con el comando:\n» *' + usedPrefix + 'gacha on*', m, ctxWarn);
        }

        const currentUserData = global.db?.data?.users?.[m.sender] || {};
        if (!Array.isArray(currentUserData.characters)) {
            currentUserData.characters = [];
        }
        
        if (currentUserData.robCooldown == null) {
            currentUserData.robCooldown = 0;
        }
        if (!currentUserData.robVictims) {
            currentUserData.robVictims = {};
        }

        const currentTime = Date.now();
        const nextRobTime = currentUserData.robCooldown + cooldownTime;

        if (currentUserData.robCooldown > 0 && currentTime < nextRobTime) {
            const remainingSeconds = Math.ceil((nextRobTime - currentTime) / 1000);
            const hours = Math.floor(remainingSeconds / 3600);
            const minutes = Math.floor(remainingSeconds % 3600 / 60);
            const seconds = remainingSeconds % 60;
            
            let timeLeft = '';
            if (hours > 0) timeLeft += hours + ' hora' + (hours !== 1 ? 's' : '') + ' ';
            if (minutes > 0) timeLeft += minutes + ' minuto' + (minutes !== 1 ? 's' : '') + ' ';
            if (seconds > 0 || timeLeft === '') timeLeft += seconds + ' segundo' + (seconds !== 1 ? 's' : '');
            
            return await conn.reply(m.chat, 'ꕤ Debes esperar *' + timeLeft.trim() + '* para usar *' + (usedPrefix + command) + '* de nuevo.', m, ctxWarn);
        }

        let targetUser = null;
        
        if (m.mentionedJid && m.mentionedJid.length > 0) {
            targetUser = m.mentionedJid[0];
        }
        else if (m.quoted) {
            targetUser = m.quoted.sender;
        }
        else if (text) {
            const mentionRegex = /@?(\d{5,}|[\w.-]+@[\w.-]+)/g;
            const matches = text.match(mentionRegex);
            if (matches && matches.length > 0) {
                const potentialUser = matches[0].replace('@', '');
                if (potentialUser.includes('@')) {
                    targetUser = potentialUser;
                } else {
                    targetUser = potentialUser + '@s.whatsapp.net';
                }
            }
        }

        if (!targetUser || typeof targetUser !== 'string' || !targetUser.includes('@')) {
            return await conn.reply(m.chat, 'ꕤ Por favor, cita o menciona al usuario a quien quieras robarle una waifu.\n> Ejemplo: *' + usedPrefix + command + ' @usuario*', m, ctxErr);
        }

        if (targetUser === m.sender) {
            const currentUsername = await (async () => {
                try {
                    return currentUserData.name?.trim() || 
                           (await conn.getName(m.sender)) || 
                           m.sender.split('@')[0];
                } catch {
                    return m.sender.split('@')[0];
                }
            })();
            return await conn.reply(m.chat, 'ꕤ No puedes robarte a ti mismo, *' + currentUsername + '*.', m, ctxErr);
        }

        const lastRobTime = currentUserData.robVictims[targetUser];
        if (lastRobTime && currentTime - lastRobTime < robCooldown) {
            const targetUsername = await (async () => {
                try {
                    const targetData = global.db?.data?.users?.[targetUser] || {};
                    return targetData.name?.trim() || 
                           (await conn.getName(targetUser)) || 
                           targetUser.split('@')[0];
                } catch {
                    return targetUser.split('@')[0];
                }
            })();
            return await conn.reply(m.chat, 'ꕤ Ya robaste a *' + targetUsername + '* hoy. Solo puedes robarle a alguien *una vez cada 24 horas*.', m, ctxWarn);
        }

        const targetUserData = global.db?.data?.users?.[targetUser] || {};
        if (!Array.isArray(targetUserData.characters)) {
            targetUserData.characters = [];
        }
        
        if (targetUserData.characters.length === 0) {
            const targetUsername = await (async () => {
                try {
                    return targetUserData.name?.trim() || 
                           (await conn.getName(targetUser)) || 
                           targetUser.split('@')[0];
                } catch {
                    return targetUser.split('@')[0];
                }
            })();
            return await conn.reply(m.chat, 'ꕤ *' + targetUsername + '* no tiene waifus que puedas robar.', m, ctxWarn);
        }

        const success = Math.random() < 0.9;

        currentUserData.robCooldown = currentTime;
        currentUserData.robVictims[targetUser] = currentTime;

        if (!success) {
            const targetUsername = await (async () => {
                try {
                    return targetUserData.name?.trim() || 
                           (await conn.getName(targetUser)) || 
                           targetUser.split('@')[0];
                } catch {
                    return targetUser.split('@')[0];
                }
            })();
            return await conn.reply(m.chat, 'ꕤ El intento de robo ha fallado. *' + targetUsername + '* defendió a su waifu heroicamente.', m, ctxWarn);
        }

        const stolenCharacterId = targetUserData.characters[Math.floor(Math.random() * targetUserData.characters.length)];
        
        if (!global.db.data.characters) global.db.data.characters = {};
        const characterData = global.db.data.characters[stolenCharacterId] || {};
        
        const characterName = characterData.name || `ID:${stolenCharacterId}`;

        characterData.user = m.sender;
        characterData.name = characterName;

        targetUserData.characters = targetUserData.characters.filter(id => id !== stolenCharacterId);
        if (!currentUserData.characters.includes(stolenCharacterId)) {
            currentUserData.characters.push(stolenCharacterId);
        }

        if (currentUserData.sales?.[stolenCharacterId]?.user === targetUser) {
            delete currentUserData.sales[stolenCharacterId];
        }

        if (targetUserData.favorite === stolenCharacterId) {
            delete targetUserData.favorite;
        }

        const getUsername = async (userId) => {
            try {
                const userData = global.db?.data?.users?.[userId] || {};
                return userData.name?.trim() || 
                       (await conn.getName(userId)) || 
                       userId.split('@')[0];
            } catch {
                return userId.split('@')[0];
            }
        };

        const [currentUsername, targetUsername] = await Promise.all([
            getUsername(m.sender),
            getUsername(targetUser)
        ]);

        await conn.reply(m.chat, 'ꕤ *' + currentUsername + '* ha robado a *' + characterName + '* del harem de *' + targetUsername + '*.', m, ctxOk);

    } catch (error) {
        console.error('Error en handler de robo:', error);
        await conn.reply(m.chat, '⚠︎ Se ha producido un problema.\n> Usa *' + usedPrefix + 'report* para informarlo.\n\n' + error.message, m, ctxErr);
    }
};

handler.help = ['robwaifu @usuario'];
handler.tags = ['gacha'];
handler.command = ['robwaifu', 'robarwaifu'];
handler.group = true;

export default handler;