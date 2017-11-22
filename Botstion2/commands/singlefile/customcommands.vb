Imports Discord
Imports Discord.WebSocket

Module customcommands
    Async Sub handleFunc(msg As IUserMessage, client As DiscordSocketClient, prefix As String)
        For Each item As customCommand In ccs
            If item.command.name = msg.Content.Replace(prefix, "") Then
                Await msg.Channel.SendMessageAsync(msg.Author.Mention, False, item.embed.Build)
            End If
        Next
    End Sub
    Async Sub handlecmdFunc(msg As IUserMessage, client As DiscordSocketClient, prefix As String)
        For Each item As customcmdCommand In cccs
            If item.command.name = msg.Content.Replace(prefix, "") Then
                Dim rmsg = Await msg.Channel.SendMessageAsync(msg.Author.Mention, False, New EmbedBuilder With {
                                           .Author = New EmbedAuthorBuilder With {
                                                 .Name = item.exec
                                           },
                                           .Color = Color.Green,
                                           .Title = "Command is running...",
                                           .Description = "Please wait...",
                                           .Footer = Module1.getfooter(msg),
                                           .Timestamp = DateTimeOffset.Now}.Build)
                Dim process As New Process With {.StartInfo = New ProcessStartInfo With {.Arguments = "/c " & item.exec, .CreateNoWindow = True, .FileName = "C:\Windows\System32\cmd.exe", .RedirectStandardOutput = True, .RedirectStandardError = True, .UseShellExecute = False}}
                process.Start()
                Dim output = process.StandardOutput.ReadToEnd()
                process.WaitForExit()
                If output.Length > 1500 Then
                    Await rmsg.ModifyAsync(Function(x)
                                               x.Embed = New EmbedBuilder With {
                                       .Author = New EmbedAuthorBuilder With {
                                                 .Name = item.exec
                                           },
                                           .Color = Color.DarkGreen,
                                           .Title = "Command has finished... (output was too large, showing first 1500 chars)",
                                           .Description = "```" & output.Substring(0, 1500) & "```",
                                           .Footer = Module1.getfooter(msg),
                                           .Timestamp = DateTimeOffset.Now}.Build
                                               Return True
                                           End Function)
                Else
                    Await rmsg.ModifyAsync(Function(x)
                                               x.Embed = New EmbedBuilder With {
                                       .Author = New EmbedAuthorBuilder With {
                                                .Name = item.exec
                                           },
                                           .Color = Color.DarkGreen,
                                           .Title = "Command has finished...",
                                           .Description = "```" & output & "```",
                                           .Footer = Module1.getfooter(msg),
                                           .Timestamp = DateTimeOffset.Now}.Build
                                               Return True
                                           End Function)
                End If
            End If
        Next
    End Sub
    Class ccommand
        Public name As String
        Public descrip As String
        Public permission As permissionManager.BotstionRole
    End Class
    Class customCommand
        Public command As ccommand
        Public embed As EmbedBuilder
    End Class
    Class customcmdCommand
        Public command As ccommand
        Public exec As String
    End Class
    Dim cm As New configManager
    Dim ccs As New List(Of customCommand)
    Dim cccs As New List(Of customcmdCommand)
    Function init()
        Console.WriteLine(Newtonsoft.Json.JsonConvert.SerializeObject(New ccommand With {.permission = permissionManager.BotstionRole.globalmaintainer}))
        ccs = cm.loadConfig(Of List(Of customCommand))("customcommands")
        For Each item As customCommand In ccs
            Module1.commands.Add(New mainclasses.modulecommand With {
                             .name = item.command.name,
                             .descrip = item.command.descrip,
                             .example = item.command.name,
                             .permission = item.command.permission,
                             .func = AddressOf handleFunc
        })
        Next
        cccs = cm.loadConfig(Of List(Of customcmdCommand))("customcmdcommands")
        For Each item As customcmdCommand In cccs
            Module1.commands.Add(New mainclasses.modulecommand With {
                             .name = item.command.name,
                             .descrip = item.command.descrip,
                             .example = item.command.name,
                             .permission = item.command.permission,
                             .func = AddressOf handlecmdFunc
        })
        Next
        Log(New LogMessage(LogSeverity.Info, "Init", "Loaded customcommands."))
        Return True
    End Function
End Module
