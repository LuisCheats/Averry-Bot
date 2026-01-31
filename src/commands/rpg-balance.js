let handler = async (m, { conn, usedPrefix }) => {
    if (!db.data.chats[m.chat].economy && m.isGroup) {
        return m.reply(`ꕤ Los comandos de *Economía* están desactivados en este grupo.\n\nUn *administrador* puede activarlos con el comando:\n» *${usedPrefix}economy on*`)
    }
    
    const userCurrency = global.getUserCurrency ? global.getUserCurrency(m.sender) : global.currency
    
    let mentionedJid = await m.mentionedJid
    let who = mentionedJid[0] ? mentionedJid[0] : m.quoted ? await m.quoted.sender : m.sender
    let name = await (async () => global.db.data.users[who].name || (async () => { try { const n = await conn.getName(who); return typeof n === 'string' && n.trim() ? n : who.split('@')[0] } catch { return who.split('@')[0] } })())()
    if (!(who in global.db.data.users)) return m.reply(`ꕤ El usuario no se encuentra en mi base de datos.`)
    let user = global.db.data.users[who]
    let coin = user.coin || 0
    let bank = user.bank || 0
    let total = (user.coin || 0) + (user.bank || 0)
    const texto = `ᥫ᭡ Informacion -  Balance ❀
 
ᰔᩚ Usuario » *${name}*   
⛀ Cartera » *$${coin.toLocaleString()} ${userCurrency}*
⚿ Banco » *$${bank.toLocaleString()} ${userCurrency}*
⛁ Total » *$${total.toLocaleString()} ${userCurrency}*

> *Para proteger tu dinero, ¡depósitalo en el banco usando *${usedPrefix}deposit*`
    await conn.reply(m.chat, texto, m)
}

handler.help = ['bal']
handler.tags = ['rpg']
handler.command = ['bal', 'balance', 'bank'] 
handler.group = true 

export default handler