Imports Discord
Imports Discord.WebSocket
Imports Newtonsoft.Json

Module Module1
    Function addmodules()
        help.init()
        ping.init()
        customcommands.init()
    End Function
    Public footer As EmbedFooterBuilder = New EmbedFooterBuilder With {
         .IconUrl = "https://sx.thelmgn.com/2017/06/botstion.png",
         .Text = "Botstion2 by theLMGN, made with Discord.NET. "}
    Function getfooter(msg As IUserMessage) As EmbedFooterBuilder
        Return New EmbedFooterBuilder With {
         .IconUrl = footer.IconUrl,
         .Text = footer.Text & "MP: " & (DateTime.Now - msg.CreatedAt).TotalMilliseconds & "ms CP: " & client.Latency & "ms"}
    End Function
    Function drawPixelArt(input As String)
        For Each c As Char In input
            If c = "b" Then
                Console.BackgroundColor = ConsoleColor.White
                Console.Write(" ")
            ElseIf c = "w" Then
                Console.BackgroundColor = ConsoleColor.White
                Console.Write(" ")
            ElseIf c = "l" Then
                Console.BackgroundColor = ConsoleColor.Black
                Console.Write(" ")
            Else
                Console.BackgroundColor = ConsoleColor.Black
                Console.ForegroundColor = ConsoleColor.Gray
                Console.Write(c)
            End If
        Next
        Console.WriteLine()
        Console.BackgroundColor = ConsoleColor.Black
        Console.ForegroundColor = ConsoleColor.Gray
        Return True
    End Function


    Public Class configClass
        Public token As String
        Public prefix As String
    End Class
    Public commands As New List(Of mainclasses.modulecommand)

    Sub Main()
        drawPixelArt("wwwlblwwwwlllw")
        drawPixelArt("wwwlblwwwlwwwl BOTSTION")
        drawPixelArt("wwwlllwwwwwwlw By theLMGN")
        drawPixelArt("wwwwwwwwwwlwww")
        drawPixelArt("wwwwwwwwwlllll")
        drawPixelArt("wwwwwwwwwwwwww")

        Dim main = New Task(AddressOf Start)
        main.Start()
        While True
            Threading.Thread.Sleep(50000)
        End While
    End Sub

    Private WithEvents client As DiscordSocketClient

    Async Function createClient() As Task
        Try
            Await Log(New LogMessage(LogSeverity.Info, "Init", "Loading"))
            client = New DiscordSocketClient(New DiscordSocketConfig())

            If Not My.Computer.FileSystem.DirectoryExists("config") Then
                Await Log(New LogMessage(LogSeverity.Info, "Init", "No config folder, creating one for you."))
                My.Computer.FileSystem.CreateDirectory("config")
            End If
            'TODO: Configs
            If Not My.Computer.FileSystem.FileExists("config\botstioncore.json") Then
                Await Log(New LogMessage(LogSeverity.Info, "Init", " No config\botstioncore.json file, creating one for you."))
                My.Computer.FileSystem.WriteAllText("config\botstioncore.json", JsonConvert.SerializeObject(New configClass With {.token = "Put your token here", .prefix = "b!"}), False)
                Await Log(New LogMessage(LogSeverity.Info, "Init", "     Open the config\botstioncore.json file, then place your bot's token, then press ENTER"))
                Console.ReadLine()
            End If
            Dim botstionconfig As configClass = JsonConvert.DeserializeObject(Of configClass)(My.Computer.FileSystem.ReadAllText("config\botstioncore.json"))
            Await client.LoginAsync(TokenType.Bot, botstionconfig.token) '" & name & "
            Await client.StartAsync
            addmodules()
            Await client.SetGameAsync("with some commands. Use b!help to see them.", "http://botstion.tech", StreamType.Twitch)

            Await Log(New LogMessage(LogSeverity.Critical, "Testing", "Critical"))
            Await Log(New LogMessage(LogSeverity.Debug, "Testing", "Debug"))
            Await Log(New LogMessage(LogSeverity.Error, "Testing", "Error"))
            Await Log(New LogMessage(LogSeverity.Info, "Testing", "Info"))
            Await Log(New LogMessage(LogSeverity.Verbose, "Testing", "Verbose"))
            Await Log(New LogMessage(LogSeverity.Warning, "Testing", "Warn"))
        Catch ex As Exception
            Log(New LogMessage(LogSeverity.Critical, "Init", "Uh oh! Error."))
            Log(New LogMessage(LogSeverity.Critical, "Init", ex.ToString))
        End Try
    End Function
    Async Function hC(ByVal msg As IUserMessage) As Task Handles client.MessageReceived
        Try
            Dim prefix = JsonConvert.DeserializeObject(Of configClass)(My.Computer.FileSystem.ReadAllText("config\botstioncore.json")).prefix
            If msg.Content.StartsWith(prefix) Then
                Dim cm = New configManager
                If cm.userAgreed(msg.Author.Id) Then
                    For Each command As mainclasses.modulecommand In commands
                        If msg.Content = (prefix & command.name) Then
                            Try
                                command.func(msg, client, prefix)
                            Catch ex As Exception
                                msg.Channel.SendMessageAsync(msg.Author.Mention, False, New EmbedBuilder With {
                                            .Author = New EmbedAuthorBuilder With {
                                                 .Name = command.name & ": Error"
                                            },
                                            .Color = Color.DarkRed,
                                            .Description = ex.ToString,
                                            .Footer = Module1.getfooter(msg),
                                            .Title = "A " & ex.Message & " error occured",
                                            .Timestamp = DateTimeOffset.Now})
                            End Try
                        End If
                    Next
                Else
                    If msg.Content = "b!agree" Then
                        cm.agreeUser(msg.Author.Id)
                        Await msg.Channel.SendMessageAsync(msg.Author.Mention, False, New EmbedBuilder With {
                                            .Author = New EmbedAuthorBuilder With {
                                                 .Name = "Thank you!"
                                            },
                                            .Color = Color.DarkGreen,
                                            .Description = "You now can use the Botstion commands!",
                                            .Footer = Module1.getfooter(msg),
                                            .Title = "Agreed!",
                                            .Timestamp = DateTimeOffset.Now})
                    Else
                        Await msg.Channel.SendMessageAsync(msg.Author.Mention, False, New EmbedBuilder With {
                                            .Author = New EmbedAuthorBuilder With {
                                                 .Name = "Error"
                                            },
                                            .Color = Color.DarkRed,
                                            .Description = "To align with the Discord TOS to use Botstion commands, you must agree to Botstion collecting userdata. To do this type b!agree",
                                            .Footer = Module1.getfooter(msg),
                                            .Title = "You havent agreed yet!",
                                            .Timestamp = DateTimeOffset.Now})
                    End If
                End If

            End If
        Catch ex As Exception
            Log(New LogMessage(LogSeverity.Error, "Init", "Uh oh! Error."))
            Log(New LogMessage(LogSeverity.Error, "Init", ex.ToString))
            Try
                msg.Channel.SendMessageAsync(ex.ToString())
            Catch

            End Try
        End Try
    End Function
    Async Sub Start()
        createClient()

    End Sub

    Function Log(ByVal message As LogMessage) As Task Handles client.Log
        If message.Severity = LogSeverity.Critical Then Console.ForegroundColor = ConsoleColor.Red
        If message.Severity = LogSeverity.Debug Then Console.ForegroundColor = ConsoleColor.DarkMagenta
        If message.Severity = LogSeverity.Error Then Console.ForegroundColor = ConsoleColor.DarkRed
        If message.Severity = LogSeverity.Info Then Console.ForegroundColor = ConsoleColor.Cyan
        If message.Severity = LogSeverity.Verbose Then Console.ForegroundColor = ConsoleColor.Green
        If message.Severity = LogSeverity.Warning Then Console.ForegroundColor = ConsoleColor.DarkYellow
        Console.WriteLine(message.ToString())
        Debug.WriteLine(message.ToString())
        Return Task.CompletedTask
        Console.ForegroundColor = ConsoleColor.Blue
    End Function
End Module
Class configManager
    Public Function loadConfig(Of a)(filename)
        If My.Computer.FileSystem.FileExists("config\" & filename & ".json") Then
            Return JsonConvert.DeserializeObject(Of a)(My.Computer.FileSystem.ReadAllText("config\" & filename & ".json"))
        Else
            saveConfig(New Object, filename)
            Return loadConfig(Of a)(filename)
        End If

    End Function
    Public Function saveConfig(config, filename)
        My.Computer.FileSystem.WriteAllText(("config\" & filename & ".json"), JsonConvert.SerializeObject(config, Formatting.Indented), False)
    End Function
    Public Function userAgreed(userid As Int64)
        Return JsonConvert.DeserializeObject(Of List(Of Int64))(My.Computer.FileSystem.ReadAllText("config\agreed.json")).Contains(userid)
    End Function
    Public Function agreeUser(userid As Int64)

        Dim ting = JsonConvert.DeserializeObject(Of List(Of Int64))(My.Computer.FileSystem.ReadAllText("config\agreed.json"))
        ting.Add(userid)
        My.Computer.FileSystem.WriteAllText("config\agreed.json", JsonConvert.SerializeObject(ting), False)
    End Function
End Class
Class permissionManager
    Enum BotstionRole
        regular
        guildmoderator
        guildadministrator
        guildowner
        globaladmin
        globalowner
    End Enum

End Class