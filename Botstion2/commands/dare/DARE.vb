Imports Discord
Imports Discord.WebSocket

Module dare

    Async Sub jvFunc(msg As IUserMessage, client As DiscordSocketClient, prefix As String)
        Dim channel = TryCast(msg.Author, IGuildUser)
        If IsNothing(channel.VoiceChannel) Then
            Await msg.Channel.SendMessageAsync(msg.Author.Mention, False, New EmbedBuilder With {
                                           .Author = New EmbedAuthorBuilder With {
                                                .Name = "DARE: Error"
                                           },
                                           .Color = Color.DarkRed,
                                           .Description = "You need to be in a voice channel for this to work.",
                                           .Footer = Module1.getfooter(msg),
                                           .Title = "No VC.",
                                           .Timestamp = DateTimeOffset.Now}.Build)
        Else
            Await JoinAudioAsync(channel.Guild, channel.VoiceChannel)
            Await msg.Channel.SendMessageAsync(msg.Author.Mention, False, New EmbedBuilder With {
                                       .Author = New EmbedAuthorBuilder With {
                                            .Name = "Connect"
                                       },
                                       .Color = Color.DarkRed,
                                       .Description = "Connected from voice.",
                                       .Footer = Module1.getfooter(msg),
                                       .Title = "Connected!",
                                       .Timestamp = DateTimeOffset.Now}.Build)

        End If
    End Sub
    Async Sub dareFunc(msg As IUserMessage, client As DiscordSocketClient, prefix As String)
        Dim channel = TryCast(msg.Author, IGuildUser)
        Await SendAudioAsync(channel.Guild, msg.Channel, "DARE.mp3")
    End Sub
    Async Sub dcvFunc(msg As IUserMessage, client As DiscordSocketClient, prefix As String)
        Try
            Await LeaveAudio(TryCast(msg.Author, IGuildUser).Guild)
            Await msg.Channel.SendMessageAsync(msg.Author.Mention, False, New EmbedBuilder With {
                                       .Author = New EmbedAuthorBuilder With {
                                            .Name = "Disconnect"
                                       },
                                       .Color = Color.DarkRed,
                                       .Description = "Disconnected from voice.",
                                       .Footer = Module1.getfooter(msg),
                                       .Title = "Disconnected",
                                       .Timestamp = DateTimeOffset.Now}.Build)
        Catch
        End Try
    End Sub
    Function init()
        Log(New LogMessage(LogSeverity.Info, "Init", "It's coming up."))
        Log(New LogMessage(LogSeverity.Info, "Init", "It's coming up."))
        Log(New LogMessage(LogSeverity.Info, "Init", "It's coming up."))
        Log(New LogMessage(LogSeverity.Info, "Init", "It's coming up."))
        Log(New LogMessage(LogSeverity.Info, "Init", "It's coming up."))
        Log(New LogMessage(LogSeverity.Info, "Init", "It's coming up."))
        Module1.commands.Add(New mainclasses.modulecommand With {
                             .name = "dare",
                             .descrip = "It's coming up.",
                             .example = "dare",
                             .func = AddressOf dareFunc
        })
        Module1.commands.Add(New mainclasses.modulecommand With {
                             .name = "dcv",
                             .descrip = "Disconnect from voice.",
                             .example = "dcv",
                             .func = AddressOf dcvFunc
        })
        Module1.commands.Add(New mainclasses.modulecommand With {
                             .name = "jv",
                             .descrip = "Joins voice.",
                             .example = "jv",
                             .func = AddressOf jvFunc
        })
        Log(New LogMessage(LogSeverity.Info, "Init", "It's DARE"))
        Return True
    End Function
End Module
