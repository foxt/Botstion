Imports Discord
Imports Discord.WebSocket

Module this_module_ate_200_users_this_is_what_happened_to_its_bandwidth
    Function randomFromList(list As List(Of String))
        Return list((New Random).Next(0, list.Count))
    End Function
    Function generateClickbait()
        Dim pronoun = randomFromList(New List(Of String) From {"his", "their", "her"})
        Dim person As String
        If pronoun = "his" Then
            person = randomFromList(New List(Of String) From {"student", "boy", "father"})
        ElseIf pronoun = "their" Then
            person = randomFromList(New List(Of String) From {"mother", "mum", "student", "boy", "girl", "father"})
        Else
            person = randomFromList(New List(Of String) From {"mother", "mum", "student", "girl"})
        End If
        Return "A " & person & " ate " & (New Random).Next(40, 100) & " " & randomFromList(New List(Of String) From {"cookies", "laxative", "muffins", "cookies", "brownies", "pieces of flapjack", "pieces of candy"}) & ", this is what happened to " & pronoun & " " & randomFromList(New List(Of String) From {"brain.", "lungs.", "liver.", "bladder.", "kidney.", "heart.", "stomach.", "intestines.", "digestive system."})
    End Function
    Async Sub emuFunc(msg As IUserMessage, client As DiscordSocketClient, prefix As String)
        Await msg.Channel.SendMessageAsync(msg.Author.Mention, False, New EmbedBuilder With {
                                           .Author = New EmbedAuthorBuilder With {
                                                .Name = "Chubbyemu",
                                                .IconUrl = "https://cdn.discordapp.com/attachments/361954520525307904/372452806373933058/unknown.png",
                                                .Url = "https://www.youtube.com/channel/UCKOvOaJv4GK-oDqx-sj7VVg"
                                           },
                                           .Color = Color.Teal,
                                           .Description = generateClickbait(),
                                           .Footer = Module1.getfooter(msg),
                                           .Title = "New from Chubbyemu:",
                                           .Timestamp = DateTimeOffset.Now}.Build)
    End Sub
    Function init()
        Module1.commands.Add(New mainclasses.modulecommand With {
                             .name = "chubbyemu",
                             .descrip = generateClickbait(),
                             .example = "chubbyemu",
                             .func = AddressOf emuFunc,
                             .permission = permissionManager.BotstionRole.regular
        })
        Log(New LogMessage(LogSeverity.Info, "Init", "This module ate 200 users, this is what happened to its bandwidth"))
        Return True
    End Function
End Module
