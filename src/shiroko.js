import { smsg } from "../lib/simple.js"
import { format } from "util"
import { fileURLToPath } from "url"
import path, { join } from "path"
import fs, { unwatchFile, watchFile } from "fs"
import chalk from "chalk"
import fetch from "node-fetch"
import ws from "ws"

const { proto } = (await import("@whiskeysockets/baileys")).default

const isNumber = x => typeof x === "number" && !isNaN(x)
const delay = ms => isNumber(ms) && new Promise(resolve => setTimeout(resolve, ms))

const groupMetadataCache = new Map()
const participantCache = new Map()
const commandCache = new Map()

export async function handler(chatUpdate) {
    this.msgqueque = this.msgqueque || []
    this.uptime = this.uptime || Date.now()
    if (!chatUpdate) return

    this.pushMessage(chatUpdate.messages).catch(console.error)
    let m = chatUpdate.messages[chatUpdate.messages.length - 1]
    if (!m) return
    if (global.db.data == null) await global.loadDatabase()

    try {
        m = smsg(this, m) || m
        if (!m || m.isBaileys) return
        m.exp = 0

        try {
            if (!global.db.data.users[m.sender]) {
                global.db.data.users[m.sender] = {
                    name: m.name, exp: 0, coin: 0, bank: 0, level: 0, health: 100, genre: "", birth: "", marry: "", description: "", packstickers: null, premium: false, premiumTime: 0, banned: false, bannedReason: "", commands: 0, afk: -1, afkReason: "", warn: 0
                }
            }
            if (!global.db.data.chats[m.chat]) {
                global.db.data.chats[m.chat] = {
                    isBanned: false, isMute: false, welcome: global.modes.welcome, sWelcome: "", sBye: "", detect: global.modes.detect, primaryBot: null, modoadmin: global.modes.modoadmin, antiLink: global.modes.antilink, nsfw: global.modes.nsfw, economy: global.modes.economy, gacha: global.modes.gacha
                }
            }
            if (!global.db.data.settings[this.user.jid]) {
                global.db.data.settings[this.user.jid] = {
                    self: global.modes.self, jadibotmd: global.modes.jadibotmd, autoread: global.modes.autoread, autoreaction: global.modes.autoreaction, anticall: global.modes.anticall
                }
            }
        } catch (e) {
            console.error(e)
        }

        if (typeof m.text !== "string") m.text = ""
        const user = global.db.data.users[m.sender]
        const chat = global.db.data.chats[m.chat]
        const settings = global.db.data.settings[this.user.jid]
        
        const isROwner = global.owner.some(num => num.replace(/[^0-9]/g, "") + "@s.whatsapp.net" === m.sender) || m.fromMe
        const isOwner = isROwner
        const isPrems = isROwner || global.prems.some(v => v.replace(/[^0-9]/g, "") + "@s.whatsapp.net" === m.sender) || user.premium
        const isOwners = [this.user.jid, ...global.owner.map(v => v + "@s.whatsapp.net")].includes(m.sender)

        if (opts["queque"] && m.text && !isPrems) {
            const queque = this.msgqueque
            queque.push(m.id || m.key.id)
            setTimeout(() => {
                const index = queque.indexOf(m.id || m.key.id)
                if (index !== -1) queque.splice(index, 1)
            }, 2000)
        }

        m.exp += Math.ceil(Math.random() * 10)
        let usedPrefix
        let groupMetadata, participants, userGroup, botGroup

        if (m.isGroup) {
            const now = Date.now()
            const cached = groupMetadataCache.get(m.chat)
            if (cached && (now - cached.timestamp) < 25000) {
                groupMetadata = cached.metadata
                participants = cached.participants
            } else {
                groupMetadata = await this.groupMetadata(m.chat).catch(() => ({}))
                participants = (groupMetadata.participants || []).map(p => ({ id: p.jid, jid: p.jid, lid: p.lid, admin: p.admin }))
                groupMetadataCache.set(m.chat, { metadata: groupMetadata, participants, timestamp: now })
            }
            userGroup = participants.find(u => this.decodeJid(u.jid) === m.sender) || {}
            botGroup = participants.find(u => this.decodeJid(u.jid) === this.user.jid) || {}
        } else {
            participants = []; userGroup = {}; botGroup = {}
        }

        const isRAdmin = userGroup?.admin === "superadmin"
        const isAdmin = isRAdmin || userGroup?.admin === "admin"
        const isBotAdmin = botGroup?.admin || false
        const ___dirname = path.join(path.dirname(fileURLToPath(import.meta.url)), "./commands")

        for (const name in global.plugins) {
            const plugin = global.plugins[name]
            if (!plugin || plugin.disabled) continue
            const __filename = join(___dirname, name)

            if (typeof plugin.all === "function") {
                plugin.all.call(this, m, { chatUpdate, __dirname: ___dirname, __filename, user, chat, settings }).catch(console.error)
            }

            if (!opts["restrict"] && plugin.tags?.includes("admin")) continue

            const strRegex = (str) => str.replace(/[|\\{}()[\]^$+*?.]/g, "\\$&")
            const pluginPrefix = plugin.customPrefix || this.prefix || global.prefix
            let match

            if (Array.isArray(pluginPrefix)) {
                for (const prefix of pluginPrefix) {
                    const regex = prefix instanceof RegExp ? prefix : new RegExp(strRegex(prefix))
                    const execResult = regex.exec(m.text)
                    if (execResult) { match = [execResult, regex]; break; }
                }
            } else {
                const regex = pluginPrefix instanceof RegExp ? pluginPrefix : new RegExp(strRegex(pluginPrefix))
                match = [regex.exec(m.text), regex]
            }

            if (typeof plugin.before === "function") {
                if (await plugin.before.call(this, m, { match, conn: this, participants, groupMetadata, userGroup, botGroup, isROwner, isOwner, isRAdmin, isAdmin, isBotAdmin, isPrems, chatUpdate, __dirname: ___dirname, __filename, user, chat, settings })) continue
            }

            if (typeof plugin !== "function") continue

            if (match && match[0] && (usedPrefix = match[0][0])) {
                const noPrefix = m.text.replace(usedPrefix, "")
                let [command, ...args] = noPrefix.trim().split(" ").filter(v => v)
                args = args || []
                let _args = noPrefix.trim().split(" ").slice(1)
                let text = _args.join(" ")
                command = (command || "").toLowerCase()

                const isAccept = plugin.command instanceof RegExp ? 
                                 plugin.command.test(command) :
                                 Array.isArray(plugin.command) ? 
                                 plugin.command.some(cmd => cmd instanceof RegExp ? cmd.test(command) : cmd === command) :
                                 typeof plugin.command === "string" ? 
                                 plugin.command === command : false

                global.comando = command
                if (!isOwners && settings.self) return
                if ((m.id.startsWith("NJX-") || (m.id.startsWith("BAE5") && m.id.length === 16) || (m.id.startsWith("B24E") && m.id.length === 20))) return

                if (chat.primaryBot && chat.primaryBot !== this.user.jid) {
                    const primaryBotConn = global.conns?.find(conn => conn.user.jid === chat.primaryBot && conn.ws.socket?.readyState !== ws.CLOSED)
                    const primaryBotInGroup = participants.some(p => p.jid === chat.primaryBot)
                    if (primaryBotConn && primaryBotInGroup || chat.primaryBot === global.conn.user.jid) {
                        return 
                    } else {
                        chat.primaryBot = null
                    }
                }

                if (!isAccept) continue
                m.plugin = name
                user.commands = (user.commands || 0) + 1

                if (chat.isBanned && !isAdmin && !isROwner && name !== "group-banchat.js") {
                    if (!chat.primaryBot || chat.primaryBot === this.user.jid) {
                        await m.reply((global.msg.aviso || "").replace('${botname}', global.botname).replace('${usedPrefix}', usedPrefix))
                        return
                    }
                }

                if (m.text && user.banned && !isROwner) {
                    if (!chat.primaryBot || chat.primaryBot === this.user.jid) {
                        m.reply((global.msg.mensaje || "").replace('${bannedReason}', user.bannedReason))
                        return
                    }
                }

                if (!isOwners && !m.chat.endsWith('g.us') && !/code|p|ping|qr|estado|status|infobot|botinfo|report|reportar|invite|join|logout|suggest|help|menu/gim.test(m.text)) return
                
                const adminMode = chat.modoadmin || false
                const wa = plugin.botAdmin || plugin.admin || plugin.group || plugin.command
                if (adminMode && !isOwner && m.isGroup && !isAdmin && wa) return

                const fail = plugin.fail || global.dfail
                if ((plugin.rowner || plugin.owner) && !isOwner) { fail("owner", m, this); continue }
                if (plugin.premium && !isPrems) { fail("premium", m, this); continue }
                if (plugin.group && !m.isGroup) { fail("group", m, this); continue }
                if (plugin.botAdmin && !isBotAdmin) { fail("botAdmin", m, this); continue }
                if (plugin.admin && !isAdmin) { fail("admin", m, this); continue }
                if (plugin.private && m.isGroup) { fail("private", m, this); continue }

                m.isCommand = true
                m.exp += plugin.exp ? parseInt(plugin.exp) : 10
                let extra = { match, usedPrefix, noPrefix, _args, args, command, text, conn: this, participants, groupMetadata, userGroup, botGroup, isROwner, isOwner, isRAdmin, isAdmin, isBotAdmin, isPrems, chatUpdate, __dirname: ___dirname, __filename, user, chat, settings }

                try {
                    await plugin.call(this, m, extra)
                } catch (err) {
                    m.error = err
                    console.error(err)
                } finally {
                    if (typeof plugin.after === "function") {
                        try { await plugin.after.call(this, m, extra) } catch (err) { console.error(err) }
                    }
                }
            }
        }
    } catch (err) {
        console.error(err)
    } finally {
        if (m && m.sender && global.db.data.users[m.sender]) {
            global.db.data.users[m.sender].exp += m.exp || 0
        }
        if (!opts["noprint"]) {
            import("../lib/print.js").then(ptr => ptr.default(m, this)).catch(() => {})
        }
    }
}

global.dfail = (type, m, conn) => {
    const msg = global.msg[type]
    if (msg) return conn.reply(m.chat, msg.replace('${comando}', global.comando), m, rcanal).then(_ => m.react('✖️'))
}

let file = global.__filename(import.meta.url, true)
watchFile(file, async () => {
    unwatchFile(file)
    console.log(chalk.magenta("Se actualizo 'shiroko.js'"))
    if (global.reloadHandler) console.log(await global.reloadHandler())
})
