import { sticker } from '../../lib/sticker.js'
import uploadFile from '../../lib/uploadFile.js'
import uploadImage from '../../lib/uploadImage.js'
import { webp2png } from '../../lib/webp2mp4.js'

let handler = async (m, { conn, args }) => {
    let stiker = false
    let userId = m.sender
    let packstickers = global.db.data.users[userId] || {}
    let texto1 = packstickers.text1 || global.packsticker
    let texto2 = packstickers.text2 || global.packsticker2
    
    try {
        let q = m.quoted ? m.quoted : m
        let mime = (q.msg || q).mimetype || q.mediaType || ''
        let txt = args.join(' ')
        
        if (/webp|image|video/g.test(mime) && q.download) {
            if (/video/.test(mime) && (q.msg || q).seconds > 15) {
                return conn.reply(m.chat, 'ꕤ El video no puede durar más de 15 segundos.', m, (global.rcanalr || {}))
            }
            
            let buffer = await q.download()
            let marca = txt ? txt.split(/[\u2022|]/).map(part => part.trim()) : [texto1, texto2]
            stiker = await sticker(buffer, false, marca[0], marca[1])
            
        } else if (args[0] && isUrl(args[0])) {
            stiker = await sticker(false, args[0], texto1, texto2)
            
        } else {
            return conn.reply(m.chat, 'ꕤ Envía una imagen o video para hacer sticker.', m, (global.rcanalr || {}))
        }
        
        if (stiker) {
            conn.sendFile(m.chat, stiker, 'sticker.webp', '', m)
        } else {
            conn.reply(m.chat, 'ꕤ Error al crear el sticker.', m)
        }
        
    } catch {
        conn.reply(m.chat, 'ꕤ Ocurrió un error al procesar.', m)
    }
}

handler.help = ['sticker']
handler.tags = ['stickers']
handler.command = ['s', 'sticker']

export default handler

const isUrl = (text) => {
    return text.match(new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)(jpe?g|gif|png)/, 'gi'))
}