import fetch from 'node-fetch';

const handler = async (m, { conn }) => {
  try {
    m.react('🕒');
    
    const res = await fetch('https://averry-api.vercel.app/nsfw/nsfw1', {
      headers: { 'User-Agent': 'Mozilla/5.0' }
    });
    
    const buffer = await res.buffer();
    
    await conn.sendFile(
      m.chat,
      buffer,
      'nsfw.jpg',
      '🔥 NSFW',
      m
    );
    
    m.react('✔️');
    
  } catch (e) {
    m.react('✖️');
    await conn.sendMessage(m.chat, { text: '❌ Error al cargar la imagen' }, { quoted: m });
  }
};

export default handler;