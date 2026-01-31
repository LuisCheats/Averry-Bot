const _0x4a2721 = _0x58fc;
(function (_0x3d2e20, _0x1cf985) {
    const _0x35d585 = _0x58fc,
        _0x1125e6 = _0x3d2e20();
    while (!![]) {
        try {
            const _0x43816b = parseInt(_0x35d585(0x174)) / 0x1 * (parseInt(_0x35d585(0x196)) / 0x2) + parseInt(_0x35d585(0x180)) / 0x3 * (-parseInt(_0x35d585(0x17d)) / 0x4) + -parseInt(_0x35d585(0x194)) / 0x5 * (parseInt(_0x35d585(0x187)) / 0x6) + -parseInt(_0x35d585(0x188)) / 0x7 * (parseInt(_0x35d585(0x17a)) / 0x8) + parseInt(_0x35d585(0x199)) / 0x9 + -parseInt(_0x35d585(0x172)) / 0xa * (parseInt(_0x35d585(0x195)) / 0xb) + -parseInt(_0x35d585(0x183)) / 0xc * (-parseInt(_0x35d585(0x177)) / 0xd);
            if (_0x43816b === _0x1cf985) break;
            else _0x1125e6['push'](_0x1125e6['shift']());
        } catch (_0x33fe63) {
            _0x1125e6['push'](_0x1125e6['shift']());
        }
    }
}(_0x3419, 0xc566b));
import {
    promises as _0x492c88
} from 'fs';

function _0x58fc(_0x50aa82, _0x261b00) {
    const _0x341924 = _0x3419();
    return _0x58fc = function (_0x58fce3, _0x3d1f78) {
        _0x58fce3 = _0x58fce3 - 0x16b;
        let _0x1793e0 = _0x341924[_0x58fce3];
        return _0x1793e0;
    }, _0x58fc(_0x50aa82, _0x261b00);
}
let proposals = {};
const verifi = async () => {
    const _0x3a0b31 = _0x58fc;
    try {
        const _0x17bfce = await _0x492c88['readFile']('./package.json', _0x3a0b31(0x193)),
            _0x56a1d2 = JSON[_0x3a0b31(0x179)](_0x17bfce);
        return _0x56a1d2[_0x3a0b31(0x191)]?.[_0x3a0b31(0x178)] === 'git+https://github.com/Arlette-Xz/Shiroko-Bot.git';
    } catch {
        return ![];
    }
};
let handler = async (_0x11b3ac, {
    conn: _0xb50a6f,
    command: _0x484021,
    usedPrefix: _0x48fb5c,
    args: _0x5cd0ae
}) => {
    const _0x5f24b5 = _0x58fc;
    if (!await verifi()) return _0xb50a6f[_0x5f24b5(0x16c)](_0x11b3ac[_0x5f24b5(0x171)], _0x5f24b5(0x18a) + _0x484021 + _0x5f24b5(0x16d), _0x11b3ac);
    try {
        switch (_0x484021) {
            case _0x5f24b5(0x173):
                {
                    let _0x375e6d = _0x11b3ac[_0x5f24b5(0x198)],
                        _0x1e5d50 = await _0x11b3ac[_0x5f24b5(0x176)],
                        _0x4541bc = _0x1e5d50 && _0x1e5d50[_0x5f24b5(0x18d)] > 0x0 ? _0x1e5d50[0x0] : _0x11b3ac[_0x5f24b5(0x18f)] ? await _0x11b3ac[_0x5f24b5(0x18f)][_0x5f24b5(0x198)] : null;
                    if (!_0x4541bc) {
                        await _0xb50a6f['reply'](_0x11b3ac[_0x5f24b5(0x171)], _0x5f24b5(0x16f), _0x11b3ac);
                        return;
                    }
                    if (_0x375e6d === _0x4541bc) {
                        await _0x11b3ac[_0x5f24b5(0x16c)](_0x5f24b5(0x19a));
                        return;
                    }
                    if (global['db']['data'][_0x5f24b5(0x18c)][_0x375e6d]['marry']) {
                        const _0x21ffc2 = global['db'][_0x5f24b5(0x185)][_0x5f24b5(0x18c)][_0x375e6d]['marry'];
                        await _0xb50a6f[_0x5f24b5(0x16c)](_0x11b3ac[_0x5f24b5(0x171)], _0x5f24b5(0x197) + '@' + _0x21ffc2.split('@')[0] + '', _0x11b3ac, {
                            mentions: [_0x21ffc2]
                        });
                        return;
                    }
                    if (global['db'][_0x5f24b5(0x185)][_0x5f24b5(0x18c)][_0x4541bc][_0x5f24b5(0x173)]) {
                        const _0x1afaaa = global['db'][_0x5f24b5(0x185)][_0x5f24b5(0x18c)][_0x4541bc][_0x5f24b5(0x173)];
                        await _0xb50a6f[_0x5f24b5(0x16c)](_0x11b3ac['chat'], _0x5f24b5(0x192) + '@' + _0x4541bc.split('@')[0] + _0x5f24b5(0x184) + '@' + _0x1afaaa.split('@')[0] + '', _0x11b3ac, {
                            mentions: [_0x4541bc, _0x1afaaa]
                        });
                        return;
                    }
                    setTimeout(() => {
                        proposals[_0x375e6d] && delete proposals[_0x375e6d];
                    }, 0x1d4c0);
                    proposals[_0x4541bc] && proposals[_0x4541bc] === _0x375e6d ? (delete proposals[_0x4541bc], global['db'][_0x5f24b5(0x185)][_0x5f24b5(0x18c)][_0x375e6d]['marry'] = _0x4541bc, global['db'][_0x5f24b5(0x185)][_0x5f24b5(0x18c)][_0x4541bc]['marry'] = _0x375e6d, await _0xb50a6f['reply'](_0x11b3ac[_0x5f24b5(0x171)], '✩.･:｡≻───── ⋆♡⋆ ─────.•:｡✩\x0a¡Se han Casado! ฅ^•ﻌ•^ฅ*:･ﾟ✧\x0a\x0a*•.¸♡ Esposo/a @' + _0x375e6d.split('@')[0] + '. ♡¸.•*\x0a*•.¸♡ Esposo/a @' + _0x4541bc.split('@')[0] + '. ♡¸.•*\x0a\x0a`Disfruten de su luna de miel`\x0a✩.･:｡≻───── ⋆♡⋆ ─────.•:｡✩', _0x11b3ac, {
                        mentions: [_0x375e6d, _0x4541bc]
                    })) : (proposals[_0x375e6d] = _0x4541bc, await _0xb50a6f[_0x5f24b5(0x16c)](_0x11b3ac[_0x5f24b5(0x171)], '♡ @' + _0x4541bc.split('@')[0] + _0x5f24b5(0x170) + '@' + _0x375e6d.split('@')[0] + _0x5f24b5(0x17f) + (_0x48fb5c + _0x484021) + ' ' + '@' + _0x375e6d.split('@')[0] + _0x5f24b5(0x186), _0x11b3ac, {
                        mentions: [_0x4541bc, _0x375e6d]
                    }));
                    break;
                }
            case _0x5f24b5(0x17c):
                {
                    let _0x4b3b60 = _0x11b3ac[_0x5f24b5(0x198)];
                    if (!global['db'][_0x5f24b5(0x185)][_0x5f24b5(0x18c)][_0x4b3b60][_0x5f24b5(0x173)]) {
                        await _0x11b3ac[_0x5f24b5(0x16c)](_0x5f24b5(0x181));
                        return;
                    }
                    let _0x2bd269 = global['db'][_0x5f24b5(0x185)][_0x5f24b5(0x18c)][_0x4b3b60]['marry'];
                    global['db'][_0x5f24b5(0x185)][_0x5f24b5(0x18c)][_0x4b3b60][_0x5f24b5(0x173)] = '', global['db'][_0x5f24b5(0x185)][_0x5f24b5(0x18c)][_0x2bd269]['marry'] = '', await _0xb50a6f['reply'](_0x11b3ac[_0x5f24b5(0x171)], _0x5f24b5(0x192) + '@' + _0x4b3b60.split('@')[0] + _0x5f24b5(0x175) + '@' + _0x2bd269.split('@')[0] + _0x5f24b5(0x17e), _0x11b3ac, {
                        mentions: [_0x4b3b60, _0x2bd269]
                    });
                    break;
                }
        }
    } catch (_0x34f458) {
        await _0x11b3ac['reply'](_0x5f24b5(0x18e) + _0x48fb5c + _0x5f24b5(0x182) + error[_0x5f24b5(0x17b)]);
    }
};
handler[_0x4a2721(0x190)] = [_0x4a2721(0x189)], handler[_0x4a2721(0x16b)] = [_0x4a2721(0x173), _0x4a2721(0x17c)], handler[_0x4a2721(0x19b)] = [_0x4a2721(0x173), _0x4a2721(0x17c)], handler[_0x4a2721(0x16e)] = !![];

function _0x3419() {
    const _0x573a74 = ['utf-8', '5YWaRDL', '2123pwcGqs', '332OKECzx', 'ꕤ Ya estás casado/a con ', 'sender', '14009490XJCZmi', 'ꕤ No puedes proponerte matrimonio a ti mismo.', 'command', 'help', 'reply', '> solo está disponible para Shiroko\x0a> https://github.com/Arlette-Xz/Shiroko-Bot.git', 'group', 'ꕤ Debes mencionar aún usuario o responder a su mensaje para proponer o aceptar matrimonio.\x0a> Ejemplo » *:marry @usuario* o responde a un mensaje con *:marry*', ', ', 'chat', '830XPVquo', 'marry', '2474GUwoOT', ' y ', 'mentionedJid', '25597897nYeFav', 'url', 'parse', '11606360SIJeRj', 'message', 'divorce', '4rTHQYY', ' se han divorciado.', ' te ha propuesto matrimonio, ¿aceptas?\x0a\x0a⚘ *Responde con:*\x0a> ● ', '2878833CrkIGL', '✎ Tú no estás casado con nadie.', 'report* para informarlo.\x0a\x0a', '12oxnWvH', ' ya está casado/a con @', 'data', ' para confirmar.\x0a> ● La propuesta expirará en 2 minutos.', '4208298iKwpxA', '7swqeLw', 'profile', 'ꕤ El comando *<', 'name', 'users', 'length', '⚠︎ Se ha producido un problema.\x0a> Usa *', 'quoted', 'tags', 'repository', 'ꕤ '];
    _0x3419 = function () {
        return _0x573a74;
    };
    return _0x3419();
}
export default handler;
