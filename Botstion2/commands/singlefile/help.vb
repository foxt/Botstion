Imports Discord
Imports Discord.WebSocket

Module help
    Async Sub helpFunc(msg As IUserMessage, client As DiscordSocketClient, prefix As String)
        Dim commandString = ""
        For Each command As mainclasses.modulecommand In Module1.commands
            If commandString.Length > 1500 Then
                Await msg.Channel.SendMessageAsync(msg.Author.Mention, False, New EmbedBuilder With {
                                           .Author = New EmbedAuthorBuilder With {
                                                .Name = "Commands"
                                           },
                                           .Color = Color.Blue,
                                           .Description = commandString,
                                           .Footer = Module1.getfooter(msg),
                                           .Title = "List of commands",
                                           .Timestamp = DateTimeOffset.Now})
                commandString = ""
            End If
            commandString = commandString & vbNewLine & "**" & prefix & command.name & "** - " & command.descrip & vbNewLine & "Example: ```" & prefix & command.example & "```" & vbNewLine
        Next
        Await msg.Channel.SendMessageAsync(msg.Author.Mention, False, New EmbedBuilder With {
                                           .Author = New EmbedAuthorBuilder With {
                                                .Name = "Commands"
                                           },
                                           .Color = Color.Blue,
                                           .Description = commandString,
                                           .Footer = Module1.getfooter(msg),
                                           .Title = "List of commands",
                                           .Timestamp = DateTimeOffset.Now})
    End Sub
    Function init()
        Module1.commands.Add(New mainclasses.modulecommand With {
                             .name = "help",
                             .descrip = "Shows you a list of commands",
                             .example = "help",
                             .func = AddressOf helpFunc
        })
        Log(New LogMessage(LogSeverity.Info, "Init", "Loaded help."))
        Return True
    End Function
End Module
