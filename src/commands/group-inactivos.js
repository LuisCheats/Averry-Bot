import { areJidsSameUser } from '@whiskeysockets/baileys'

var handler = async (m, { conn, text, participants, args, command, usedPrefix }) => {
    const ctxErr = (global.rcanalx || {})
    const ctxWarn = (global.rcanalw || {})
    const ctxOk = (global.rcanalr || {})
    
    try {
        let member = participants.map(u => u.id)
        let days = 30 
        
        if (text) {
            const argsText = text.split(' ')
            const daysArg = parseInt(argsText[0])
            if (!isNaN(daysArg) && daysArg >= 1 && daysArg <= 30) {
                days = daysArg
            }
        }
        
        var total = 0
        var sider = []
        const now = Date.now()
        const daysInMs = days * 24 * 60 * 60 * 1000
        
        for (let i = 0; i < member.length; i++) {
            let users = m.isGroup ? participants.find(u => areJidsSameUser(u.id, member[i])) : {}
            const userData = global.db.data.users[member[i]] || {}
            
            const lastSeen = userData.lastSeen || 0
            const isInactive = (now - lastSeen) > daysInMs
            const messageCount = userData.chat || 0
            
            if (isInactive && !users?.admin && !users?.superadmin) {
                if (typeof global.db.data.users[member[i]] !== 'undefined') {
                    if (global.db.data.users[member[i]].whitelist == false) {
                        total++
                        sider.push({
                            id: member[i],
                            messages: messageCount,
                            lastSeen: lastSeen
                        })
                    }
                } else {
                    total++
                    sider.push({
                        id: member[i],
                        messages: messageCount,
                        lastSeen: lastSeen
                    })
                }
            }
        }
        
        sider.sort((a, b) => a.messages - b.messages)

        const delay = time => new Promise(res => setTimeout(res, time))
        
        switch (command) {
            case 'inactivos': 
            case 'fantasmas': 
            case 'topinactive': {
                if (total == 0) return conn.reply(m.chat, `ꕤ Este grupo es activo, no tiene fantasmas en los últimos *${days}* días.`, m, ctxWarn)
                
                let topInactivos = `❀ Top de usuarios inactivos ❀\n`
                topInactivos += `> » Días: *${days}*\n`
                topInactivos += `> » Página: *1* de *1*\n\n`
                
                for (let i = 0; i < sider.length; i++) {
                    const user = sider[i]
                    let userName
                    try {
                        userName = await conn.getName(user.id) || user.id.split('@')[0]
                    } catch {
                        userName = user.id.split('@')[0]
                    }
                    topInactivos += `*#${i + 1}:* @${user.id.split('@')[0]} » *${user.messages}* mensajes\n`
                }
                
                await conn.reply(m.chat, topInactivos, m, { mentions: sider.map(u => u.id) })
                break
            }
            
            case 'kickinactivos': 
            case 'kickfantasmas': {
                if (total == 0) return conn.reply(m.chat, `ꕤ Este grupo es activo no tiene fantasmas en los últimos *${days}* días.`, m, ctxWarn)
                
                let kickList = `❀ *Eliminación de inactivos*\n\n`
                kickList += `> » Período: *${days}* días\n`
                kickList += `> » Total a eliminar: *${total}* usuarios\n\n`
                kickList += `✦ *Lista de fantasmas*\n${sider.map((v, i) => `*#${i + 1}* @${v.id.split('@')[0]} » ${v.messages} mensajes`).join('\n')}\n\n`
                kickList += `> ✰ Nota: El bot eliminará a los usuarios de la lista mencionada cada 10 segundos.`
                
                await conn.reply(m.chat, kickList, m, { mentions: sider.map(u => u.id) })
                await delay(10 * 1000)
                
                let chat = global.db.data.chats[m.chat]
                chat.welcome = false
                
                try {
                    for (let user of sider) {
                        if (user.id.endsWith('@s.whatsapp.net')) {
                            const participant = participants.find(v => areJidsSameUser(v.id, user.id))
                            if (participant && !participant.admin) {
                                await conn.groupParticipantsUpdate(m.chat, [user.id], 'remove')
                                await delay(10 * 1000)
                            }
                        }
                    }
                } finally {
                    chat.welcome = true
                }
                break
            }
        }
    } catch (e) {
        await conn.reply(m.chat, `ꕤ Se ha producido un problema.\n> Usa *${usedPrefix}report* para informarlo.\n\n${e.message}`, m, ctxErr)
    }
}

handler.help = [
    'inactivos [días]',
    'fantasmas [días]', 
    'topinactive [días]',
    'kickinactivos [días]',
    'kickfantasmas [días]'
]

handler.tags = ['grupo']
handler.command = ['inactivos', 'fantasmas', 'topinactive', 'kickinactivos', 'kickfantasmas']
handler.group = true
handler.botAdmin = true
handler.admin = true

export default handler

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))