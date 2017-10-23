Imports Discord
Imports Discord.WebSocket

Module customcommands
    Async Sub handleFunc(msg As IUserMessage, client As DiscordSocketClient, prefix As String)
        For Each item As customCommand In ccs
            If item.command.name = msg.Content.Replace(prefix, "") Then
                Await msg.Channel.SendMessageAsync(msg.Author.Mention, False, item.embed)
            End If
        Next
    End Sub
    Class ccommand
        Public name As String
        Public descrip As String
    End Class
    Class customCommand
        Public command As ccommand
        Public embed As EmbedBuilder
    End Class
    Dim cm As New configManager
    Dim ccs As New List(Of customCommand)
    Function init()
        ccs = cm.loadConfig(Of List(Of customCommand))("customcommands")
        cm.saveConfig(ccs, "customcommands")
        For Each item As customCommand In ccs
            Module1.commands.Add(New mainclasses.modulecommand With {
                             .name = item.command.name,
                             .descrip = item.command.descrip,
                             .example = item.command.name,
                             .func = AddressOf handleFunc
        })
        Next
        Log(New LogMessage(LogSeverity.Info, "Init", "Loaded customcommands."))
        Return True
    End Function
End Module
