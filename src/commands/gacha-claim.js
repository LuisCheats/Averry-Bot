import { promises as fs } from 'fs';

const charactersFilePath = './src/json/characters.json';
let charactersCache = null;
let lastCacheLoad = 0;
const CACHE_TTL = 5 * 60 * 1000;

async function loadCharacters() {
    const now = Date.now();
    if (charactersCache && (now - lastCacheLoad) < CACHE_TTL) {
        return charactersCache;
    }

    // Nota: Se asume que el archivo existe o será creado por otros comandos.
    // Aquí solo se lee directamente.
    const data = await fs.readFile(charactersFilePath, 'utf-8');
    charactersCache = JSON.parse(data);
    lastCacheLoad = now;
    return charactersCache;
}

function getCharacterById(characterId, charactersData) {
    return Object.values(charactersData)
        .flatMap(series => series.characters || [])
        .find(character => String(character.id) === String(characterId)); // Asegura la comparación de tipo String
}

let handler = async (m, { conn, usedPrefix, command, quoted }) => {
    const ctxErr = (global.rcanalx || {});
    const ctxWarn = (global.rcanalw || {});
    const ctxOk = (global.rcanalr || {});

    // Cooldown de 30 minutos para reclamar, se mantiene
    const claimCooldown = 30 * 60 * 1000;

    try {
        const chatData = global.db?.data?.chats?.[m.chat] || {};
        if (!chatData.gacha && m.isGroup) {
            return await conn.reply(m.chat, 'ꕤ Los comandos de *Gacha* están desactivados en este grupo.\n\nUn *administrador* puede activarlos con el comando:\n» *' + usedPrefix + 'gacha on*', m, ctxWarn);
        }

        const currentUserData = global.db?.data?.users?.[m.sender] || {};
        const currentTime = Date.now();

        if (currentUserData.lastClaim && currentTime < currentUserData.lastClaim + claimCooldown) {
            const remainingSeconds = Math.ceil((currentUserData.lastClaim + claimCooldown - currentTime) / 1000);
            const minutes = Math.floor(remainingSeconds / 60);
            const seconds = remainingSeconds % 60;

            let timeLeft = '';
            if (minutes > 0) timeLeft += minutes + ' minuto' + (minutes !== 1 ? 's' : '') + ' ';
            if (seconds > 0 || timeLeft === '') timeLeft += seconds + ' segundo' + (seconds !== 1 ? 's' : '');

            return await conn.reply(m.chat, 'ꕤ Debes esperar *' + timeLeft.trim() + '* para usar *' + (usedPrefix + command) + '* de nuevo.', m, ctxWarn);
        }

        const lastRolledCharacter = chatData.lastRolledCharacter;
        if (!lastRolledCharacter || !lastRolledCharacter.id) {
            return await conn.reply(m.chat, 'ꕤ No hay ningún personaje disponible para reclamar. Usa *' + usedPrefix + 'roll* primero.', m, ctxErr);
        }

        const characterId = lastRolledCharacter.id;

        const charactersData = await loadCharacters();
        const characterData = getCharacterById(characterId, charactersData);

        if (!characterData) {
            return await conn.reply(m.chat, 'ꕤ Personaje no encontrado en characters.json', m, ctxErr);
        }

        if (!global.db.data.characters) global.db.data.characters = {};
        if (!global.db.data.characters[characterId]) {
            global.db.data.characters[characterId] = {};
        }

        const dbCharacter = global.db.data.characters[characterId];
        
        // --- VALIDACIÓN DE RECLAMO Y EXPIRACIÓN ---
        
        // 1. Verificar si ya fue reclamado (dbCharacter.user es el nuevo owner, lastRolledCharacter.claimer es quien lo roleó)
        if (dbCharacter.user) {
            const getClaimantName = async (userId) => {
                try {
                    const userData = global.db?.data?.users?.[userId] || {};
                    return userData.name?.trim() ||
                           (await conn.getName(userId)) ||
                           userId.split('@')[0];
                } catch {
                    return userId.split('@')[0];
                }
            };

            const claimantName = await getClaimantName(dbCharacter.user);
            return await conn.reply(m.chat, 'ꕤ El personaje *' + (dbCharacter.name || characterData.name) + '* ya ha sido reclamado por *' + claimantName + '*', m, ctxWarn);
        }
        
        // 2. Verificar expiración total (2 minutos y 30 segundos)
        if (lastRolledCharacter.expiresAt && currentTime > lastRolledCharacter.expiresAt) {
            const expiredTime = Math.ceil((currentTime - lastRolledCharacter.expiresAt) / 1000);
            
            // Limpiar el personaje del chat para que se pueda hacer un nuevo roll
            chatData.lastRolledCharacter = null;
            chatData.lastRolledId = null;
            
            return await conn.reply(m.chat, 'ꕤ El personaje ha expirado hace *' + expiredTime + 's*. Usa *' + usedPrefix + 'roll* para obtener uno nuevo.', m, ctxWarn);
        }
        
        // 3. Verificar protección de 30 segundos para el Roller
        const protectedUntil = lastRolledCharacter.protectedUntil;
        const claimer = lastRolledCharacter.claimer; // Quien lo roleó
        
        if (protectedUntil && claimer && currentTime < protectedUntil) {
            // Está en periodo de protección exclusiva (primeros 30s)
            if (m.sender !== claimer) {
                const rollerName = '@' + claimer.split('@')[0];
                
                const remainingProtectionTime = Math.ceil((protectedUntil - currentTime) / 1000);
                
                return await conn.reply(m.chat, `ꕤ El personaje está *protegido*.\nSolo ${rollerName} puede reclamarlo en los próximos *${remainingProtectionTime}s*.`, m, ctxWarn);
            }
            // Si el sender es el claimer, la reclamación procede.
        }
        
        // --- PROCESO DE RECLAMO ---

        // Asignar el nuevo dueño (user) y limpiar la data temporal de expiración
        dbCharacter.user = m.sender;
        dbCharacter.claimedAt = currentTime;
        dbCharacter.name = characterData.name;
        dbCharacter.value = characterData.value || 100;
        dbCharacter.votes = dbCharacter.votes || 0;
        // Limpiar las propiedades de roll para evitar reclamos futuros del mismo ID
        dbCharacter.expiresAt = null; 
        dbCharacter.claimer = null; 
        dbCharacter.protectedUntil = null;
        
        // Limpiar el personaje del chat para que se pueda hacer un nuevo roll
        chatData.lastRolledCharacter = null;
        chatData.lastRolledId = null;


        currentUserData.lastClaim = currentTime;

        if (!Array.isArray(currentUserData.characters)) {
            currentUserData.characters = [];
        }
        if (!currentUserData.characters.includes(characterId)) {
            currentUserData.characters.push(characterId);
        }

        const getCurrentUsername = async () => {
            try {
                return currentUserData.name?.trim() ||
                       (await conn.getName(m.sender)) ||
                       m.sender.split('@')[0];
            } catch {
                return m.sender.split('@')[0];
            }
        };

        const currentUsername = await getCurrentUsername();

        const claimMessage = chatData.claimMessage ?
            chatData.claimMessage
                .replace(/€user/g, '*' + currentUsername + '*')
                .replace(/€character/g, '*' + dbCharacter.name + '*') :
            'ꕤ *' + dbCharacter.name + '* ha sido reclamado por *' + currentUsername + '*';

        await conn.reply(m.chat, claimMessage, m, ctxOk);

    } catch (error) {
        console.error('Error en handler de claim:', error);
        await conn.reply(m.chat, '⚠︎ Se ha producido un problema.\n> Usa *' + usedPrefix + 'report* para informarlo.\n\n' + error.message, m, ctxErr);
    }
};

handler.help = ['claim'];
handler.tags = ['gacha'];
handler.command = ['claim', 'c', 'reclamar'];
handler.group = true;

export default handler;