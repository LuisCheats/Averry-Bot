import fetch from 'node-fetch'

let handler = async (m, { conn, command, usedPrefix }) => {
    let mentionedJid = await m.mentionedJid
    let userId = mentionedJid.length > 0 ? mentionedJid[0] : (m.quoted ? m.quoted.sender : m.sender)
    
    const getName = async (jid) => {
        try {
            const name = global.db.data.users[jid]?.name || await conn.getName(jid)
            return typeof name === 'string' && name.trim() ? name : jid.split('@')[0]
        } catch {
            return jid.split('@')[0]
        }
    }

    let from = await getName(m.sender)
    let who = await getName(userId)
    
    const randomPhrase = (phrases) => phrases[Math.floor(Math.random() * phrases.length)]

    let str, query
    const isSelf = from === who

    switch (command) {
        case 'angry': case 'enojado':
            str = isSelf 
                ? randomPhrase([`\`${from}\` está molesto.`, `\`${from}\` se enfada.`, `\`${from}\` muestra su enojo.`]) 
                : randomPhrase([`\`${from}\` está molesto con \`${who}\`.`, `\`${from}\` se enfada con \`${who}\`.`, `\`${from}\` culpa a \`${who}\` con enojo.`])
            query = 'anime angry'
            break
        case 'bath': case 'bañarse':
            str = isSelf 
                ? randomPhrase([`\`${from}\` está tomando un baño.`, `\`${from}\` se está bañando.`, `\`${from}\` se limpia.`]) 
                : randomPhrase([`\`${from}\` está bañando a \`${who}\`.`, `\`${from}\` limpia a \`${who}\`.`, `\`${from}\` ayuda a \`${who}\` a bañarse.`])
            query = 'anime bath'
            break
        case 'bite': case 'morder':
            str = isSelf 
                ? randomPhrase([`\`${from}\` se mordió a sí mismo.`, `\`${from}\` se auto-muerde.`, `\`${from}\` da un mordisco.`]) 
                : randomPhrase([`\`${from}\` muerde a \`${who}\`.`, `\`${from}\` le da un mordisco a \`${who}\`.`, `\`${from}\` ataca a \`${who}\` con los dientes.`])
            query = 'anime bite'
            break
        case 'bleh': case 'lengua':
            str = isSelf 
                ? randomPhrase([`\`${from}\` saca la lengua.`, `\`${from}\` muestra la lengua.`, `\`${from}\` burla.`]) 
                : randomPhrase([`\`${from}\` le saca la lengua a \`${who}\`.`, `\`${from}\` burla a \`${who}\`.`, `\`${from}\` le hace un gesto a \`${who}\`.`])
            query = 'anime bleh'
            break
        case 'blush': case 'sonrojarse':
            str = isSelf 
                ? randomPhrase([`\`${from}\` se sonroja.`, `\`${from}\` muestra timidez.`, `\`${from}\` se ruboriza.`]) 
                : randomPhrase([`\`${from}\` se sonroja por \`${who}\`.`, `\`${from}\` se ruboriza por \`${who}\`.`, `\`${from}\` se pone tímido por \`${who}\`.`])
            query = 'anime blush'
            break
        case 'bored': case 'aburrido':
            str = isSelf 
                ? randomPhrase([`\`${from}\` está aburrido.`, `\`${from}\` se siente sin interés.`, `\`${from}\` bosteza.`]) 
                : randomPhrase([`\`${from}\` se aburre de \`${who}\`.`, `\`${from}\` ignora a \`${who}\` por aburrimiento.`, `\`${from}\` se queja con \`${who}\` de su aburrimiento.`])
            query = 'anime bored'
            break
        case 'clap': case 'aplaudir':
            str = isSelf 
                ? randomPhrase([`\`${from}\` aplaude.`, `\`${from}\` se da una ovación.`, `\`${from}\` celebra su éxito.`]) 
                : randomPhrase([`\`${from}\` aplaude a \`${who}\`.`, `\`${from}\` celebra con \`${who}\`.`, `\`${from}\` reconoce el esfuerzo de \`${who}\`.`])
            query = 'anime clap'
            break
        case 'coffee': case 'cafe': case 'café':
            str = isSelf 
                ? randomPhrase([`\`${from}\` está tomando café.`, `\`${from}\` necesita cafeína.`, `\`${from}\` bebe algo caliente.`]) 
                : randomPhrase([`\`${from}\` toma café con \`${who}\`.`, `\`${from}\` comparte un café con \`${who}\`.`, `\`${from}\` invita a \`${who}\` a un café.`])
            query = 'anime coffee'
            break
        case 'cry': case 'llorar':
            str = isSelf 
                ? randomPhrase([`\`${from}\` está llorando.`, `\`${from}\` se siente triste.`, `\`${from}\` derrama lágrimas.`]) 
                : randomPhrase([`\`${from}\` llora por \`${who}\`.`, `\`${from}\` se siente triste por \`${who}\`.`, `\`${from}\` busca consuelo en \`${who}\`.`])
            query = 'anime cry'
            break
        case 'cuddle': case 'acurrucarse':
            str = isSelf 
                ? randomPhrase([`\`${from}\` se acurrucó solo.`, `\`${from}\` busca su propio calor.`, `\`${from}\` se abraza a sí mismo.`]) 
                : randomPhrase([`\`${from}\` se acurrucó con \`${who}\`.`, `\`${from}\` busca el calor de \`${who}\`.`, `\`${from}\` le da un abrazo cálido a \`${who}\`.`])
            query = 'anime cuddle'
            break
        case 'dance': case 'bailar':
            str = isSelf 
                ? randomPhrase([`\`${from}\` está bailando.`, `\`${from}\` se mueve al ritmo.`, `\`${from}\` disfruta de la música.`]) 
                : randomPhrase([`\`${from}\` está bailando con \`${who}\`.`, `\`${from}\` invita a \`${who}\` a bailar.`, `\`${from}\` y \`${who}\` bailan juntos.`])
            query = 'anime dance'
            break
        case 'drunk': case 'borracho':
            str = isSelf 
                ? randomPhrase([`\`${from}\` está borracho.`, `\`${from}\` no puede caminar derecho.`, `\`${from}\` ve doble.`]) 
                : randomPhrase([`\`${from}\` está borracho con \`${who}\`.`, `\`${from}\` y \`${who}\` están ebrios.`, `\`${from}\` necesita ayuda de \`${who}\`.`])
            query = 'anime drunk'
            break
        case 'eat': case 'comer':
            str = isSelf 
                ? randomPhrase([`\`${from}\` está comiendo.`, `\`${from}\` tiene hambre.`, `\`${from}\` disfruta de la comida.`]) 
                : randomPhrase([`\`${from}\` está comiendo con \`${who}\`.`, `\`${from}\` comparte su comida con \`${who}\`.`, `\`${from}\` come junto a \`${who}\`.`])
            query = 'anime eat'
            break
        case 'facepalm': case 'palmada':
            str = isSelf 
                ? randomPhrase([`\`${from}\` se da una palmada en la cara.`, `\`${from}\` se frustra.`, `\`${from}\` no puede creer lo que hizo.`]) 
                : randomPhrase([`\`${from}\` se da una palmada en la cara por \`${who}\`.`, `\`${from}\` se frustra por \`${who}\`.`, `\`${from}\` no puede creer lo que hizo \`${who}\`.`])
            query = 'anime facepalm'
            break
        case 'happy': case 'feliz':
            str = isSelf 
                ? randomPhrase([`\`${from}\` está feliz.`, `\`${from}\` sonríe.`, `\`${from}\` irradia alegría.`])
                : randomPhrase([`\`${from}\` está feliz por \`${who}\`.`, `\`${from}\` le sonríe a \`${who}\`.`, `\`${from}\` comparte su alegría con \`${who}\`.`])
            query = 'anime happy'
            break
        case 'hug': case 'abrazar':
            str = isSelf 
                ? randomPhrase([`\`${from}\` se abraza a sí mismo.`, `\`${from}\` se da un auto-abrazo.`, `\`${from}\` busca consuelo.`])
                : randomPhrase([`\`${from}\` abraza a \`${who}\`.`, `\`${from}\` le da un abrazo a \`${who}\`.`, `\`${from}\` consuela a \`${who}\`.`])
            query = 'anime hug'
            break
        case 'kill': case 'matar':
            str = isSelf 
                ? randomPhrase([`\`${from}\` se 'mata' a sí mismo de la vergüenza.`, `\`${from}\` está derrotado.`, `\`${from}\` se rinde.`]) 
                : randomPhrase([`\`${from}\` 'mata' a \`${who}\`.`, `\`${from}\` castiga a \`${who}\`.`, `\`${from}\` derrota a \`${who}\`.`])
            query = 'anime kill'
            break
        case 'kiss': case 'muak':
            str = isSelf 
                ? randomPhrase([`\`${from}\` se besa a sí mismo.`, `\`${from}\` lanza un beso al aire.`, `\`${from}\` practica su beso.`]) 
                : randomPhrase([`\`${from}\` besa a \`${who}\`.`, `\`${from}\` le da un beso a \`${who}\`.`, `\`${from}\` muestra afecto a \`${who}\`.`])
            query = 'anime kiss'
            break
        case 'laugh': case 'reirse':
            str = isSelf 
                ? randomPhrase([`\`${from}\` se ríe a carcajadas.`, `\`${from}\` no puede parar de reír.`, `\`${from}\` se divierte.`]) 
                : randomPhrase([`\`${from}\` se ríe de \`${who}\`.`, `\`${from}\` se ríe con \`${who}\`.`, `\`${from}\` encuentra gracioso a \`${who}\`.`])
            query = 'anime laugh'
            break
        case 'lick': case 'lamer':
            str = isSelf 
                ? randomPhrase([`\`${from}\` se lame.`, `\`${from}\` se lame los labios.`, `\`${from}\` se limpia.`]) 
                : randomPhrase([`\`${from}\` lame a \`${who}\`.`, `\`${from}\` le da un lametón a \`${who}\`.`, `\`${from}\` prueba el sabor de \`${who}\`.`])
            query = 'anime lick'
            break
        case 'slap': case 'bofetada':
            str = isSelf 
                ? randomPhrase([`\`${from}\` se abofetea.`, `\`${from}\` se golpea.`, `\`${from}\` se da una cachetada.`]) 
                : randomPhrase([`\`${from}\` abofetea a \`${who}\`.`, `\`${from}\` le da una bofetada a \`${who}\`.`, `\`${from}\` golpea a \`${who}\`.`])
            query = 'anime slap'
            break
        case 'sleep': case 'dormir':
            str = isSelf 
                ? randomPhrase([`\`${from}\` está durmiendo.`, `\`${from}\` toma una siesta.`, `\`${from}\` se va a descansar.`]) 
                : randomPhrase([`\`${from}\` duerme junto a \`${who}\`.`, `\`${from}\` y \`${who}\` duermen.`, `\`${from}\` se acuesta con \`${who}\`.`])
            query = 'anime sleep'
            break
        case 'smoke': case 'fumar':
            str = isSelf 
                ? randomPhrase([`\`${from}\` está fumando.`, `\`${from}\` toma un descanso.`, `\`${from}\` exhala humo.`]) 
                : randomPhrase([`\`${from}\` está fumando con \`${who}\`.`, `\`${from}\` comparte un cigarro con \`${who}\`.`, `\`${from}\` y \`${who}\` fuman.`])
            query = 'anime smoke'
            break
        case 'spit': case 'escupir':
            str = isSelf 
                ? randomPhrase([`\`${from}\` escupe.`, `\`${from}\` se limpia.`, `\`${from}\` arroja algo.`]) 
                : randomPhrase([`\`${from}\` escupe a \`${who}\`.`, `\`${from}\` le escupe a \`${who}\`.`, `\`${from}\` muestra su disgusto a \`${who}\`.`])
            query = 'anime spit'
            break
        case 'step': case 'pisar':
            str = isSelf 
                ? randomPhrase([`\`${from}\` se pisa a sí mismo.`, `\`${from}\` se cae.`, `\`${from}\` tropieza.`]) 
                : randomPhrase([`\`${from}\` pisa a \`${who}\`.`, `\`${from}\` le pisa el pie a \`${who}\`.`, `\`${from}\` lo pisa sin piedad a \`${who}\`.`])
            query = 'anime step'
            break
        case 'think': case 'pensar':
            str = isSelf 
                ? randomPhrase([`\`${from}\` está pensando.`, `\`${from}\` reflexiona.`, `\`${from}\` se concentra.`]) 
                : randomPhrase([`\`${from}\` está pensando en \`${who}\`.`, `\`${from}\` reflexiona sobre \`${who}\`.`, `\`${from}\` medita sobre \`${who}\`.`])
            query = 'anime think'
            break
        case 'love': case 'enamorado': case 'enamorada':
            str = isSelf 
                ? randomPhrase([`\`${from}\` se ama a sí mismo.`, `\`${from}\` muestra amor propio.`, `\`${from}\` está satisfecho consigo mismo.`]) 
                : randomPhrase([`\`${from}\` está enamorado de \`${who}\`.`, `\`${from}\` ama a \`${who}\`.`, `\`${from}\` le declara su amor a \`${who}\`.`])
            query = 'anime love'
            break
        case 'pat': case 'palmadita': case 'palmada':
            str = isSelf 
                ? randomPhrase([`\`${from}\` se da una palmadita.`, `\`${from}\` se auto-felicita.`, `\`${from}\` se apoya a sí mismo.`]) 
                : randomPhrase([`\`${from}\` acaricia a \`${who}\`.`, `\`${from}\` le da una palmadita a \`${who}\`.`, `\`${from}\` consuela a \`${who}\`.`])
            query = 'anime pat'
            break
        case 'poke': case 'picar':
            str = isSelf 
                ? randomPhrase([`\`${from}\` se da un toque.`, `\`${from}\` se pincha.`, `\`${from}\` se molesta a sí mismo.`]) 
                : randomPhrase([`\`${from}\` pica a \`${who}\`.`, `\`${from}\` le da un golpe suave a \`${who}\`.`, `\`${from}\` molesta a \`${who}\`.`])
            query = 'anime poke'
            break
        case 'pout': case 'pucheros':
            str = isSelf 
                ? randomPhrase([`\`${from}\` hace pucheros.`, `\`${from}\` se enfurruña.`, `\`${from}\` está disgustado.`]) 
                : randomPhrase([`\`${from}\` le hace pucheros a \`${who}\`.`, `\`${from}\` está disgustado por \`${who}\`.`, `\`${from}\` se queja con \`${who}\`.`])
            query = 'anime pout'
            break
        case 'punch': case 'pegar': case 'golpear':
            str = isSelf 
                ? randomPhrase([`\`${from}\` se golpea a sí mismo.`, `\`${from}\` golpea al aire.`, `\`${from}\` está frustrado.`]) 
                : randomPhrase([`\`${from}\` golpea a \`${who}\`.`, `\`${from}\` le da un puñetazo a \`${who}\`.`, `\`${from}\` castiga a \`${who}\` con un golpe.`])
            query = 'anime punch'
            break
        case 'preg': case 'preñar': case 'embarazar':
            str = isSelf 
                ? randomPhrase([`\`${from}\` se embarazó solo.`, `\`${from}\` anuncia un milagro.`, `\`${from}\` está en estado de buena esperanza.`]) 
                : randomPhrase([`\`${from}\` deja embarazada a \`${who}\`.`, `\`${from}\` comparte la noticia con \`${who}\`.`, `\`${from}\` le regala un bebé a \`${who}\`.`])
            query = 'anime preg'
            break
        case 'run': case 'correr':
            str = isSelf 
                ? randomPhrase([`\`${from}\` está corriendo.`, `\`${from}\` huye.`, `\`${from}\` hace ejercicio.`]) 
                : randomPhrase([`\`${from}\` corre con \`${who}\`.`, `\`${from}\` huye de \`${who}\`.`, `\`${from}\` persigue a \`${who}\`.`])
            query = 'anime run'
            break
        case 'sad': case 'triste':
            str = isSelf 
                ? randomPhrase([`\`${from}\` está triste.`, `\`${from}\` se siente melancólico.`, `\`${from}\` tiene un ánimo bajo.`]) 
                : randomPhrase([`\`${from}\` está triste por \`${who}\`.`, `\`${from}\` piensa en \`${who}\` con tristeza.`, `\`${from}\` necesita a \`${who}\`.`])
            query = 'anime sad'
            break
        case 'scared': case 'asustada': case 'asustado':
            str = isSelf 
                ? randomPhrase([`\`${from}\` se asusta.`, `\`${from}\` está aterrorizado.`, `\`${from}\` se sobresalta.`]) 
                : randomPhrase([`\`${from}\` está asustado de \`${who}\`.`, `\`${from}\` huye de \`${who}\`.`, `\`${from}\` se esconde de \`${who}\`.`])
            query = 'anime scared'
            break
        case 'seduce': case 'seducir':
            str = isSelf 
                ? randomPhrase([`\`${from}\` se seduce a sí mismo.`, `\`${from}\` practica sus movimientos.`, `\`${from}\` lanza una mirada seductora.`]) 
                : randomPhrase([`\`${from}\` intenta seducir a \`${who}\`.`, `\`${from}\` le lanza una mirada a \`${who}\`.`, `\`${from}\` intenta conquistar a \`${who}\`.`])
            query = 'anime seduce'
            break
        case 'shy': case 'timido': case 'timida':
            str = isSelf 
                ? randomPhrase([`\`${from}\` está tímido.`, `\`${from}\` se avergüenza.`, `\`${from}\` se pone rojo.`]) 
                : randomPhrase([`\`${from}\` se pone tímido frente a \`${who}\`.`, `\`${from}\` se avergüenza por \`${who}\`.`, `\`${from}\` baja la mirada ante \`${who}\`.`])
            query = 'anime shy'
            break
        case 'walk': case 'caminar':
            str = isSelf 
                ? randomPhrase([`\`${from}\` está caminando.`, `\`${from}\` sale a pasear.`, `\`${from}\` se da una vuelta.`]) 
                : randomPhrase([`\`${from}\` está caminando con \`${who}\`.`, `\`${from}\` y \`${who}\` salen a caminar.`, `\`${from}\` pasea junto a \`${who}\`.`]) 
            query = 'anime walk' 
            break
        case 'dramatic': case 'drama':
            str = isSelf 
                ? randomPhrase([`\`${from}\` actúa dramáticamente.`, `\`${from}\` hace un show.`, `\`${from}\` exagera su reacción.`]) 
                : randomPhrase([`\`${from}\` actúa dramáticamente por \`${who}\`.`, `\`${from}\` le hace una escena a \`${who}\`.`, `\`${from}\` se comporta de forma exagerada con \`${who}\`.`])
            query = 'anime dramatic'
            break
        case 'kisscheek': case 'beso':
            str = isSelf 
                ? randomPhrase([`\`${from}\` se besa la mejilla.`, `\`${from}\` se da un beso a sí mismo.`, `\`${from}\` se consuela.`]) 
                : randomPhrase([`\`${from}\` besa la mejilla de \`${who}\`.`, `\`${from}\` le da un beso tierno a \`${who}\`.`, `\`${from}\` muestra afecto en la mejilla de \`${who}\`.`])
            query = 'anime kisscheek'
            break
        case 'wink': case 'guiñar':
            str = isSelf 
                ? randomPhrase([`\`${from}\` se guiña el ojo.`, `\`${from}\` es coqueto.`, `\`${from}\` hace un gesto de complicidad.`]) 
                : randomPhrase([`\`${from}\` le guiña el ojo a \`${who}\`.`, `\`${from}\` le lanza un guiño a \`${who}\`.`, `\`${from}\` le hace un gesto de complicidad a \`${who}\`.`])
            query = 'anime wink'
            break
        case 'cringe': case 'avergonzarse':
            str = isSelf 
                ? randomPhrase([`\`${from}\` siente vergüenza ajena.`, `\`${from}\` se encoge.`, `\`${from}\` se avergüenza.`]) 
                : randomPhrase([`\`${from}\` siente vergüenza ajena por \`${who}\`.`, `\`${from}\` no puede creer a \`${who}\`.`, `\`${from}\` se avergüenza por el acto de \`${who}\`.`])
            query = 'anime cringe'
            break
        case 'smug': case 'presumir':
            str = isSelf 
                ? randomPhrase([`\`${from}\` está presumiendo.`, `\`${from}\` se siente superior.`, `\`${from}\` muestra arrogancia.`]) 
                : randomPhrase([`\`${from}\` presume frente a \`${who}\`.`, `\`${from}\` se siente superior a \`${who}\`.`, `\`${from}\` se jacta de \`${who}\`.`])
            query = 'anime smug'
            break
        case 'smile': case 'sonreir':
            str = isSelf 
                ? randomPhrase([`\`${from}\` está sonriendo.`, `\`${from}\` sonríe amablemente.`, `\`${from}\` muestra su felicidad.`]) 
                : randomPhrase([`\`${from}\` le sonríe a \`${who}\`.`, `\`${from}\` comparte una sonrisa con \`${who}\`.`, `\`${from}\` se alegra por \`${who}\`.`])
            query = 'anime smile'
            break
        case 'highfive': case '5':
            str = isSelf 
                ? randomPhrase([`\`${from}\` se choca los cinco solo.`, `\`${from}\` celebra su victoria.`, `\`${from}\` se da un "buen trabajo".`]) 
                : randomPhrase([`\`${from}\` choca los cinco con \`${who}\`.`, `\`${from}\` celebra con \`${who}\`.`, `\`${from}\` saluda a \`${who}\` con un *high five*.`])
            query = 'anime highfive'
            break
        case 'handhold': case 'mano':
            str = isSelf 
                ? randomPhrase([`\`${from}\` se agarra la mano a sí mismo.`, `\`${from}\` busca su propio apoyo.`, `\`${from}\` une sus manos.`]) 
                : randomPhrase([`\`${from}\` agarra la mano de \`${who}\`.`, `\`${from}\` camina de la mano con \`${who}\`.`, `\`${from}\` busca la cercanía de \`${who}\`.`])
            query = 'anime handhold'
            break
        case 'bullying': case 'bully':
            str = isSelf 
                ? randomPhrase([`\`${from}\` se auto-critica.`, `\`${from}\` es duro consigo mismo.`, `\`${from}\` se molesta a sí mismo.`]) 
                : randomPhrase([`\`${from}\` molesta a \`${who}\`.`, `\`${from}\` le hace bullying a \`${who}\`.`, `\`${from}\` se burla de \`${who}\`.`])
            query = 'anime bullying'
            break
        case 'wave': case 'hola': case 'ola':
            str = isSelf 
                ? randomPhrase([`\`${from}\` saluda.`, `\`${from}\` se despide.`, `\`${from}\` levanta la mano.`]) 
                : randomPhrase([`\`${from}\` saluda a \`${who}\`.`, `\`${from}\` le dice hola a \`${who}\`.`, `\`${from}\` se despide de \`${who}\`.`])
            query = 'anime wave'
            break
    }
    
    if (!query) return 
    
    try {
        const res = await fetch(`${global.APIs.delirius.url}/search/tenor?q=${query}`)
        const json = await res.json()
        const gifs = json.data
        
        if (!gifs || gifs.length === 0) return m.reply('No se encontraron resultados para esta acción.')
        
        const randomGifUrl = gifs[Math.floor(Math.random() * gifs.length)].mp4
        
        const gifResponse = await fetch(randomGifUrl)
        const gifBuffer = await gifResponse.buffer()
        
        conn.sendMessage(m.chat, 
            { 
                video: gifBuffer, 
                caption: str, 
                mimetype: 'video/mp4', 
                gifPlayback: true,
                mentions: [userId].filter(jid => jid)
            }, 
            { quoted: m }
        )
    } catch (e) {
        return m.reply(`Error al buscar o enviar el GIF. Intenta de nuevo.`)
    }
}

handler.help = ['angry', 'enojado', 'bath', 'bañarse', 'bite', 'morder', 'bleh', 'lengua', 'blush', 'sonrojarse', 'bored', 'aburrido', 'clap', 'aplaudir', 'coffee', 'cafe', 'café', 'cry', 'llorar', 'cuddle', 'acurrucarse', 'dance', 'bailar', 'drunk', 'borracho', 'eat', 'comer', 'facepalm', 'palmada', 'happy', 'feliz', 'hug', 'abrazar', 'kill', 'matar', 'kiss', 'muak', 'laugh', 'reirse', 'lick', 'lamer', 'slap', 'bofetada', 'sleep', 'dormir', 'smoke', 'fumar', 'spit', 'escupir', 'step', 'pisar', 'think', 'pensar', 'love', 'enamorado', 'enamorada', 'pat', 'palmadita', 'palmada', 'poke', 'picar', 'pout', 'pucheros', 'punch', 'pegar', 'golpear', 'preg', 'preñar', 'embarazar', 'run', 'correr', 'sad', 'triste', 'scared', 'asustada', 'asustado', 'seduce', 'seducir', 'shy', 'timido', 'timida', 'walk', 'caminar', 'dramatic', 'drama', 'kisscheek', 'beso', 'wink', 'guiñar', 'cringe', 'avergonzarse', 'smug', 'presumir', 'smile', 'sonreir', 'clap', 'aplaudir', 'highfive', '5', 'bully', 'bullying', 'mano', 'handhold', 'ola', 'wave', 'hola']
handler.tags = ['anime']
handler.command = ['angry', 'enojado', 'bath', 'bañarse', 'bite', 'morder', 'bleh', 'lengua', 'blush', 'sonrojarse', 'bored', 'aburrido', 'clap', 'aplaudir', 'coffee', 'cafe', 'café', 'cry', 'llorar', 'cuddle', 'acurrucarse', 'dance', 'bailar', 'drunk', 'borracho', 'eat', 'comer', 'facepalm', 'palmada', 'happy', 'feliz', 'hug', 'abrazar', 'kill', 'matar', 'kiss', 'muak', 'laugh', 'reirse', 'lick', 'lamer', 'slap', 'bofetada', 'sleep', 'dormir', 'smoke', 'fumar', 'spit', 'escupir', 'step', 'pisar', 'think', 'pensar', 'love', 'enamorado', 'enamorada', 'pat', 'palmadita', 'palmada', 'poke', 'picar', 'pout', 'pucheros', 'punch', 'pegar', 'golpear', 'preg', 'preñar', 'embarazar', 'run', 'correr', 'sad', 'triste', 'scared', 'asustada', 'asustado', 'seduce', 'seducir', 'shy', 'timido', 'timida', 'walk', 'caminar', 'dramatic', 'drama', 'kisscheek', 'beso', 'wink', 'guiñar', 'cringe', 'avergonzarse', 'smug', 'presumir', 'smile', 'sonreir', 'clap', 'aplaudir', 'highfive', '5', 'bully', 'bullying', 'mano', 'handhold', 'ola', 'wave', 'hola']
handler.group = true

export default handler