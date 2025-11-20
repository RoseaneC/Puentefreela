@echo off
cd frontend/src/components/ui
for %%f in (*) do (
    if not "%%f"=="button.tsx" (
        if not "%%f"=="card.tsx" (
            if not "%%f"=="input.tsx" (
                if not "%%f"=="label.tsx" (
                    if not "%%f"=="badge.tsx" (
                        if not "%%f"=="alert.tsx" (
                            del "%%f"
                        )
                    )
                )
            )
        )
    )
)
echo Done
