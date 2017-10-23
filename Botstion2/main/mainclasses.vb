Imports Discord
Imports Discord.WebSocket

Public Class mainclasses
    Class modulecommand
        Public name As String
        Public example As String
        Public descrip As String
        Public func As Action(Of IUserMessage, DiscordSocketClient, String)
    End Class
End Class
