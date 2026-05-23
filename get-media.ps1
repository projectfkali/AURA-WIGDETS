[Windows.Media.Control.GlobalSystemMediaTransportControlsSessionManager, Windows.Media, ContentType = WindowsRuntime] | Out-Null
$manager = [Windows.Media.Control.GlobalSystemMediaTransportControlsSessionManager]::RequestAsync().GetResults()
$session = $manager.GetCurrentSession()

if ($session) {
    $mediaProperties = $session.TryGetMediaPropertiesAsync().GetResults()
    $playbackInfo = $session.GetPlaybackInfo()
    $status = $playbackInfo.PlaybackStatus
    
    $obj = @{
        Title = $mediaProperties.Title
        Artist = $mediaProperties.Artist
        Status = $status.ToString()
    }
    $obj | ConvertTo-Json
} else {
    Write-Output '{"Status": "None"}'
}
