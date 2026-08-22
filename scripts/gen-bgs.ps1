Add-Type -AssemblyName System.Drawing

$root = 'F:\MyApp\eternal\dsh-theme\assets\backgrounds'

function New-Bg {
  param([string]$name, [object[]]$stops, [object[]]$glows)
  $w = 1600; $h = 900
  $bmp = New-Object System.Drawing.Bitmap($w, $h)
  $g = [System.Drawing.Graphics]::FromImage($bmp)
  $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias

  # vertical linear gradient
  $rect = New-Object System.Drawing.Rectangle(0, 0, $w, $h)
  $brush = New-Object System.Drawing.Drawing2D.LinearGradientBrush($rect, $stops[0], $stops[-1], [System.Drawing.Drawing2D.LinearGradientMode]::Vertical)
  $cb = New-Object System.Drawing.Drawing2D.ColorBlend
  $n = $stops.Count
  $positions = New-Object 'float[]' $n
  for ($i = 0; $i -lt $n; $i++) { $positions[$i] = $i / ($n - 1) }
  $cb.Positions = $positions
  $cb.Colors = $stops
  $brush.InterpolationColors = $cb
  $g.FillRectangle($brush, $rect)

  # soft radial glows: [cx, cy, radius, alpha, r, g, b]
  foreach ($gl in $glows) {
    $cx = [int]$gl[0]; $cy = [int]$gl[1]; $r = [int]$gl[2]
    $alpha = [int]$gl[3]; $rr = [int]$gl[4]; $gg = [int]$gl[5]; $bb = [int]$gl[6]
    for ($k = $r; $k -gt 0; $k -= 8) {
      $a = [int]($alpha * (1 - $k / $r))
      $c = [System.Drawing.Color]::FromArgb($a, $rr, $gg, $bb)
      $sb = New-Object System.Drawing.SolidBrush($c)
      $g.FillEllipse($sb, $cx - $k, $cy - $k, $k * 2, $k * 2)
      $sb.Dispose()
    }
  }

  $out = Join-Path $root $name
  $bmp.Save($out, [System.Drawing.Imaging.ImageFormat]::Png)
  $g.Dispose(); $bmp.Dispose()
  Write-Output "wrote $out"
}

# 1) aurora.png — teal / purple / deep space
$c1 = [System.Drawing.Color]::FromArgb(255, 10, 42, 64)
$c2 = [System.Drawing.Color]::FromArgb(255, 54, 28, 88)
$c3 = [System.Drawing.Color]::FromArgb(255, 14, 12, 40)
$c4 = [System.Drawing.Color]::FromArgb(255, 4, 4, 14)
New-Bg 'aurora.png' @($c1, $c2, $c3, $c4) @(
  @(300, 180, 420, 130, 80, 220, 216),
  @(1250, 320, 520, 95, 168, 85, 247),
  @(800, 620, 620, 75, 34, 211, 238)
)

# 2) sunset.png — warm amber / coral / deep plum
$s1 = [System.Drawing.Color]::FromArgb(255, 60, 16, 30)
$s2 = [System.Drawing.Color]::FromArgb(255, 150, 48, 60)
$s3 = [System.Drawing.Color]::FromArgb(255, 232, 120, 80)
$s4 = [System.Drawing.Color]::FromArgb(255, 24, 8, 20)
New-Bg 'sunset.png' @($s1, $s2, $s3, $s4) @(
  @(1100, 220, 460, 120, 255, 150, 90),
  @(420, 520, 480, 80, 255, 94, 98),
  @(900, 700, 500, 60, 244, 114, 182)
)

# 3) deep-space.png — indigo / navy / slate with cyan rim
$d1 = [System.Drawing.Color]::FromArgb(255, 8, 12, 26)
$d2 = [System.Drawing.Color]::FromArgb(255, 20, 26, 58)
$d3 = [System.Drawing.Color]::FromArgb(255, 30, 34, 74)
$d4 = [System.Drawing.Color]::FromArgb(255, 6, 8, 18)
New-Bg 'deep-space.png' @($d1, $d2, $d3, $d4) @(
  @(250, 200, 380, 90, 56, 189, 248),
  @(1150, 650, 540, 80, 99, 102, 241),
  @(800, 150, 460, 60, 45, 212, 191)
)
