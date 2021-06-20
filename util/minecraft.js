/**
 * @description A module for pinging Minecraft servers for the server-list information.
 */

const { Socket } = require("dgram");
const net = require("net");
String.prototype.hexEncode = () => {
    let hex, i;

    let result = "";
    for (i = 0; i < this.length; i++) {
        hex = this.charCodeAt(i).toString(16);
        result += ("000" + hex).slice(-4);
    }

    return result;
};
/**
 *
 * @param {Buffer} buf
 */
function readVarInt(buf, idx) {
    let numRead = 0;
    let result = 0;
    let originalIdx = idx;
    let read;
    do {
        read = buf.readUInt8(idx);
        idx++;
        let value = read & 0b01111111;
        result |= value << (7 * numRead);

        numRead++;
        if (numRead > 5) {
            throw new Error("VarInt is too big");
        }
    } while ((read & 0b10000000) != 0);

    return [result, idx - originalIdx];
}

function writeVarInt(value) {
    let b = [];
    do {
        let temp = value & 0b01111111;
        // Note: >>> means that the sign bit is shifted with the rest of the number rather than being left alone
        value >>>= 7;
        if (value != 0) {
            temp |= 0b10000000;
        }
        b.push(temp);
    } while (value != 0);
    return b;
}

function padArray(array, length) {
    while (array.length < length) { array.unshift(0); }
}

function sleep(t) { return new Promise((a, r) => setTimeout(a, t)); }

/**
 * @typedef {Object} Player
 * @property {String} name
 *
 * @typedef {Object} Chat This hasn't been documented yet. See https://wiki.vg/Chat for more info.
 *                        `pingModernMinecraftServer` is the only method where this can be more than just, as with that method section code parsing is done on the server{"text": "{the server's description}"}
 *
 * @typedef {Object} Players
 * @property {Number} online The amount of players currently online
 * @property {Number} max The server's player cap.
 * @property {Array<Player>} sample
 *                    A handful of people online on the server.
 *                    `pingModernMinecraftServer` is the only method where this isn't always an empty array.
 *
 * @typedef {Object} Version The version data returned by the server
 * @property {Number} protocol
 *                    The numeric protocol ID the server is using. See https://wiki.vg/Protocol_version_numbers.
 *                    `pingAncientMinecraftServer` will always return -1 for this. Not all servers return their actual protocol ID, especially those that support multiple versions of the game.
 * @property {String} name
 *                    The version name of the server software, i.e. `1.16.4` for vanilla servers, `Paper 1.16.4` for a Paper modded server
 *                    `pingAncientMinecraftServer` will always return "pre-1.4" for this. Servers are free to return whatever they like for this, and some servers even use an IP database to return "Hi, {playername}" for this field.
 *
 * @typedef {Object} ServerPing
 * @property {Version} version The version of the server
 * @property {Players} players The amount of players online
 * @property {Chat} description The description (MOTD) of the server
 * @property {String?} favicon The favicon of the server. This will be null if you're not using `pingModernMinecraftServer` or the server doesn't have one.
 */




/**
 * Pings a 1.7+ Minecraft server. This returns more data than the pingMinecraftServer method, however, it requires a 1.7 server or later.
 * @param {String} server Server IP address
 * @param {Number} port Server port
 * @param {Object} opts Options
 * @param {Number} opts.oneSevenProtocolVersion Protocol version to use when talking to the server. Defaults to 754 (1.16.4). See: https://wiki.vg/Protocol_version_numbers
 * @param {Number} opts.timeout Protocol version to use when talking to a 1.6+ server. Defaults to '72' (1.16.2)
 * @returns {ServerPing}
 */
async function pingModernMinecraftServer(server, port, opts) {
    return new Promise((a, r) => {
        opts = opts || {};
        let done = false;
        const conn = net.createConnection(port, server, async() => {
            setTimeout(() => {
                if (!conn.destroyed) {
                    conn.destroy();
                    r(new Error("Timed out"));
                }
            }, opts.timeout || 5000);
            // conn.write = console.log
            let versionCode = writeVarInt(opts.oneSevenProtocolVersion || 754);
            let serverAddress = Buffer.from(server, "utf8");
            let serverAddressLength = writeVarInt(serverAddress.byteLength);
            // Write packet header
            conn.write(new Uint8Array([...writeVarInt(4 + versionCode.length + serverAddress.length + serverAddressLength.length), 0x00]));
            // write handshake
            conn.write(new Uint8Array(versionCode));
            conn.write(new Uint8Array(serverAddressLength));
            conn.write(serverAddress);
            conn.write(new Uint8Array([port >> 8, port & 255]));
            conn.write(new Uint8Array([0x01]));

            // request status
            conn.write(new Uint8Array([0x01, 0x00]));
        });
        conn.on("error", (e) => {
            if (!conn.destroyed) {
                conn.destroy();
                r(e);
            }
        });
        let length;
        let bytesRecieived = "";
        let bRecieved = 0;
        let headerSize = 0;
        conn.on("data",
        /**
         * @param {Buffer} d
         */
            (d) => {
                bRecieved += d.byteLength;
                if (!length) {
                    let varint = readVarInt(d, 0);
                    length = varint[0] + varint[1];
                    headerSize = varint[1] + readVarInt(d, varint[1] + 1)[1];
                    d = d.slice(headerSize + 1);
                }
                bytesRecieived += d.toString("utf-8");



                if (bRecieved >= length) {
                    conn.destroy();

                    let b = bytesRecieived.split("{");
                    b.shift();
                    bytesRecieived = "{" + b.join("{");
                    return a(JSON.parse(bytesRecieived));
                }
            });
        conn.on("close", () => {
            if (!done) {
                r(new Error("Server closed the socket"));
            }
            conn.destroy();
        });
    });
}


/**
 * This works on 1.4 and later servers, however it retrieves less data than the pingModernMinecraftServer method
 * @param {String} server Server IP address
 * @param {Number} port Server port
 * @param {Object} opts Options
 * @param {Number} opts.oneSixUpgradeTimeout Time in ms to wait before assuming it's not a 1.4/1.5 server
 * @param {Number} opts.oneSevenProtocolVersion Protocol version to use when talking to a 1.6+ server. Defaults to '74' (1.6.2, latest)
 * @returns {ServerPing}
 */
async function pingMinecraftServer(server, port, opts) {
    return new Promise((a, r) => {
        opts = opts || {};
        let protocolVersion = 0;
        let done = false;
        const conn = net.createConnection(port, server, async() => {
            protocolVersion = 2;
            conn.write(new Uint8Array([0xfe, 0x01]));
            await sleep(opts.oneSixUpgradeTimeout || 50);
            if (!conn.writable) return;
            protocolVersion = 3;
            conn.write(new Uint8Array([0xfa, 0x00, 0x0b]));
            conn.write(Buffer.from("MC|PingHost", "utf16le").swap16());
            let hostname = Buffer.from(server, "utf16le").swap16();
            conn.write(new Uint8Array([0x00, hostname.byteLength + 7, opts.oneSevenProtocolVersion || 74, 0x00, server.length]));
            conn.write(hostname);
            conn.write(new Uint8Array([0, 0, port >> 8, port & 255]));
        });
        conn.on("error", (e) => {
            if (!conn.destroyed) {
                conn.destroy();
                r(e);
            }
        });
        conn.on("data", (d) => {
            done = true;
            let data = d.slice(9).swap16().toString("utf16le")
                .split(String.fromCharCode(0));
            console.log(data);
            a({
                version: {
                    protocol: parseInt(data[0]),
                    name: data[1]
                },
                players: {
                    online: parseInt(data[3]),
                    max: parseInt(data[4]),
                    sample: []
                },
                description: {
                    text: data[2]
                }
            });
            conn.destroy();
        });
        conn.on("close", () => {
            if (!done) {
                r(new Error("Server closed the socket"));
            }
        });
    });
}


/**
 * Pings a **very old** Minecraft server (versions before 1.4)
 * @param {String} server
 * @param {Number} port
 * @returns {ServerPing} The information returned by the server
 */
async function pingAncientMinecraftServer(server, port) {
    return new Promise((a, r) => {
        let protocolVersion = 0;
        let done = false;
        const conn = net.createConnection(port, server, async() => {
            protocolVersion = 2;
            conn.write(new Uint8Array([0xfe]));
        });
        conn.on("error", (e) => {
            if (!conn.destroyed) {
                conn.destroy();
                r(e);
            }
        });
        conn.on("data", (d) => {
            let data = d.slice(1).swap16().toString("utf16le")
                .substr(1)
                .split("§");
            if (data.length != 3) {
                return r(new Error("Failed to parse pre-1.4 data"));
            }
            console.log(data);
            a({
                version: {
                    protocol: -1,
                    name: "pre-1.4"
                },
                players: {
                    online: parseInt(data[1]),
                    max: parseInt(data[2]),
                    sample: []
                },
                description: {
                    text: data[0]
                }
            });

            conn.destroy();
        });
        conn.on("close", () => {
            if (!done) {
                r(new Error("Server closed the socket"));
            }
        });
    });
}

module.exports = { pingAncientMinecraftServer, pingMinecraftServer, pingModernMinecraftServer };

