let handler = async (m, { conn }) => {
    const specialNumbers = {
        '+50765836410': 'https://files.catbox.moe/t1y9r4.jpg',
        '+50765836410': 'https://files.catbox.moe/t1y9r4.jpg'
    }
    
    const sender = m.sender.split('@')[0]
    const cleanSender = sender.replace(/[+\s-]/g, '')
    
    const numbersToCheck = [sender, `+${cleanSender}`, cleanSender]
    
    let photoUrl = null
    
    for (const num of numbersToCheck) {
        if (specialNumbers[num]) {
            photoUrl = specialNumbers[num]
            break
        }
    }
    
    const altFormats = {
        '50765836410': 'https://files.catbox.moe/t1y9r4.jpg',
        '50765836410': 'https://files.catbox.moe/t1y9r4.jpg'
    }
    
    if (!photoUrl && altFormats[cleanSender]) {
        photoUrl = altFormats[cleanSender]
    }
    
    if (!photoUrl) {
        return
    }
    
    try {
        await conn.sendFile(m.chat, photoUrl, 'mylove.jpg', 
            `💖 Este es el amor de tu vida`, 
            m, 
            false, 
            { 
                mentions: [m.sender]
            }
        )
        
        await m.react('❤️')
        
    } catch (error) {
        console.error('Error al enviar la foto:', error)
        m.reply('❌ Ocurrió un error al enviar la foto')
    }
}

handler.help = ['mylove']
handler.tags = ['special']
handler.command = ['mylove1', 'amor1', 'parati1']
handler.group = true

export default handler