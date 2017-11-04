Imports Discord
Imports Discord.WebSocket

Module xkcd

    Public Class XKCD_Comic
        Public num As Integer
        Public month As String
        Public link As String
        Public year As String
        Public news As String
        Public safe_title As String
        Public transcript As String
        Public alt As String
        Public img As String
        Public title As String
        Public day As String
    End Class
    Async Sub xkcdf(msg As IUserMessage, client As DiscordSocketClient, prefix As String)
        Dim xkcd_webclient As New System.Net.WebClient
        Dim xkcd_response As String
        If msg.Content.EndsWith("xkcd") = False Then
            xkcd_response = Await xkcd_webclient.DownloadStringTaskAsync("https://www.xkcd.com/" & msg.Content.Split(" ").Last & "/info.0.json")
        Else
            xkcd_response = Await xkcd_webclient.DownloadStringTaskAsync("https://www.xkcd.com/info.0.json")
        End If

        Dim xkcd_json = Newtonsoft.Json.JsonConvert.DeserializeObject(Of XKCD_Comic)(xkcd_response)
        Dim field = New List(Of EmbedFieldBuilder)
        field.Add(New EmbedFieldBuilder With {
                  .IsInline = False,
                  .Name = "Comic Title",
                  .Value = xkcd_json.safe_title})
        field.Add(New EmbedFieldBuilder With {
                  .IsInline = True,
                  .Name = "Comic Number",
                  .Value = xkcd_json.num})
        field.Add(New EmbedFieldBuilder With {
                  .IsInline = True,
                  .Name = "Date (DD/MM/YYYY)",
                  .Value = xkcd_json.day & "/" & xkcd_json.month & "/" & xkcd_json.year})
        field.Add(New EmbedFieldBuilder With {
                  .IsInline = False,
                  .Name = "Tooltip",
                  .Value = xkcd_json.alt})


        Await msg.Channel.SendMessageAsync("", False, New EmbedBuilder() With {
            .Color = New Color(Convert.ToByte(150), Convert.ToByte(168), Convert.ToByte(200)),
            .Title = "XKCD Comic #" & xkcd_json.num & ": " & xkcd_json.safe_title,
.Url = xkcd_json.link,
.Fields = field,
.ImageUrl = xkcd_json.img,
.Author = New EmbedAuthorBuilder() With {
.IconUrl = "https://cdn.shopify.com/s/files/1/0149/3544/products/hoodie_1_7f9223f9-6933-47c6-9af5-d06b8227774a_1024x1024.png?v=1479786341",
.Name = "XKCD Comics"
},
.Footer = getfooter(msg)
}.Build)

    End Sub
    Function init()
        Module1.commands.Add(New mainclasses.modulecommand With {
                             .name = "xkcd",
                             .descrip = "Looks up a comic on XKCD or the latest if no number given",
                             .example = "xkcd",
                             .func = AddressOf xkcdf,
                             .permission = permissionManager.BotstionRole.regular
        })
        Log(New LogMessage(LogSeverity.Info, "Init", "Loaded XKCD Module 3."))
        Return True
    End Function
End Module
