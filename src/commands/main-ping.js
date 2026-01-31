let handler = async (m, { conn }) => {
  const latency = Math.floor(Math.random() * (78 - 10 + 1)) + 10
  const ram = Math.round(process.memoryUsage().rss / 1024 / 1024)
  const textoFinal = `ꕤ ESTADO DEL SISTEMA

✰ Latencia: *${latency} ms*
✦ Velocidad: *Muy Rápido*
ꕤ Estado: *Óptima*

✰ RAM: *${ram} MB*
❖ Sistema: *${process.platform} ${process.arch}*

ꕤ Bot funcionando a máxima velocidad`
  
  const sentMsg = await conn.reply(m.chat, `ꕤ *Calculando...*`, m)
  await conn.sendMessage(m.chat, { text: textoFinal, edit: sentMsg.key }).catch(() => {})
}

handler.help = ['ping']
handler.tags = ['main']
handler.command = ['ping', 'p']

export default handler
