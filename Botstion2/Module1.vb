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

    Public Class botstionModuleInitObject
        Public client As DiscordSocketClient
        Public name As String
        Public config As Object
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

    Async Function createClient(name) As Task
        Await Log(New LogMessage(LogSeverity.Info, "Client", "Connecting client for " & name))
        client = New DiscordSocketClient(New DiscordSocketConfig())
        Await client.StartAsync
        If Not My.Computer.FileSystem.DirectoryExists("botstionmodules") Then
            Await Log(New LogMessage(LogSeverity.Info, "Client", "No botstionmodules folder, creating one for you."))
            My.Computer.FileSystem.CreateDirectory("botstionmodules")
            My.Computer.FileSystem.CreateDirectory("botstionmodules/all")
            My.Computer.FileSystem.CreateDirectory("botstionmodules/" & name)
        End If
        If Not My.Computer.FileSystem.DirectoryExists("botstionmodules/all") Then
            Await Log(New LogMessage(LogSeverity.Info, "Client", "No botstionmodules/all folder, creating one for you."))
            My.Computer.FileSystem.CreateDirectory("botstionmodules/all")
        End If
        If Not My.Computer.FileSystem.DirectoryExists("botstionmodules/" & name) Then
            Await Log(New LogMessage(LogSeverity.Info, "Client", "No botstionmodules/" & name & " folder, creating one for you."))
            My.Computer.FileSystem.CreateDirectory("botstionmodules/" & name)
        End If
        If Not My.Computer.FileSystem.DirectoryExists("config") Then
            Await Log(New LogMessage(LogSeverity.Info, "Client", "No config folder, creating one for you."))
            My.Computer.FileSystem.CreateDirectory("config")
        End If
        'TODO: Configs
        If Not My.Computer.FileSystem.DirectoryExists("config/" & name) Then
            Await Log(New LogMessage(LogSeverity.Info, "Client", "No config/" & name & " folder, creating one for you."))
            My.Computer.FileSystem.CreateDirectory("config/" & name)
        End If
        If Not My.Computer.FileSystem.FileExists("config/" & name & "/token.json") Then
            Await Log(New LogMessage(LogSeverity.Info, "Client", "No config/" & name & "/token.json file, creating one for you."))
            My.Computer.FileSystem.WriteAllText("config/" & name & "/token.json", JsonConvert.SerializeObject(New tokenConfigClass With {.token = "Put your token here"}), False)
            Await Log(New LogMessage(LogSeverity.Info, "Client", "Open the config/" & name & "/token.json file, then place your bot's token, then press ENTER"))
            Console.ReadLine()
        End If
        Dim tokenConfig = JsonConvert.DeserializeObject(Of tokenConfigClass)(My.Computer.FileSystem.ReadAllText("config/" & name & "/token.json"))
        Await client.LoginAsync(TokenType.Bot, tokenConfig.token) '" & name & "
        ' Load Them Modules

        For Each item In My.Computer.FileSystem.GetFiles("botstionmodules/" & name)
            Dim DLL = Assembly.LoadFile(item)
            If Not My.Computer.FileSystem.FileExists("config/" & name & "/" & DLL.FullName & ".json") Then
                Await Log(New LogMessage(LogSeverity.Info, "Client", "No config/" & name & "/" & DLL.FullName & ".json file, creating one for you."))
                My.Computer.FileSystem.WriteAllText("config / " & name & " / " & DLL.FullName & ".json", "{}", False)
            End If
            For Each type As Type In DLL.GetExportedTypes()
                Dim c = Activator.CreateInstance(type)
                type.InvokeMember("init", BindingFlags.InvokeMethod, Nothing, c, New Object() {New botstionModuleInitObject With {.client = client, .name = name, .config = JsonConvert.DeserializeObject(My.Computer.FileSystem.ReadAllText("config/" & name & "/" & DLL.FullName & ".json"))}})
            Next
        Next
    End Function

    Async Sub Start()
        createClient("Botstion2")
    End Sub

    Function Log(ByVal message As LogMessage) As Task Handles client.Log
        Console.WriteLine(message.ToString())
        Return Task.CompletedTask
    End Function
End Module