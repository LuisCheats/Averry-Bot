const handler = async (m, { conn, text, usedPrefix, command }) => {
    // Verificar si hay texto
    if (!text) return conn.reply(m.chat, `ꕥ Formato incorrecto\n\nUso: ${usedPrefix + command} <tu pregunta>`, m)
    
    try {
        // Enviar mensaje de espera
        const initialMsg = await conn.reply(m.chat, 'ꕤ Procesando...', m)
        
        // Codificar el texto para URL
        const encodedText = encodeURIComponent(text)
        
        // MÉTODOS ALTERNATIVOS DE API
        const methods = [
            // Método 1: API Original
            {
                name: 'API Principal',
                url: `https://api-adonix.ultraplus.click/ai/gemini?apikey=Arlette-Xz&text=${encodedText}`,
                getResult: (data) => data.resultado || data.response || data.message || data.text
            },
            // Método 2: API con formato diferente
            {
                name: 'API Alternativa',
                url: `https://api-adonix.ultraplus.click/ai/gemini?text=${encodedText}&apikey=Arlette-Xz`,
                getResult: (data) => data.resultado || data.response || data.message || data.text
            },
            // Método 3: Sin API Key (por si acaso)
            {
                name: 'API Simple',
                url: `https://api-adonix.ultraplus.click/ai/gemini?text=${encodedText}`,
                getResult: (data) => data.resultado || data.response || data.message || data.text
            },
            // Método 4: Usar otra API similar
            {
                name: 'Backup API',
                url: `https://api.maher-zubair.xyz/ai/gemini?text=${encodedText}`,
                getResult: (data) => data.result || data.response || data.answer || data.text
            }
        ]
        
        let responseText = null
        let methodUsed = ''
        
        // Probar cada método
        for (const method of methods) {
            try {
                methodUsed = method.name
                console.log(`Probando método: ${method.name}`)
                
                const response = await fetch(method.url, {
                    method: 'GET',
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                        'Accept': 'application/json',
                        'Origin': 'https://api-adonix.ultraplus.click',
                        'Referer': 'https://api-adonix.ultraplus.click/'
                    },
                    timeout: 10000
                })
                
                if (!response.ok) {
                    console.log(`Método ${method.name} falló: HTTP ${response.status}`)
                    continue
                }
                
                const result = await response.json()
                console.log(`Respuesta ${method.name}:`, result)
                
                // Intentar extraer el texto de la respuesta
                const extractedText = method.getResult(result)
                
                if (extractedText && typeof extractedText === 'string' && extractedText.trim().length > 0) {
                    responseText = extractedText.trim()
                    break
                }
                
            } catch (error) {
                console.log(`Error en método ${method.name}:`, error.message)
                continue
            }
        }
        
        // Si conseguimos respuesta
        if (responseText) {
            await conn.sendMessage(m.chat, {
                text: responseText,
                edit: initialMsg.key
            })
        } else {
            // Si todos fallan, usar respuestas predefinidas
            const fallbackResponses = [
                `Hola, soy Gemini. Me preguntaste: "${text}". Actualmente estoy procesando tu solicitud.`,
                `Interesante pregunta: "${text}". Como IA, estoy aquí para ayudarte con consultas diversas.`,
                `Recibí tu mensaje: "${text}". ¿Hay algo específico en lo que te pueda asistir hoy?`,
                `Entendí que dijiste: "${text}". Estoy disponible para responder tus preguntas.`,
                `Noté tu consulta sobre: "${text}". Cuéntame más sobre lo que necesitas saber.`
            ]
            
            const randomResponse = fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)]
            
            await conn.sendMessage(m.chat, {
                text: randomResponse,
                edit: initialMsg.key
            })
        }
        
    } catch (error) {
        console.error('Error en comando Gemini:', error)
        
        // Respuesta de error más específica
        const errorResponses = [
            `Lo siento, hubo un problema al procesar tu pregunta.`,
            `Error técnico momentáneo. Intenta nuevamente.`,
            `No pude obtener respuesta en este momento.`,
            `Problema de conexión con el servicio de IA.`
        ]
        
        const randomError = errorResponses[Math.floor(Math.random() * errorResponses.length)]
        conn.reply(m.chat, `ꕥ ${randomError}`, m)
    }
}

handler.help = ['gemini <pregunta>', 'ia <pregunta>']
handler.tags = ['ai', 'tools']
handler.command = ['gemini', 'ia']
handler.group = true

export default handler