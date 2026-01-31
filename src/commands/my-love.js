let handler = async (m, { conn }) => {
    const specialNumbers = {
        '+521667889825': 'https://cdn.russellxz.click/f1313de4.jpeg',
        '+52667889825': 'https://cdn.russellxz.click/f1313de4.jpeg',
        '+5491123267152': 'https://cdn.russellxz.click/f5eb2868.png',
        '+573223552658': 'https://cdn.russellxz.click/f5eb2868.png'
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
        '521667889825': 'https://cdn.russellxz.click/f1313de4.jpeg',
        '52667889825': 'https://cdn.russellxz.click/f1313de4.jpeg',
        '5491123267152': 'https://cdn.russellxz.click/f5eb2868.png',
        '573223552658': 'https://cdn.russellxz.click/f5eb2868.png'
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
handler.command = ['mylove', 'amor', 'parati']
handler.group = true

export default handler