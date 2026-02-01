import fs from 'fs'

let handler = async (m, { conn, usedPrefix, args, sender }) => {
  try {
    const username =
      m.pushName ||
      (await conn.getName(sender).catch(() => null)) ||
      sender.split('@')[0]

    const totalUsers = Object.keys(global.db?.data?.users || {}).length
    const totalCommands = Object.keys(global.plugins || {}).length

    /* ========= IMAGEN ========= */
    let menuImage = global.icono
    const imgPath = './src/assets/menu.jpg'
    if (fs.existsSync(imgPath)) {
      menuImage = fs.readFileSync(imgPath)
    }

    /* ========= HEADER ========= */
    const header = `
「 † 」 ¡Hola! *${username}*, Soy *${botname}*
> Aquí tienes la lista de comandos.

╭┈ ↷
│❀ 𝗠𝗼𝗱𝗼 » Público
│ᰔ 𝗧𝗶𝗽𝗼 » ${(conn.user.jid === global.conn.user.jid ? 'Principal' : 'Sub-Bot')}
│❀ 𝗖𝗿𝗲𝗮𝗱𝗼𝗿 » ${etiqueta}
│⚘ 𝗣𝗿𝗲𝗳𝗶𝗷𝗼 » ${usedPrefix}
│✰ 𝗨𝘀𝘂𝗮𝗿𝗶𝗼𝘀 » ${totalUsers.toLocaleString()}
│⚘ 𝗩𝗲𝗿𝘀𝗶𝗼𝗻 » ${vs}
│🜸 𝗖𝗼𝗺𝗮𝗻𝗱𝗼𝘀 » ${totalCommands}
╰─────────────────
`.trim()

    /* ========= AGRUPAR COMANDOS POR TAG ========= */
    let groups = {}

    for (let plugin of Object.values(global.plugins || {})) {
      if (!plugin.help || !plugin.tags) continue

      for (let tag of plugin.tags) {
        if (!groups[tag]) groups[tag] = []
        for (let cmd of plugin.help) {
          if (/^\$|^=>|^>/.test(cmd)) continue
          groups[tag].push(`${usedPrefix}${cmd}`)
        }
      }
    }

    // Ordenar
    for (let tag in groups) {
      groups[tag] = [...new Set(groups[tag])].sort()
    }

    /* ========= FILTRO POR CATEGORÍA ========= */
    const category = args[0]?.toLowerCase()
    let menuText = ''

    if (category && groups[category]) {
      menuText = `
\`˚.⋆ֹ　 ꒰　${category.toUpperCase()}  ꒱　ㆍ₊⊹\`
${groups[category].map(cmd => `> ${cmd}`).join('\n')}
      `.trim()
    } else {
      menuText = Object.entries(groups)
        .map(([tag, cmds]) => {
          return `
\`˚.⋆ֹ　 ꒰　${tag.toUpperCase()}  ꒱　ㆍ₊⊹\`
${cmds.map(cmd => `> ${cmd}`).join('\n')}
          `.trim()
        })
        .join('\n\n')
    }

    const finalText = `${header}\n\n${menuText}\n\n> By 7Noonly`

    /* ========= ENVIAR ========= */
    await conn.sendMessage(
      m.chat,
      {
        image: menuImage,
        caption: finalText,
        contextInfo: {
          isForwarded: true,
          forwardedNewsletterMessageInfo: {
            newsletterJid: '120363402648953286@newsletter',
            serverMessageId: '',
            newsletterName: '️𝘼𝙫𝙚𝙧𝙧𝙮𝙏𝙚𝙖𝙢'
          }
        }
      },
      { quoted: m }
    )
  } catch (e) {
    conn.reply(m.chat, `✰ Error en el menú:\n${e}`, m)
  }
}

handler.help = ['menu']
handler.tags = ['main']
handler.command = ['menu', 'menú', 'help', 'comandos', 'commands']
handler.group = true

export default handler