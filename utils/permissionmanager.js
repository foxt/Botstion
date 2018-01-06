const config = require("../config.json")
exports.userHasPerms = function(user) {
    if (config.globalroleoverrides.owner == user.id) return 5
    if (config.globalroleoverrides.maintainer.includes(user.id)) return 4
    if (config.globalroleoverrides.administrator.includes(user.id)) return 3
    if (config.globalroleoverrides.moderator.includes(user.id)) return 2
    if (config.globalroleoverrides.regular.includes(user.id)) return 1
    if (config.globalroleoverrides.banned.includes(user.id)) return 0
    return 1
}