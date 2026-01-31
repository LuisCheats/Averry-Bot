import { cpus as _cpus, totalmem, freemem, platform, hostname } from 'os'
import { execSync } from 'child_process'
import { sizeFormatter } from 'human-readable'

let format = sizeFormatter({ std: 'JEDEC', decimalPlaces: 2, keepTrailingZeroes: false, render: (literal, symbol) => `${literal} ${symbol}B` })

function getCPUUsage() {
    try {
        const cpus = _cpus()
        let totalIdle = 0, totalTick = 0
        cpus.forEach(cpu => {
            for (let type in cpu.times) {
                totalTick += cpu.times[type]
            }
            totalIdle += cpu.times.idle
        })
        return `${(100 - (100 * totalIdle / totalTick)).toFixed(1)}%`
    } catch {
        return 'N/A'
    }
}

let handler = async (m, { conn }) => {
let totalUsers = Object.keys(global.db.data.users).length
let totalChats = Object.keys(global.db.data.chats).length
let totalPlugins = Object.values(global.plugins).filter((v) => v.help && v.tags).length
let totalBots = global.conns.filter(conn => conn.user && conn.ws.socket && conn.ws.socket.readyState !== 3).length
let totalCommands = Object.values(global.db.data.users).reduce((acc, user) => acc + (user.commands || 0), 0)
let system = `「✦」Estado de *${botname}* [MAIN]

❒ RAM [MAIN]: *${format(process.memoryUsage().rss)}*
❒ CPU (x${_cpus().length}): *${getCPUUsage()}*
✿ Bots activos: *${totalBots}*
✐ Comandos: *${toNum(totalCommands)}*
❒ Usuarios: *${totalUsers.toLocaleString()}*
❒ Grupos: *${totalChats.toLocaleString()}*
❒ Plugins: *${totalPlugins}*

◤ Sistema:
    *✦ Plataforma:* ${platform()} ${process.arch}
    *✦ RAM Total:* ${format(totalmem())}
    *✦ RAM Usada:* ${format(totalmem() - freemem())}
    *✦ Host:* ${hostname().slice(0, 8)}...`
await conn.reply(m.chat, system, m, (global.rcanalr || {}))
}

handler.help = ['estado']
handler.tags = ['main']
handler.command = ['estado', 'status']
handler.group = true

export default handler

function toNum(number) {
if (number >= 1000 && number < 1000000) {
return (number / 1000).toFixed(1) + 'k'
} else if (number >= 1000000) {
return (number / 1000000).toFixed(1) + 'M'
} else {
return number.toString()
}}