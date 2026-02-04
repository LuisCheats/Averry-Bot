const handler = async (m, { conn }) => {
try {
m.react('🕒');

const img = 'https://averry-api.vercel.app/nsfw/nsfw1';

await conn.sendFile(
m.chat,
img,
'nsfw.jpg',
'🔥 *NSFW*\n⚠️ Solo mayores de edad',
m
);

m.react('✔️');

} catch (e) {
m.react('✖️');
await conn.sendMessage(m.chat, { text: '❌ Error al enviar la imagen' }, { quoted: m });
}
};

handler.help = ['nsfw'];
handler.tags = ['nsfw'];
handler.command = ['nsfwxd'];
handler.nsfw = true;

export default handler;