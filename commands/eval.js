exports.run = async(Client,Message,Arguments) => {
    try {
        Message.reply(`\`\`\`${((new Function('c','m',Arguments.join(" ").replace("c.token"," 'nice try xd'"))(Client,Message))).toString().replace(Client.token,"fuck off.")}\`\`\``)
    } catch (err) {
        return Message.reply(`Woops, we had an error.\n\`\`\`${err}\`\`\``)
    }
}
exports.permission = 4
exports.help = {descrip: "Runs some JS.", example: "eval Message.reply(`Knock knock.`)"}