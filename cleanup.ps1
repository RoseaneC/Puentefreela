# Cleanup script for UI components
$keepFiles = @("button.tsx", "card.tsx", "input.tsx", "label.tsx", "badge.tsx", "alert.tsx")
$allFiles = Get-ChildItem "frontend/src/components/ui/" -Name

foreach ($file in $allFiles) {
    if ($keepFiles -notcontains $file) {
        Remove-Item "frontend/src/components/ui/$file" -Force
        Write-Host "Removed $file"
    } else {
        Write-Host "Keeping $file"
    }
}
