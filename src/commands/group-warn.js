import db from '../../lib/database.js'

const handler = async (m, { conn, text, command, usedPrefix }) => {
    const ctxErr = (global.rcanalx || {})
    const ctxWarn = (global.rcanalw || {})
    const ctxOk = (global.rcanalr || {})
    
    try {
        const pp = await conn.profilePictureUrl(m.chat, 'image').catch(() => 'https://files.catbox.moe/xr2m6u.jpg')
        
        // CORRECCIÓN: Mejorar la detección del usuario objetivo
        let who
        if (m.mentionedJid && m.mentionedJid.length > 0) {
            who = m.mentionedJid[0]
        } else if (m.quoted) {
            who = m.quoted.sender
        } else if (text) {
            // Extraer mención del texto si existe
            const mentionMatch = text.match(/@(\d+)/)
            if (mentionMatch) {
                who = mentionMatch[1] + '@s.whatsapp.net'
            }
        }
        
        const user = global.db.data.users[m.sender]
        const usuario = conn.user.jid
        const groupInfo = await conn.groupMetadata(m.chat)
        const ownerGroup = groupInfo.owner || m.chat.split`-`[0] + '@s.whatsapp.net'
        const ownerBot = global.owner[0] ? (Array.isArray(global.owner[0]) ? global.owner[0][0] : global.owner[0]) + '@s.whatsapp.net' : null

        const chatData = global.db.data.chats[m.chat] || (global.db.data.chats[m.chat] = {})
        const warnLimit = chatData.warnLimit || 3
        
        switch (command) {
            case 'advertencia': 
            case 'warn': 
            case 'addwarn': {
                if (!who) {
                    return conn.reply(m.chat, `ꕤ Debés mencionar o citar un mensaje de un usuario para aplicar una advertencia.\n> Ejemplo: *${usedPrefix + command} @usuario (motivo | opcional)*`, m, ctxErr)
                }
                
                // CORRECCIÓN: Mejorar extracción del motivo
                let motivo = 'Sin especificar'
                if (text) {
                    // Remover las menciones del texto para obtener solo el motivo
                    const textWithoutMentions = text.replace(/@\d+/g, '').trim()
                    if (textWithoutMentions) {
                        motivo = textWithoutMentions
                    }
                }
                
                if (who === conn.user.jid) return conn.reply(m.chat, `ꕤ No puedo ponerle advertencias al bot.`, m, ctxWarn)
                if (who === ownerGroup) return conn.reply(m.chat, `ꕤ No puedo darle advertencias al propietario del grupo.`, m, ctxWarn)
                if (ownerBot && who === ownerBot) return conn.reply(m.chat, `ꕤ No puedo darle advertencias al propietario del bot.`, m, ctxWarn)
                
                if (!global.db.data.users[who]) global.db.data.users[who] = {}
                const targetUser = global.db.data.users[who]
                targetUser.warn = (targetUser.warn || 0) + 1
                
                // CORRECCIÓN: Mostrar correctamente el @usuario
                const username = who.split('@')[0]
                await conn.reply(m.chat, `*@${username}* recibió una advertencia en este grupo!\nMotivo: ${motivo}\n*Advertencias: ${targetUser.warn}/${warnLimit}*`, m, { 
                    mentions: [who]
                })
                
                if (targetUser.warn >= warnLimit) {
                    targetUser.warn = 0
                    await conn.reply(m.chat, `ꕤ ¡Te lo advertí varias veces!\n*@${username}* superó las *${warnLimit}* advertencias, ahora será eliminado/a.`, m, { 
                        mentions: [who]
                    })
                    await conn.groupParticipantsUpdate(m.chat, [who], 'remove')
                }
                break
            }
            
            case 'delwarn': 
            case 'unwarn': {
                if (!who) return conn.reply(m.chat, `ꕤ Etiqueta a un usuario para quitarle las advertencias.`, m, ctxErr)
                if (who === conn.user.jid) return
                
                if (!global.db.data.users[who]) global.db.data.users[who] = {}
                const targetUser = global.db.data.users[who]
                if (targetUser.warn === 0 || !targetUser.warn) return conn.reply(m.chat, `ꕤ El usuario tiene 0 advertencias.`, m, ctxWarn)
                
                targetUser.warn -= 1
                const username = who.split('@')[0]
                await conn.reply(m.chat, `${targetUser.warn === 1 ? `*@${username}*` : `ꕤ *@${username}*`} Se le quitó una advertencia.\n*ADVERTENCIAS ${targetUser.warn}/${warnLimit}*`, m, { 
                    mentions: [who]
                })
                break
            }
            
            case 'listadv': 
            case 'advlist': {
                const users = global.db.data.users
                const adv = Object.entries(users).filter(([jid, u]) => u.warn && u.warn > 0)
                const listadvs = `❀ Usuarios Advertidos\n\n*Total : ${adv.length} Usuarios*${adv.length > 0 ? '\n' + adv.map(([jid, user]) => `*●* @${jid.split`@`[0]} : *(${user.warn}/${warnLimit})*`).join('\n') : '\n*No hay usuarios advertidos*'}\n\n⚠︎ Límite de advertencias: *${warnLimit}*`
                await conn.sendFile(m.chat, pp, 'img.jpg', listadvs, m, null, { mentions: conn.parseMention(listadvs) })
                break
            }
            
            case 'setwarnlimit': 
            case 'warnlimit': {
                if (!text || isNaN(text) || parseInt(text) < 1 || parseInt(text) > 10) {
                    return conn.reply(m.chat, `ꕤ Debes especificar un número válido entre 1 y 10.\n> Ejemplo: *${usedPrefix + command} 5*`, m, ctxErr)
                }
                
                const newLimit = parseInt(text)
                chatData.warnLimit = newLimit
                
                await conn.reply(m.chat, `ꕤ Límite de advertencias actualizado: *${warnLimit} → ${newLimit}*\n\nLos usuarios serán eliminados al alcanzar *${newLimit}* advertencias.`, m, ctxOk)
                break
            }
            
            case 'getwarnlimit': 
            case 'warninfo': {
                await conn.reply(m.chat, `ꕤ Límite actual de advertencias: *${warnLimit}*\n\nLos usuarios serán eliminados al alcanzar *${warnLimit}* advertencias.`, m, ctxOk)
                break
            }
        }
    } catch (error) {
        console.error(error)
        conn.reply(m.chat, `ꕤ Se ha producido un problema.\n> Usa *${usedPrefix}report* para informarlo.\n\n${error.message}`, m, ctxErr)
    }
}

handler.command = [
    'advertencia', 'warn', 'addwarn', 
    'delwarn', 'unwarn', 
    'listadv', 'advlist',
    'setwarnlimit', 'warnlimit',
    'getwarnlimit', 'warninfo'
]

handler.help = [
    'warn @usuario [motivo]',
    'delwarn @usuario', 
    'listadv',
    'setwarnlimit <número>',
    'getwarnlimit'
]

handler.tags = ['group']
handler.group = true
handler.admin = true
handler.botAdmin = true

export default handler