const Discord = require("discord.js");
const bot = new Discord.Client;
exports.run = async(client,msg,args) => {
    var vc = msg.member.voiceChannel
    vc.join().then(connection => {
        const dispatcher = connection.playFile('C:\\Users\\theLMGN\\Documents\\GitHub\\botstion\\audio\\jeff.m4a');
        dispatcher.on("end", end => {
            msg.reply({embed:new Discord.RichEmbed()
                .setTitle("my name jeff")
                .setImage("http://i0.kym-cdn.com/entries/icons/original/000/016/894/mynameehhjeff.jpg")
                .setAuthor("Jeff","https://www.myinstants.com/media/instants_images/58402ada5d1146733928955486208_39c51c74d0f.jpg")
                .setColor("#23d160")})
            vc.leave();
        });
    })
}
exports.permission = 1
exports.help = {descrip: "jeff", example: "voicetest"}