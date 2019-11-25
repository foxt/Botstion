function randomString(length, chars) {
    var result = '';
    for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
    return result;
}

module.exports = function(db) {
    function generateId() {
        var id = randomString(5,"abcdefghijklmnopqrstuvwxyz")
        var elem = await db.tables.modEvent.findOne({ where: { eventId: id } });
        if (elem) {
            return generateId()
        } else {
            return id   
        }
    }
    function funct(type,victim,staff,reason) {
        var userId = victim.toString()
        if (victim.id) {
            userId = victim.id
        }
        var staffId = staff.toString()
        if (staff.id) {
            staffId = staff.id
        }
        if (type == "strike") {type = 0}
        if (type == "kick") {type = 1}
        if (type == "ban") {type = 2}
        if (type == "pardon") {type = 3}
        if (type == "mute") {type = 4}
        if (type == "unmute") {type = 5}
        if (type == "merit") {type = 6}

        var eventId = generateId()
        return db.tables.wallet.create({ eventId, type, userId, staffId,reason });
    }
    return funct
}