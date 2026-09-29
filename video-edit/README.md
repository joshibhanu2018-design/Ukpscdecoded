# Editing VIDEO 1 on the laptop (free, CPU only)

Uses only **FFmpeg** (free). Your files in `raw\` and `ASSETS\` are only read, never changed.
Working files go in `work\`, and the finished video goes in `export\`. None of these folders are uploaded to GitHub.

Open **PowerShell** and run each line, one at a time:

```
cd C:\Users\Administrator\Documents\Ukpscdecoded
git pull
```

## Step 1 — setup (once)
```
powershell -ExecutionPolicy Bypass -File video-edit\1_setup.ps1
```
Close PowerShell and open it again, then `cd` back into the folder.
Put 1–2 music tracks in `music\`. For the "selected" moment, add a short win sound named `win.mp3` to `music\`.

## Step 2 — convert, join and cut the pauses (runs for a few hours, so start it at night)
```
powershell -ExecutionPolicy Bypass -File video-edit\2_prepare.ps1
```
This joins 1514 → 1515 → 1516 into 1080p and removes the pauses automatically. Result: `work\main_cut.mp4`.

## Step 3 — remove bad takes
Watch `work\main_cut.mp4` in VLC. Wherever you said a line twice or made a mistake, open
`work\remove_takes.csv` in **Notepad** and add a line:
```
start,end,note
12:05,12:41,repeated 2021 line
1:02:10,1:03:00,phone rang
```
Then run:
```
powershell -ExecutionPolicy Bypass -File video-edit\3_remove_takes.ps1
```
Result: `work\main_clean.mp4`. **Take every time for step 4 from this file.**

## Step 4 — pictures, titles, music
Open `work\overlays.csv` in **Notepad**. It already has a line for every EDIT note in the script.
Watch `main_clean.mp4` and type the **start** and **end** time in each line where it should appear.
Lines with no start time are skipped. You can copy lines, delete lines or add new ones.

| type | what it does | asset / text |
|---|---|---|
| `full` | picture fills the screen | asset = name as shown in Explorer, e.g. `2021RESULT` |
| `corner` | small picture, top-right | asset |
| `title` | black screen + big white text | text (`\|` = new line) |
| `text` | yellow key line at the bottom | text |
| `lowerthird` | blue name strip, bottom-left | text |
| `card` | logo + "Link in description", bottom-left | asset (default LOGO), text |
| `zoom` | punch-in on your face (hides jump cuts) | — |
| `musicoff` | no music between start and end | — |
| `sound` | play a sound once at start | asset, e.g. `win` |

Test the first 3 minutes first:
```
powershell -ExecutionPolicy Bypass -File video-edit\4_render.ps1 -Preview
```
Check `export\VIDEO1_preview.mp4`. If it looks right, make the full video (this takes several hours, so keep the laptop plugged in):
```
powershell -ExecutionPolicy Bypass -File video-edit\4_render.ps1
```
Result: `export\VIDEO1_final.mp4`. Upload it to YouTube.

## Notes
- **Blur roll numbers yourself** before using the marksheets: open a copy in Paint, draw a box over the number, and save it into `ASSETS\` under a new name. Put that new name in overlays.csv.
- Captions: after uploading, use YouTube Studio → Subtitles → auto-generate, then fix the words.
- Music too loud or too quiet: change `$MusicVolume` at the top of `4_render.ps1`. Pauses not being cut: change `$NoiseDb` to `-30` in `2_prepare.ps1`.
- If something fails, copy the **red text** (not a screenshot of secrets) and paste it to Claude.
