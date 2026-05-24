$spotify = Get-Process -Name Spotify -ErrorAction SilentlyContinue | Where-Object { $_.MainWindowTitle -ne "" } | Select-Object -First 1

if ($spotify) {
    $title = $spotify.MainWindowTitle
    if ($title -eq "Spotify Premium" -or $title -eq "Spotify Free" -or $title -eq "Spotify") {
        Write-Output '{"Status":"Paused", "Track":"Duraklatıldı"}'
    } else {
        # Escape quotes just in case
        $title = $title -replace '"', '\"'
        Write-Output "{`"Status`":`"Playing`", `"Track`":`"$title`"}"
    }
} else {
    Write-Output '{"Status":"None", "Track":"Sistem Sesi"}'
}
