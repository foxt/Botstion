Imports Discord
Imports Discord.WebSocket

Module debug
    Dim st As Date = DateTime.Now
    Async Sub pingFunc(msg As IUserMessage, client As DiscordSocketClient, prefix As String)
        Dim fields = New List(Of EmbedFieldBuilder)
        fields.Add(New EmbedFieldBuilder With {.IsInline = False, .Name = "**Stats for Nerds**", .Value = "."})
        fields.Add(New EmbedFieldBuilder With {.IsInline = True, .Name = "Client Ping (CP)", .Value = client.Latency & "ms"})
        fields.Add(New EmbedFieldBuilder With {.IsInline = True, .Name = "Message Ping (MP)", .Value = (DateTime.Now - msg.CreatedAt).TotalMilliseconds & "ms"})
        Dim uptime = DateTime.Now - st
        fields.Add(New EmbedFieldBuilder With {.IsInline = True, .Name = "Uptime", .Value = uptime})
        fields.Add(New EmbedFieldBuilder With {.IsInline = True, .Name = "Guilds", .Value = client.Guilds.Count})
        fields.Add(New EmbedFieldBuilder With {.IsInline = True, .Name = "Running on", .Value = My.Computer.Name})
        fields.Add(New EmbedFieldBuilder With {.IsInline = True, .Name = "RAM in use", .Value = Math.Floor(GC.GetTotalMemory(True) / 1024 / 1024) & "mb"})
        fields.Add(New EmbedFieldBuilder With {.IsInline = True, .Name = "CPU Time", .Value = Process.GetCurrentProcess.TotalProcessorTime})
        Await msg.Channel.SendMessageAsync(msg.Author.Mention, False, New EmbedBuilder With {
                                           .Author = New EmbedAuthorBuilder With {
                                                .Name = "Hi there!",
                                                .IconUrl = "https://cdn.discordapp.com/emojis/370224694005071872.png"
                                           },
                                           .Color = Color.DarkTeal,
                                           .Description = "Hi! I'm Botstion. A multipurpose, [open source (GPLv3)](https://github.com/thelmgn) Discord bot made by theLMGN using Discord.NET",
                                           .Fields = fields,
                                           .Footer = Module1.getfooter(msg),
                                           .Timestamp = DateTimeOffset.Now}.Build)
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
                                           .Timestamp = DateTimeOffset.Now}.Build)
    End Sub
    Async Sub collectGarbage(msg As IUserMessage, client As DiscordSocketClient, prefix As String)
        Dim fields = New List(Of EmbedFieldBuilder)
        fields.Add(New EmbedFieldBuilder With {.IsInline = True, .Name = "Pre-GC", .Value = Math.Floor(GC.GetTotalMemory(False) / 1024 / 1024) & "mb"})
        GC.Collect()
        fields.Add(New EmbedFieldBuilder With {.IsInline = True, .Name = "Post-GC", .Value = Math.Floor(GC.GetTotalMemory(True) / 1024 / 1024) & "mb"})

        Await msg.Channel.SendMessageAsync(msg.Author.Mention, False, New EmbedBuilder With {
                                           .Author = New EmbedAuthorBuilder With {
                                                .Name = "Garbage Collection"
                                           },
                                           .Color = Color.Green,
                                           .Description = "Thanks! Botstion may run a bit faster now.",
                                           .Fields = fields,
                                           .Footer = Module1.getfooter(msg),
                                           .Timestamp = DateTimeOffset.Now}.Build)
    End Sub
    Async Sub reloadFunc(msg As IUserMessage, client As DiscordSocketClient, prefix As String)
        Dim aa = Module1.getfooter(msg)
        aa.Text = Module1.getfooter(msg).Text & " | If there's no reloaded message after this, it's broke."
        Dim oof = Await msg.Channel.SendMessageAsync(msg.Author.Mention, False, New EmbedBuilder With {
                                           .Author = New EmbedAuthorBuilder With {
                                                .Name = "Reloading"
                                           },
                                           .Color = Color.Green,
                                           .Description = "Reloading all the modules I can.",
                                           .Footer = aa,
                                           .Timestamp = DateTimeOffset.Now}.Build)
        Module1.commands.Clear()
        For Each modulee As Action In Module1.modules
            modulee()
        Next
        Await oof.DeleteAsync()
        Await msg.Channel.SendMessageAsync(msg.Author.Mention, False, New EmbedBuilder With {
                                           .Author = New EmbedAuthorBuilder With {
                                                .Name = "Reloaded"
                                           },
                                           .Color = Color.Green,
                                           .Description = "Reloaded all the modules I could.",
                                           .Footer = Module1.getfooter(msg),
                                           .Timestamp = DateTimeOffset.Now}.Build)
    End Sub
    Function init()
        Module1.commands.Add(New mainclasses.modulecommand With {
                             .name = "binfo",
                             .descrip = "Shows some info about the bot",
                             .example = "binfo",
                             .func = AddressOf pingFunc,
                             .permission = permissionManager.BotstionRole.regular
        })
        Module1.commands.Add(New mainclasses.modulecommand With {
                             .name = "guilds",
                             .descrip = "Lists the guilds I'm in.",
                             .example = "guilds",
                             .func = AddressOf guildFunc,
                             .permission = permissionManager.BotstionRole.globalmaintainer
        })
        Module1.commands.Add(New mainclasses.modulecommand With {
                             .name = "reload",
                             .descrip = "Reloads all the modules I can.",
                             .example = "reload",
                             .func = AddressOf reloadFunc,
                             .permission = permissionManager.BotstionRole.globalmaintainer
        })
        Module1.commands.Add(New mainclasses.modulecommand With {
                             .name = "gc",
                             .descrip = "Forces a garbage collection (frees up RAM)",
                             .example = "gc",
                             .func = AddressOf collectGarbage,
                             .permission = permissionManager.BotstionRole.regular
        })
        Log(New LogMessage(LogSeverity.Info, "Init", "Loaded debug."))
        Return True
    End Function
End Module
