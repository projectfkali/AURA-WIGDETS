Add-Type @"
  using System;
  using System.Runtime.InteropServices;
  using System.Text;
  public class ActiveWindow {
      [DllImport("user32.dll")]
      public static extern IntPtr GetForegroundWindow();
      [DllImport("user32.dll")]
      public static extern int GetWindowText(IntPtr hWnd, StringBuilder text, int count);
      [DllImport("user32.dll")]
      public static extern uint GetWindowThreadProcessId(IntPtr hWnd, out uint lpdwProcessId);
  }
"@
$hwnd = [ActiveWindow]::GetForegroundWindow()
if ($hwnd -eq [IntPtr]::Zero) {
    Write-Output '{"Title":"","ProcessName":""}'
    exit
}

$title = New-Object System.Text.StringBuilder 256
$null = [ActiveWindow]::GetWindowText($hwnd, $title, 256)
[uint32]$processId = 0
$null = [ActiveWindow]::GetWindowThreadProcessId($hwnd, [ref]$processId)
$process = Get-Process -Id $processId -ErrorAction SilentlyContinue

$result = @{
    Title = $title.ToString()
    ProcessName = if ($process) { $process.ProcessName } else { "" }
}
$result | ConvertTo-Json -Compress
