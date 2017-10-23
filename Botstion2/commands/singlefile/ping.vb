Imports Discord
Imports Discord.WebSocket

Module ping
    Dim st As Date = DateTime.Now
    Async Sub pingFunc(msg As IUserMessage, client As DiscordSocketClient, prefix As String)
        Dim fields = New List(Of EmbedFieldBuilder)
        fields.Add(New EmbedFieldBuilder With {.IsInline = True, .Name = "Client Ping (CP)", .Value = client.Latency & "ms"})
        fields.Add(New EmbedFieldBuilder With {.IsInline = True, .Name = "Message Ping (MP)", .Value = (DateTime.Now - msg.CreatedAt).TotalMilliseconds & "ms"})
        Dim uptime = DateTime.Now - st
        fields.Add(New EmbedFieldBuilder With {.IsInline = True, .Name = "Uptime", .Value = uptime})
        fields.Add(New EmbedFieldBuilder With {.IsInline = True, .Name = "Guilds", .Value = client.Guilds.Count})
        fields.Add(New EmbedFieldBuilder With {.IsInline = True, .Name = "Status", .Value = client.ConnectionState.ToString})
        Await msg.Channel.SendMessageAsync(msg.Author.Mention, False, New EmbedBuilder With {
                                           .Author = New EmbedAuthorBuilder With {
                                                .Name = "Hi there!",
                                                .IconUrl = "https://cdn.discordapp.com/emojis/370224694005071872.png"
                                           },
                                           .Color = Color.DarkTeal,
                                           .Description = "Hi! I'm Botstion. A multipurpose, [open source (GPLv3)](https://github.com/thelmgn) Discord bot made by theLMGN using Discord.NET",
                                           .Fields = fields,
                                           .Footer = Module1.getfooter(msg),
                                           .Timestamp = DateTimeOffset.Now})
    End Sub
    Async Sub guildFunc(msg As IUserMessage, client As DiscordSocketClient, prefix As String)
        Dim fields = New List(Of EmbedFieldBuilder)
        For Each guild As SocketGuild In client.Guilds
            fields.Add(New EmbedFieldBuilder With {.IsInline = False, .Name = guild.Name, .Value = guild.MemberCount & " members. [Click for the icon](" & guild.IconUrl & ")"})
        Next
        Await msg.Channel.SendMessageAsync(msg.Author.Mention, False, New EmbedBuilder With {
                                           .Author = New EmbedAuthorBuilder With {
                                                .Name = "Guilds"
                                           },
                                           .Color = Color.DarkTeal,
                                           .Description = client.Guilds.Count & " to be exact.",
                                           .Title = "I'm in quite a few.",
                                           .Fields = fields,
                                           .Footer = Module1.getfooter(msg),
                                           .Timestamp = DateTimeOffset.Now})
    End Sub
    Function init()
        Module1.commands.Add(New mainclasses.modulecommand With {
                             .name = "info",
                             .descrip = "Shows some info about the bot",
                             .example = "info",
                             .func = AddressOf pingFunc
        })
        Module1.commands.Add(New mainclasses.modulecommand With {
                             .name = "guilds",
                             .descrip = "Lists the guilds I'm in.",
                             .example = "guilds",
                             .func = AddressOf guildFunc
        })
        Log(New LogMessage(LogSeverity.Info, "Init", "Loaded info."))
        Return True
    End Function
End Module
