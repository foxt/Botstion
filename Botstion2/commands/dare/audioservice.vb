Imports System.Collections.Concurrent
Imports System.Diagnostics
Imports System.IO
Imports System.Threading.Tasks
Imports Discord
Imports Discord.Audio

Public Module AudioServicee
    Private ReadOnly ConnectedChannels As New ConcurrentDictionary(Of ULong, IAudioClient)()

    Public Async Function JoinAudioAsync(guild As IGuild, target As IVoiceChannel) As Task
        Dim client As IAudioClient
        If ConnectedChannels.TryGetValue(guild.Id, client) Then
            Return
        End If
        If target.Guild.Id <> guild.Id Then
            Return
        End If

        Dim audioClient = Await target.ConnectAsync()

        ' If you add a method to log happenings from this service,
        ' you can uncomment these commented lines to make use of that.
        'await Log(LogSeverity.Info, $"Connected to voice on {guild.Name}.");
        If ConnectedChannels.TryAdd(guild.Id, audioClient) Then
        End If
    End Function

    Public Async Function LeaveAudio(guild As IGuild) As Task
        Dim client As IAudioClient
        If ConnectedChannels.TryRemove(guild.Id, client) Then
            'await Log(LogSeverity.Info, $"Disconnected from voice on {guild.Name}.");
            Await client.StopAsync()
        End If
    End Function

    Async Function SendAudioAsync(guild As IGuild, channel As IMessageChannel, path As String) As Task
        ' Your task: Get a full path to the file if the value of 'path' is only a filename.
        If Not File.Exists(path) Then
            Await channel.SendMessageAsync("File does not exist.")
            Return
        End If
        path = My.Computer.FileSystem.GetFileInfo(path).FullName
        Console.WriteLine(path)
        Dim client As IAudioClient
        'await Log(LogSeverity.Debug, $"Starting playback of {path} in {guild.Name}");
        Using output = (Await CreateStream(path)).StandardOutput
            Using stream = client.CreatePCMStream(AudioApplication.Music)
                Try

                    Await output.BaseStream.CopyToAsync(stream)
                    Await stream.FlushAsync()
                Catch

                End Try
            End Using
        End Using
    End Function

    Private Async Function CreateStream(path As String) As Task(Of Process)
        Return Process.Start(New ProcessStartInfo() With {
            .FileName = "ffmpeg.exe",
            .Arguments = "-hide_banner -loglevel panic -i ""{path}"" -ac 2 -f s16le -ar 48000 pipe:1",
            .UseShellExecute = False,
            .RedirectStandardOutput = True
        })
    End Function
End Module
