import fetch from 'node-fetch';

const handler = async (m, { conn, usedPrefix, command }) => {
    try {
        m.react('🕒');
        
        const response = await fetch('https://api.waifu.pics/sfw/waifu');
        if (!response.ok) throw new Error('Error en la API');
        
        const { url } = await response.json();
        if (!url) throw new Error('URL no disponible');
        
        await Promise.all([
            conn.sendFile(m.chat, url, 'waifu.jpg', '🌸 𝗪𝗮𝗶𝗳𝘂 𝗱𝗲𝘁𝗲𝗰𝘁𝗮𝗱𝗮', m),
            m.react('✔️')
        ]);
        
    } catch (err) {
        m.react('✖️');
        conn.sendMessage(m.chat, { 
            text: `❌ 𝗘𝗿𝗿𝗼𝗿\n• Usa *${usedPrefix}report* para notificar el problema\n\n${err.message}` 
        }, { quoted: m });
    }
};

handler.help = ['waifu'];
handler.tags = ['anime'];
handler.command = ['waifu'];
handler.group = true;

export default handler;