// Import fetch from 'node-fetch' <-- Eliminado, ya que se usará global.icono (Buffer)

let handler = async (m, { conn, args, usedPrefix }) => {
  try {
    let mentionedJid = await m.mentionedJid
    let userId = mentionedJid && mentionedJid[0] ? mentionedJid[0] : m.sender

    // Se usan las variables globales definidas. Se ASUME que global.icono es un Buffer.
    const nombreBot = global.botname || 'Celest'
    const moneda = global.currency || 'Sky-Coins'
    const textobot = global.textbot || 'Made by 7Noonly'
    const canal = global.channel || 'https://whatsapp.com/channel/0029VbBJZs5G8l5EwrjizJ2H'

    const tipoBot = (conn.user.jid == global.conn.user.jid ? 'Principal' : 'Sub-Bot')
    const host = tipoBot === 'Principal' ? 'CelestLocal' : 'CelestLocal'

    // Nota: Se usó ${botname} en el original, pero se corrige a ${nombreBot} o global.botname
    const botInfoText = `
✿  Información del Bot *${nombreBot}*

✿ *Nombre:* ${nombreBot}
✿ *Versión:* ${global.vs || 'Multi-Device'}
✦ *Moneda:* ${moneda} 

❒ *Host:* ${host}
❒ *Conectado a:* Sky
❒ *Tipo:* ${tipoBot}
❒ *Dueño:* @7Noonly.

> *Canal* \`${canal}\`
`.trim()

    // Usando global.icono como thumbnail
    const thumbnailBuffer = global.icono || null

    await conn.sendMessage(
      m.chat,
      {
        text: botInfoText,
        contextInfo: {
          mentionedJid: [userId],
          isForwarded: true,
          forwardedNewsletterMessageInfo: {
            newsletterJid: '120363402648953286@newsletter',
            serverMessageId: '',
            newsletterName: '𝘾𝙚𝙡𝙚𝙨𝙩 𝘽𝙤𝙩'
          },
          externalAdReply: {
            title: `${nombreBot} - Bot Information`,
            body: textobot,
            mediaType: 1,
            previewType: "PHOTO", // Cambiado a PHOTO para reflejar el uso de una imagen (icono)
            sourceUrl: global.web || canal,
            thumbnail: thumbnailBuffer, // Usando global.icono
            showAdAttribution: false,
            containsAutoReply: true,
            renderLargerThumbnail: true
          }
        }
      },
      { quoted: m }
    )

  } catch (e) {
    await conn.sendMessage(m.chat, { text: `❌ Error en el comando botinfo:\n${e}` }, { quoted: m })
  }
}

handler.help = ['botinfo']
handler.tags = ['socket']
handler.command = ['botinfo', 'infobot', 'info']

export default handler
