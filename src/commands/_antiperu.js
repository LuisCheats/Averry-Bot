export async function before(m, { conn, isAdmin, isBotAdmin, isROwner }) {
    if (!m.isGroup || !m?.text) return;

    const chat = global?.db?.data?.chats[m.chat];
    if (!chat?.antiperuano) return;

    const isPeruano = m.sender.includes('57') || m.sender.includes('+57');
    
    if (isPeruano && !isAdmin && !isROwner) {
        if (!isBotAdmin) return;
        if (m.key.participant === conn.user.jid) return;

        await Promise.all([
            conn.sendMessage(m.chat, { 
                delete: { 
                    remoteJid: m.chat, 
                    fromMe: false, 
                    id: m.key.id, 
                    participant: m.key.participant 
                }
            }),
            conn.groupParticipantsUpdate(m.chat, [m.sender], 'remove')
        ]);

        const userName = global.db.data.users[m.sender]?.name || 'Usuario';
        
        await conn.reply(m.chat, 
            `> 🇵🇪 *PERUANO ELIMINADO*\n\n` +
            `• Se baneó a *${userName}* del grupo\n` +
            `• Razón: Ser un maldito peruano +51\n` +
            `• Que se joda ese mierda peruana\n` +
            `• Aquí no queremos a esa basura jaja`, 
        null);
    }
}

export async function participantsUpdate(m, { conn, isBotAdmin }) {
    const chat = global?.db?.data?.chats[m.chat];
    if (!chat?.antiperuano) return;
    if (!isBotAdmin) return;

    try {
        for (const participant of m.participants) {
            if (participant.action === 'add') {
                const userJid = participant.id;
                
                if (userJid.includes('57') || userJid.includes('+57')) {
                    await Promise.all([
                        conn.groupParticipantsUpdate(m.chat, [userJid], 'remove'),
                        conn.sendMessage(m.chat, {
                            text: `> 🇵🇪 *PERUANO BLOQUEADO*\n\n` +
                                  `• Se impidió el ingreso de un maldito peruano\n` +
                                  `• Número detectado: ${userJid}\n` +
                                  `• Que se vaya a la mierda ese indigena +51\n` +
                                  `• Aquí no queremos esas madres`
                        })
                    ]);
                }
            }
        }
    } catch (error) {
        console.error('Error en antiperuano:', error);
    }
}