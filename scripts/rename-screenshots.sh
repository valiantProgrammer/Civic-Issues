#!/usr/bin/env bash
# scripts/rename-screenshots.sh
# Safely renames and moves screenshots to docs/assets/screenshots/ with kebab-case filenames

set -euo pipefail

DEST_DIR="docs/assets/screenshots"
SRC_DIR="public/images/screenshots"

mkdir -p "$DEST_DIR"

declare -A MAPPING=(
  ["Screenshot 2026-10-03 220905.png"]="landing-hero-light.png"
  ["Screenshot 2026-10-03 220925.png"]="how-it-works.png"
  ["Screenshot 2026-10-03 220938.png"]="explore-feed.png"
  ["Screenshot 2026-10-03 220951.png"]="civic-pulse-metrics.png"
  ["Screenshot 2026-10-03 221001.png"]="civic-pulse-distribution.png"
  ["Screenshot 2026-10-03 221013.png"]="mission-roles.png"
  ["Screenshot 2026-10-03 221030.png"]="dashboard-light.png"
  ["Screenshot 2026-10-03 221041.png"]="dashboard-dark.png"
  ["Screenshot 2026-10-03 221051.png"]="timeline-tracking-dark.png"
  ["Screenshot 2026-10-03 221106.png"]="timeline-tracking-light.png"
  ["Screenshot 2026-10-03 221245.png"]="report-wizard-intake.png"
  ["Screenshot 2026-10-03 221255.png"]="report-pin-light.png"
  ["Screenshot 2026-10-03 221307.png"]="report-pin-dark.png"
  ["Screenshot 2026-10-03 221327.png"]="help-support-light.png"
  ["Screenshot 2026-10-03 221335.png"]="help-support-dark.png"
  ["Screenshot 2026-10-03 221410.png"]="notifications-light.png"
  ["Screenshot 2026-10-03 221423.png"]="notifications-dark.png"
  ["Screenshot 2026-10-03 221441.png"]="profile-settings-light.png"
  ["Screenshot 2026-10-03 221453.png"]="profile-settings-dark.png"
  ["Screenshot 2026-10-03 221624.png"]="admin-analytics.png"
  ["Screenshot 2026-10-03 221634.png"]="admin-triage-table.png"
  ["Screenshot 2026-10-03 221644.png"]="admin-verification-action.png"
  ["download.png"]="lifecycle-diagram.png"
  ["download-2.png"]="architecture-diagram.png"
)

echo "Copying / Moving screenshots to $DEST_DIR..."

for src in "${!MAPPING[@]}"; do
  dest="${MAPPING[$src]}"
  src_path="$SRC_DIR/$src"
  dest_path="$DEST_DIR/$dest"

  if [ -f "$src_path" ]; then
    if git rev-parse --is-inside-work-tree >/dev/null 2>&1 && git ls-files --error-unmatch "$src_path" >/dev/null 2>&1; then
      git mv "$src_path" "$dest_path"
      echo "[git mv] $src -> $dest"
    else
      cp -f "$src_path" "$dest_path"
      echo "[cp] $src -> $dest"
    fi
  else
    echo "[skip] $src not found in $SRC_DIR"
  fi
done

echo "Screenshot organization complete!"
