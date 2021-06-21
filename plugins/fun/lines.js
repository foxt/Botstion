const Discord = require("discord.js");
const fs = require("fs");

function thing(folder) {
    if (fs.lstatSync(folder).isDirectory()) {
        if (!folder.includes("node_modules") && !folder.includes("config") && !folder.includes(".DS_Store") && !folder.includes(".github") && !folder.includes(".vscode") && !folder.includes(".git")) {
            let lines = 0;
            let chars = 0;
            let files = 0;
            for (let folderr of fs.readdirSync(folder)) {
                let t = thing(folder + "/" + folderr);
                lines += t[0];
                chars += t[1];
                files += t[2];
            }
            return [lines, chars, files];
        }
    } else if (folder.includes(".") && !folder.endsWith(".json")) { // remove files that have no extension
        if (folder.split(".")[folder.split(".").length - 1] == "js") {
            let txt = fs.readFileSync(folder).toString();

            return [txt.split("\n").length, txt.length, 1];
        }
    }
    return [0, 0, 0];
}

module.exports = {
    name: "Lines of Code",
    author: "theLMGN",
    version: 1,
    description: "A command that shows all the lines of code in js files, excluding node_modules.",
    commands: [
        {
            name: "lines",
            description: "A command that shows all the lines of code in js files, excluding node_modules.",
            category: "Meta",
            execute: async (c, m) => {
                let t = thing(".");
                m.reply(new Discord.MessageEmbed()
                    .setColor("#23d160")
                    .setDescription(`:keyboard: I searched, and I found:\n ${t[0]} lines of JavaScript over ${t[2]} files (avg. ${Math.floor(t[0] / t[2])} lines per file)!\n${t[1].toLocaleString("en")} total characters in all JavaScript files (for an average of ${Math.floor(t[1] / t[2]).toLocaleString("en")} characters per file). \n(excluding those in node_modules)`));
            }
        }
    ]
};
