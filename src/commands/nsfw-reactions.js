import { readFileSync } from 'fs'
import { join } from 'path'

const nsfwData = JSON.parse(readFileSync(join(process.cwd(), 'src/json', 'nsfw.json')))

let handler = async (m, { conn, command }) => {
    const usedPrefix = global.prefix
    
    if (!db.data.chats[m.chat].nsfw && m.isGroup) {
        return m.reply(`ꕤ El contenido *NSFW* está desactivado en este grupo.\n\n» Un administrador puede activarlo con:\n*${usedPrefix}nsfw on*`)
    }

    let mentionedJid = m.mentionedJid || []
    let userId = mentionedJid.length > 0 ? mentionedJid[0] : (m.quoted ? m.quoted.sender : m.sender)
    
    let isMentioned = mentionedJid.length > 0 || (m.quoted && m.quoted.sender !== m.sender)
    
    let getUsername = async (jid) => {
        try {
            const name = global.db.data.users[jid]?.name || await conn.getName(jid)
            return typeof name === 'string' && name.trim() ? name : jid.split('@')[0]
        } catch {
            return jid.split('@')[0]
        }
    }

    let fromName = await getUsername(m.sender)
    let whoName = await getUsername(userId)

    let str, videos, reactEmoji

    const commandMap = {
        'cum': 'cum',
        'leche': 'cum',
        'fuck': 'fuck',
        'coger': 'fuck',
        'grabboobs': 'grabboobs',
        'agarrartetas': 'grabboobs',
        'suckboobs': 'suckboobs',
        'chupartetas': 'suckboobs',
        'blowjob': 'blowjob',
        'bj': 'blowjob',
        'mamada': 'blowjob',
        'fuck2': 'fuck2',
        'coger2': 'fuck2',
        'yuri': 'yuri',
        'lesbianas': 'yuri',
        'tijeras': 'yuri',
        'sixnine': 'sixnine',
        '69': 'sixnine',
        'sexo': 'sexo',
        'sex': 'sexo',
        'violar': 'violar',
        'perra': 'violar',
        'boobjob': 'boobjob',
        'rusa': 'boobjob',
        'spank': 'spank',
        'nalgada': 'spank',
        'anal': 'anal',
        'culiar': 'anal',
        'lickpussy': 'lickpussy',
        'coño': 'lickpussy',
        'fap': 'fap',
        'paja': 'fap',
        'follar': 'follar',
        'footjob': 'footjob',
        'pies': 'footjob',
        'grop': 'grop',
        'grope': 'grop',
        'manosear': 'grop'
    }

    const baseCommand = commandMap[command]
    
    if (!baseCommand || !nsfwData[baseCommand]) {
        return m.reply(`ꕤ Comando no reconocido. Usa *${usedPrefix}help nsfw* para ver la lista.`)
    }

    const commandData = nsfwData[baseCommand]
    videos = commandData.videos
    reactEmoji = commandData.reactEmoji

    switch (baseCommand) {
        case 'cum':
            str = !isMentioned ? 
                `\`${fromName}\` *se vino dentro de... Omitiremos eso*` : 
                `\`${fromName}\` *se vino dentro de* \`${whoName}\`.`
            break

        case 'fuck':
            str = !isMentioned ? 
                `\`${fromName}\` *está cogiendo! >.<*` : 
                `\`${fromName}\` *se lo metió sabrosamente a* \`${whoName}\`.`
            break

        case 'grabboobs':
            str = !isMentioned ? 
                `\`${fromName}\` *está agarrando unas ricas tetas >.<*` : 
                `\`${fromName}\` *le está agarrando las tetas a* \`${whoName}\`.`
            break

        case 'suckboobs':
            str = !isMentioned ? 
                `\`${fromName}\` *está chupando tetas! >.<*` : 
                `\`${fromName}\` *le chupó las tetas a* \`${whoName}\`.`
            break

        case 'blowjob':
            str = !isMentioned ? 
                `\`${fromName}\` *está dando una mamada >.<*` : 
                `\`${fromName}\` *le dio una mamada a* \`${whoName}\`.`
            break

        case 'fuck2':
            str = !isMentioned ? 
                `\`${fromName}\` *esta cojiendo salvajemente.*` : 
                `\`${fromName}\` *se la metió ricamente a* \`${whoName}\`.`
            break

        case 'yuri':
            str = !isMentioned ? 
                `\`${fromName}\` *está haciendo tijeras! >.<*` : 
                `\`${fromName}\` *hizo tijeras con* \`${whoName}\`.`
            break

        case 'sixnine':
            str = !isMentioned ? 
                `\`${fromName}\` *está haciendo un 69! >.<*` : 
                `\`${fromName}\` *está haciendo un 69 con* \`${whoName}\`.`
            break

        case 'sexo':
            str = !isMentioned ? 
                `\`${fromName}\` *tiene sexo apasionadamente.*` : 
                `\`${fromName}\` *tiene sexo fuertemente con* \`${whoName}\`.`
            break

        case 'violar':
            str = !isMentioned ? 
                `\`${fromName}\` *violo a alguien random del grupo por puta.*` : 
                `\`${fromName}\` *acabás de violar a la putita de* \`${whoName}\` *mientras te decía "metemela durooo más durooo que rico pitote"...*`
            break

        case 'boobjob':
            str = !isMentioned ? 
                `\`${fromName}\` *está haciendo una rusa.*` : 
                `\`${fromName}\` *le hizo una rusa a* \`${whoName}\`.`
            break

        case 'spank':
            str = !isMentioned ? 
                `\`${fromName}\` *está repartiendo nalgadas! >.<*` : 
                `\`${fromName}\` *le dio una nalgada a* \`${whoName}\`.`
            break

        case 'anal':
            str = !isMentioned ? 
                `\`${fromName}\` *esta haciendo un anal*` : 
                `\`${fromName}\` *le partio el culo a la puta de* \`${whoName}\`.`
            break

        case 'lickpussy':
            str = !isMentioned ? 
                `\`${fromName}\` *está lamiendo un coños! >.<*` : 
                `\`${fromName}\` *le está lamiendo el coño a* \`${whoName}\`.`
            break

        case 'fap':
            str = !isMentioned ? 
                `\`${fromName}\` *se pajea pensando en tía turbina.*` : 
                `\`${fromName}\` *se pajea pensando en* \`${whoName}\`.`
            break

        case 'follar':
            str = !isMentioned ? 
                `\`${fromName}\` *está follando ricamente.*` : 
                `\`${fromName}\` *follo fuertemente a la perra de* \`${whoName}\`.`
            break

        case 'footjob':
            str = !isMentioned ? 
                `\`${fromName}\` *está haciendo una paja con los pies!*` : 
                `\`${fromName}\` *le hizo una paja con los pies a* \`${whoName}\`.`
            break

        case 'grop':
            str = !isMentioned ? 
                `\`${fromName}\` *está manoseando! >.<*` : 
                `\`${fromName}\` *está manoseando a* \`${whoName}\` *estas muy excitante hoy.*`
            break

        default:
            str = !isMentioned ? 
                `\`${fromName}\` *está usando el comando ${command}*` : 
                `\`${fromName}\` *le está aplicando ${command} a* \`${whoName}\`.`
    }

    if (reactEmoji) m.react(reactEmoji)
    
    if (m.isGroup) {
        try {
            const video = videos[Math.floor(Math.random() * videos.length)]
            let mentions = [userId]
            
            conn.sendMessage(m.chat, { 
                video: { url: video }, 
                gifPlayback: true, 
                caption: str, 
                mentions 
            }, { quoted: m })
            
        } catch (e) {
            console.error(e)
            return m.reply(`ꕤ Error al enviar el video.\n> Usa *${usedPrefix}report* para informar el problema.\n\n${e.message}`)
        }
    }
}

handler.help = [
    'cum/leche @tag',
    'fuck/coger @tag', 
    'grabboobs/agarrartetas @tag',
    'suckboobs/chupartetas @tag',
    'blowjob/bj/mamada @tag',
    'fuck2/coger2 @tag',
    'yuri/lesbianas/tijeras @tag',
    'sixnine/69 @tag',
    'sexo/sex @tag',
    'violar/perra @tag',
    'boobjob/rusa @tag',
    'spank/nalgada @tag',
    'anal/culiar @tag',
    'lickpussy/coño @tag',
    'fap/paja @tag',
    'follar @tag',
    'footjob/pies @tag',
    'grop/grope/manosear @tag'
]

handler.tags = ['nsfw']
handler.command = [
    'cum', 'leche',
    'fuck', 'coger', 
    'grabboobs', 'agarrartetas',
    'suckboobs', 'chupartetas',
    'blowjob', 'bj', 'mamada',
    'fuck2', 'coger2',
    'yuri', 'lesbianas', 'tijeras',
    'sixnine', '69',
    'sexo', 'sex',
    'violar', 'perra',
    'boobjob', 'rusa',
    'spank', 'nalgada',
    'anal', 'culiar',
    'lickpussy', 'coño',
    'fap', 'paja',
    'follar',
    'footjob', 'pies',
    'grop', 'grope', 'manosear'
]

handler.group = true

export default handler