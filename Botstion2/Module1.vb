Imports Discord
Imports Discord.Commands
Imports System.Reflection
Imports Discord.WebSocket
Imports System.Web
Imports Newtonsoft.Json
Imports System.Collections.ObjectModel

Module Module1

    Function drawPixelArt(input As String)
        For Each c As Char In input
            If c = "b" Then
                Console.BackgroundColor = ConsoleColor.Cyan
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
    Public Class command
        Public name As String
        Public example As String
        Public details As String
    End Class
    Public Class modulePermissions
        Public passClientOnInit As Boolean
        Public config As Boolean

    End Class
    Public Class moduleManifest
        Public name As String
        Public fsSafeName As String
        Public version As Double
        Public author As String
        Public url As String
        Public permissions As modulePermissions
        Public commands As List(Of command)
        Public exampleconfig As Object
    End Class
    Public Class tokenConfigClass
        Public token As String
    End Class
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
        Await Log(New LogMessage(LogSeverity.Info, "Init", "Loading"))
        client = New DiscordSocketClient(New DiscordSocketConfig())
        Await client.StartAsync
        If Not My.Computer.FileSystem.DirectoryExists("botstionmodules") Then
            Await Log(New LogMessage(LogSeverity.Info, "Init", "No botstionmodules folder, creating one for you."))
            My.Computer.FileSystem.CreateDirectory("botstionmodules")

        End If
        If Not My.Computer.FileSystem.DirectoryExists("config") Then
            Await Log(New LogMessage(LogSeverity.Info, "Init", "No config folder, creating one for you."))
            My.Computer.FileSystem.CreateDirectory("config")
        End If
        'TODO: Configs
        If Not My.Computer.FileSystem.FileExists("config\token.json") Then
            Await Log(New LogMessage(LogSeverity.Info, "Init", " No config\token.json file, creating one for you."))
            My.Computer.FileSystem.WriteAllText("config\token.json", JsonConvert.SerializeObject(New tokenConfigClass With {.token = "Put your token here"}), False)
            Await Log(New LogMessage(LogSeverity.Info, "Init", "     Open the config\token.json file, then place your bot's token, then press ENTER"))
            Console.ReadLine()
        End If
        Dim tokenConfig = JsonConvert.DeserializeObject(Of tokenConfigClass)(My.Computer.FileSystem.ReadAllText("config\token.json"))
        Await client.LoginAsync(TokenType.Bot, tokenConfig.token) '" & name & "
        ' Load Them Modules

        For Each item In My.Computer.FileSystem.GetFiles("botstionmodules")
            Await Log(New LogMessage(LogSeverity.Info, "Init", " Loading module at " & item))
            Dim DLL = Assembly.LoadFile(item)
            For Each type As Type In DLL.GetExportedTypes()
                Dim c = Activator.CreateInstance(type)
                Dim moduleManifest As moduleManifest = type.InvokeMember("getManifest", BindingFlags.InvokeMethod, Nothing, c, New Object() {True})
                Await Log(New LogMessage(LogSeverity.Info, "Init", " Module " & moduleManifest.name & " v" & moduleManifest.version & " by " & moduleManifest.author))
                If moduleManifest.permissions.config = True Then
                    Await Log(New LogMessage(LogSeverity.Info, "Init", " Config Name: " & moduleManifest.fsSafeName & ".json"))
                    If Not My.Computer.FileSystem.FileExists("config\" & moduleManifest.fsSafeName & ".json") Then
                        Await Log(New LogMessage(LogSeverity.Info, "Init", " No config\" & moduleManifest.fsSafeName & ".json file, creating one for you."))
                        My.Computer.FileSystem.WriteAllText("config\" & moduleManifest.fsSafeName & ".json", JsonConvert.SerializeObject(moduleManifest.exampleconfig), False)
                    End If
                    If moduleManifest.permissions.passClientOnInit = True Then
                        Await Log(New LogMessage(LogSeverity.Info, "Init", " Passing client to module."))
                    End If
                End If
            Next
        Next
    End Function

    Async Sub Start()
        createClient()

    End Sub

    Function Log(ByVal message As LogMessage) As Task Handles client.Log
        Console.WriteLine(message.ToString())
        Return Task.CompletedTask
    End Function
End Module