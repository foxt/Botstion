Imports Discord
Imports Discord.WebSocket

Module exec
    Async Sub execFunc(msg As IUserMessage, client As DiscordSocketClient, prefix As String)
        Dim rmsg = Await msg.Channel.SendMessageAsync(msg.Author.Mention, False, New EmbedBuilder With {
                                           .Author = New EmbedAuthorBuilder With {
                                                .Name = msg.Content.Replace(prefix & "exec ", "")
                                           },
                                           .Color = Color.Green,
                                           .Title = "Command is running...",
                                           .Description = "Please wait...",
                                           .Footer = Module1.getfooter(msg),
                                           .Timestamp = DateTimeOffset.Now})
        Dim process As New Process With {.StartInfo = New ProcessStartInfo With {.Arguments = "/c " & msg.Content.Replace(prefix & "exec ", ""), .CreateNoWindow = True, .FileName = "C:\Windows\System32\cmd.exe", .RedirectStandardOutput = True, .RedirectStandardError = True, .UseShellExecute = False}}
        process.Start()
        Dim output = process.StandardOutput.ReadToEnd()
        process.WaitForExit()
        If output.Length > 1500 Then
            Await rmsg.ModifyAsync(Function(x)
                                       x.Embed = New EmbedBuilder With {
                                       .Author = New EmbedAuthorBuilder With {
                                                .Name = msg.Content.Replace(prefix & "exec ", "")
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
                                                .Name = msg.Content.Replace(prefix & "exec ", "")
                                           },
                                           .Color = Color.DarkGreen,
                                           .Title = "Command has finished...",
                                           .Description = "```" & output & "```",
                                           .Footer = Module1.getfooter(msg),
                                           .Timestamp = DateTimeOffset.Now}.Build
                                       Return True
                                   End Function)
        End If

    End Sub
    Function init()
        Module1.commands.Add(New mainclasses.modulecommand With {
                             .name = "exec",
                             .descrip = "Executes a command.",
                             .example = "exec speedtest-cli",
                             .func = AddressOf execFunc,
                             .permission = permissionManager.BotstionRole.globalmaintainer
        })
        Log(New LogMessage(LogSeverity.Info, "Init", "Loaded exec."))
        Return True
    End Function
End Module
