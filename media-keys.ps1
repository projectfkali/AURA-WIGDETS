param([string]$action)

Add-Type -TypeDefinition @"
using System;
using System.Runtime.InteropServices;
public class Keyboard {
    [DllImport("user32.dll")]
    public static extern void keybd_event(byte bVk, byte bScan, uint dwFlags, int dwExtraInfo);
}
"@

if ($action -eq "playpause") {
    [Keyboard]::keybd_event(0xB3, 0, 0, 0) # VK_MEDIA_PLAY_PAUSE
} elseif ($action -eq "next") {
    [Keyboard]::keybd_event(0xB0, 0, 0, 0) # VK_MEDIA_NEXT_TRACK
} elseif ($action -eq "prev") {
    [Keyboard]::keybd_event(0xB1, 0, 0, 0) # VK_MEDIA_PREV_TRACK
} elseif ($action -eq "open-spotify") {
    Start-Process "spotify:"
}
