Imports Discord
Imports Discord.WebSocket

Module test

    Async Sub jvFunc(msg As IUserMessage, client As DiscordSocketClient, prefix As String)
        Dim channel = TryCast(msg.Author, IGuildUser)
        If IsNothing(channel.VoiceChannel) Then
            Await msg.Channel.SendMessageAsync(msg.Author.Mention, False, New EmbedBuilder With {
                                           .Author = New EmbedAuthorBuilder With {
                                                .Name = "AudioTest: Error"
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
        Await SendAudioAsync(channel.Guild, "C:\BotstionSFX\call.mp3")
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
    Async Sub interactiveFunc(msg As IUserMessage, client As DiscordSocketClient, prefix As String)
        Dim intserv = New Addons.Interactive.InteractiveService(client, New TimeSpan(0, 0, 30))
        Dim pages = New List(Of String)
        pages.Add("Page #1 ")
        pages.Add("Page #2")
        Dim pm = New Addons.Interactive.PaginatedMessage With {
            .Title = "Paginator test",
            .Options = New Addons.Interactive.PaginatedAppearanceOptions With {
            .DisplayInformationIcon = True},
            .Content = "Content",
            .Pages = pages}

        intserv.SendPaginatedMessageAsync(New Discord.Commands.SocketCommandContext(client, msg), pm)

        Dim field = New List(Of EmbedFieldBuilder)
        field.Add(New EmbedFieldBuilder With {
                  .IsInline = False,
                  .Name = "Field Title <:Tick:375377712786833419>",
                  .Value = "Field Value <:Tick:375377712786833419>"})



        Await msg.Channel.SendMessageAsync("Testing emotes in different embed fields. <:Tick:375377712786833419>", False, New EmbedBuilder() With {
            .Color = New Color(Convert.ToByte(150), Convert.ToByte(168), Convert.ToByte(200)),
            .Title = "Title <:Tick:375377712786833419>",
.Fields = field,
.Author = New EmbedAuthorBuilder() With {
.Name = "Author name <:Tick:375377712786833419>"
},
.Description = "Description <:Tick:375377712786833419>",
.Footer = getfooter(msg)
}.Build)
    End Sub
    Function init()
        Module1.commands.Add(New mainclasses.modulecommand With {
                             .name = "at",
                             .descrip = "AudioTest",
                             .example = "at",
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
        Module1.commands.Add(New mainclasses.modulecommand With {
                             .name = "interactiveTest",
                             .descrip = "Test of interactive commands..",
                             .example = "interactiveTest",
                             .func = AddressOf interactiveFunc
        })
        Log(New LogMessage(LogSeverity.Info, "Init", "Test loaded"))
        Return True
    End Function
End Module
