# load file with the log
$log = Get-Content -Path "tunnel.log"

# extract the URL
$url = $log | Select-String -Pattern 'trycloudflare.com' | ForEach-Object {
    if ($_ -match '(https://[^\s]+)') { $matches[1] }
} | Select-Object -First 1

# trim the URL
if ($url) {
    $url.Trim()
}
