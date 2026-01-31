import axios from 'axios'

const handler = async (m, { conn, text, usedPrefix }) => {
    if (!text) return conn.reply(m.chat, 'ꕤ Por favor, ingresa un término de búsqueda o el enlace de TikTok.', m)
    
    const isUrl = /tiktok\.com/i.test(text)
    const API_URL = 'https://www.tikwm.com/api/'

    try {
        if (isUrl) {
            const { data: res } = await axios.get(`${API_URL}?url=${encodeURIComponent(text)}&hd=1`)
            const data = res?.data
            
            if (!data?.play) return conn.reply(m.chat, 'ꕤ Enlace inválido o sin contenido descargable.', m)

            const caption = createCaption(data)

            if (data.type === 'image' && Array.isArray(data.images)) {
                const medias = data.images.map(url => ({ type: 'image', data: { url }, caption }))
                await conn.sendSylphy(m.chat, medias, { quoted: m })
                
                if (data.music) {
                    await conn.sendMessage(m.chat, { audio: { url: data.music }, mimetype: 'audio/mp4', fileName: 'tiktok_audio.mp4' }, { quoted: m })
                }
            } else {
                await conn.sendMessage(m.chat, { video: { url: data.play }, caption }, { quoted: m })
            }

        } else {
            const { data: res } = await axios({
                method: 'POST',
                url: `${API_URL}feed/search`,
                headers: { 
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                    'User-Agent': 'Mozilla/5.0' 
                },
                data: new URLSearchParams({ keywords: text, count: 10, cursor: 0, HD: 1 })
            })

            const results = res?.data?.videos?.filter(v => v.play) || []
            if (results.length < 1) return conn.reply(m.chat, 'ꕤ No se encontraron resultados válidos.', m)

            const medias = results.map(v => ({ 
                type: 'video', 
                data: { url: v.play }, 
                caption: createSearchCaption(v) 
            }))

            await conn.sendSylphy(m.chat, medias, { quoted: m })
        }
    } catch (e) {
        await conn.reply(m.chat, `⚠︎ Error al procesar la solicitud.\n${e.message}`, m)
    }
}

function createCaption(data) {
    const title = data.title || 'No disponible'
    const name = data.author?.nickname || 'Desconocido'
    const user = data.author?.unique_id ? `@${data.author.unique_id}` : ''
    const duration = data.duration || '0'
    const music = data.music_info?.title || `[${name}] original sound`

    return `❏ TIKTOK DOWNLOAD
──────────────────
> ❀ *Título:* ${title}
> ☕︎ *Autor:* *${name}* ${user}
> ✰ *Duración:* *${duration}s*
> 𝅘𝅥𝅮 *Música:* ${music}

> ૮꒰ ˶• ᴗ •˶꒱ა Disfruta tu contenido!`
}

function createSearchCaption(data) {
    const title = data.title || 'No disponible'
    const name = data.author?.nickname || 'Desconocido'
    const user = data.author?.unique_id ? `@${data.author.unique_id}` : ''
    const duration = data.duration || 'No disponible'
    const music = data.music?.title || `[${name}] original sound`

    return `❏ TIKTOK RESULT
──────────────────
> ❀ *Título:* ${title}
> ☕︎ *Autor:* ${name} ${user}
> ✧ *Duración:* ${duration}
> 𝅘𝅥𝅮 *Música:* ${music}

> ૮꒰ ˶• ᴗ •˶꒱ა Disfruta tu contenido!`
}

handler.help = ['tiktok']
handler.tags = ['descargas']
handler.command = ['tiktok', 'tt', 'tiktoks', 'tts']
handler.group = true

export default handler