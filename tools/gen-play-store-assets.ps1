Add-Type -AssemblyName System.Drawing

$ErrorActionPreference = "Stop"
$root = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
$outDir = Join-Path $root "assets\play-store"
New-Item -ItemType Directory -Force -Path $outDir | Out-Null

function New-Bitmap([int]$w, [int]$h) {
  $bmp = New-Object System.Drawing.Bitmap $w, $h, ([System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
  $bmp.SetResolution(72, 72)
  return $bmp
}

function New-Font($name, [float]$size, $style = [System.Drawing.FontStyle]::Regular) {
  try { return New-Object System.Drawing.Font($name, $size, $style, [System.Drawing.GraphicsUnit]::Pixel) }
  catch { return New-Object System.Drawing.Font("Arial", $size, $style, [System.Drawing.GraphicsUnit]::Pixel) }
}

function Save-Png($bmp, $path) {
  $bmp.Save($path, [System.Drawing.Imaging.ImageFormat]::Png)
  $bmp.Dispose()
}

$blue = [System.Drawing.Color]::FromArgb(255, 25, 112, 230)
$blue2 = [System.Drawing.Color]::FromArgb(255, 11, 79, 180)
$sky = [System.Drawing.Color]::FromArgb(255, 73, 165, 255)
$navy = [System.Drawing.Color]::FromArgb(255, 14, 32, 68)
$paper = [System.Drawing.Color]::FromArgb(255, 248, 251, 255)
$paper2 = [System.Drawing.Color]::FromArgb(255, 226, 240, 255)
$muted = [System.Drawing.Color]::FromArgb(255, 83, 101, 130)

# Play Store app icon: 512x512, opaque PNG.
$iconPath = Join-Path $outDir "app-icon-512.png"
$bmp = New-Bitmap 512 512
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
$g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit
$rectIcon = New-Object System.Drawing.Rectangle 0, 0, 512, 512
$bgIcon = New-Object System.Drawing.Drawing2D.LinearGradientBrush($rectIcon, $blue, $blue2, 45)
$g.FillRectangle($bgIcon, $rectIcon)

$brushPaper = New-Object System.Drawing.SolidBrush $paper
$brushBlue = New-Object System.Drawing.SolidBrush $blue
$brushSky = New-Object System.Drawing.SolidBrush $sky
$brushNavy = New-Object System.Drawing.SolidBrush $navy
$brushMuted = New-Object System.Drawing.SolidBrush $muted

$g.FillEllipse((New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(60, 255, 255, 255))), -70, -60, 260, 260)
$g.FillEllipse((New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(45, 255, 255, 255))), 330, 350, 220, 220)
$g.FillEllipse($brushPaper, 86, 72, 340, 340)
$g.FillEllipse((New-Object System.Drawing.SolidBrush($paper2)), 118, 104, 276, 276)
$g.FillEllipse($brushBlue, 184, 152, 144, 144)
$g.FillEllipse($brushSky, 206, 174, 100, 100)

$fontIconMain = New-Font "Segoe UI" 72 ([System.Drawing.FontStyle]::Bold)
$fontIconSub = New-Font "Segoe UI" 44 ([System.Drawing.FontStyle]::Bold)
$sf = New-Object System.Drawing.StringFormat
$sf.Alignment = [System.Drawing.StringAlignment]::Center
$sf.LineAlignment = [System.Drawing.StringAlignment]::Center
$g.DrawString("10", $fontIconMain, $brushPaper, (New-Object System.Drawing.RectangleF(0, 158, 512, 92)), $sf)
$g.DrawString("M", $fontIconSub, $brushPaper, (New-Object System.Drawing.RectangleF(0, 230, 512, 64)), $sf)

$pen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(150, 248, 251, 255), 3)
$g.DrawArc($pen, 62, 48, 388, 388, 210, 140)
$g.DrawArc($pen, 62, 48, 388, 388, 30, 92)
$g.Dispose()
Save-Png $bmp $iconPath

# Play Store feature graphic: 1024x500, opaque PNG.
$featurePath = Join-Path $outDir "feature-graphic-1024x500.png"
$bmp = New-Bitmap 1024 500
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
$g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit

$rect = New-Object System.Drawing.Rectangle 0, 0, 1024, 500
$lg = New-Object System.Drawing.Drawing2D.LinearGradientBrush($rect, [System.Drawing.Color]::FromArgb(255, 246, 250, 255), [System.Drawing.Color]::FromArgb(255, 229, 241, 255), 0)
$g.FillRectangle($lg, $rect)

# Decorative blue panel.
$panelRect = New-Object System.Drawing.Rectangle 0, 0, 384, 500
$panelBrush = New-Object System.Drawing.Drawing2D.LinearGradientBrush($panelRect, $blue2, $blue, 60)
$g.FillRectangle($panelBrush, 0, 0, 384, 500)
$g.FillEllipse((New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(32, 246, 241, 231))), -110, -80, 310, 310)
$g.FillEllipse((New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(24, 246, 241, 231))), 210, 320, 260, 260)

$g.FillEllipse($brushPaper, 106, 86, 174, 174)
$g.FillEllipse($brushBlue, 156, 128, 74, 74)
$font10 = New-Font "Segoe UI" 42 ([System.Drawing.FontStyle]::Bold)
$g.DrawString("10", $font10, $brushPaper, (New-Object System.Drawing.RectangleF(0, 134, 384, 58)), $sf)

$fontFeatureLogoA = New-Font "Segoe UI" 58 ([System.Drawing.FontStyle]::Bold)
$fontFeatureLogoB = New-Font "Segoe UI" 70 ([System.Drawing.FontStyle]::Bold)
$g.DrawString("JLPT", $fontFeatureLogoA, $brushPaper, (New-Object System.Drawing.RectangleF(54, 282, 180, 76)))
$g.DrawString("10M", $fontFeatureLogoB, (New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 172, 220, 255))), (New-Object System.Drawing.RectangleF(190, 270, 160, 90)))
$fontUnofficial = New-Font "Segoe UI" 19 ([System.Drawing.FontStyle]::Regular)
$g.DrawString("Unofficial Japanese study app", $fontUnofficial, (New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(210, 246, 241, 231))), (New-Object System.Drawing.RectangleF(56, 360, 300, 32)))

# Main copy.
$fontTitle = New-Font "Segoe UI" 52 ([System.Drawing.FontStyle]::Bold)
$fontSub = New-Font "Segoe UI" 25 ([System.Drawing.FontStyle]::Regular)
$fontBadge = New-Font "Segoe UI" 22 ([System.Drawing.FontStyle]::Bold)
$fontSmall = New-Font "Segoe UI" 18 ([System.Drawing.FontStyle]::Regular)
$brushInk = New-Object System.Drawing.SolidBrush $navy
$brushMuted = New-Object System.Drawing.SolidBrush $muted

$g.DrawString("10 minutes a day", $fontTitle, $brushInk, (New-Object System.Drawing.RectangleF(430, 78, 560, 68)))
$g.DrawString("JLPT N5-N2 Study", $fontTitle, $brushInk, (New-Object System.Drawing.RectangleF(430, 138, 560, 72)))
$g.DrawString("Vocabulary - Grammar - Reading - Listening", $fontSub, $brushMuted, (New-Object System.Drawing.RectangleF(434, 224, 560, 42)))

$badges = @("N5", "N4", "N3", "N2")
$x = 434
foreach ($b in $badges) {
  $r = New-Object System.Drawing.Rectangle $x, 294, 82, 48
  $g.FillRectangle((New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 255, 249, 241))), $r)
  $g.DrawRectangle((New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(255, 226, 211, 193), 2)), $r)
  $g.DrawString($b, $fontBadge, $brushInk, (New-Object System.Drawing.RectangleF($x, 302, 82, 32)), $sf)
  $x += 98
}

$g.FillRectangle((New-Object System.Drawing.SolidBrush($blue)), 434, 384, 218, 48)
$g.DrawString("JLPT10M", $fontBadge, $brushPaper, (New-Object System.Drawing.RectangleF(434, 393, 218, 34)), $sf)
$g.DrawString("Not affiliated with official JLPT organizations", $fontSmall, $brushMuted, (New-Object System.Drawing.RectangleF(676, 394, 320, 30)))

$g.Dispose()
Save-Png $bmp $featurePath

Write-Host "Wrote $iconPath"
Write-Host "Wrote $featurePath"
