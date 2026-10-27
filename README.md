# ChromaVault

Green screen animation generator. 100 niche, click korlei MP4 (H.264, 30fps, 4K) toiri hoy.
Render hoy **browser-e** (WebCodecs + mp4-muxer), tai Vercel-e ba je kono static host-e kaj kore.

## Local
```bash
npm install
npm run dev     # http://localhost:3000
```

## Vercel deploy
1. GitHub-e push koro (`node_modules`, `.next` push korbe na, `.gitignore` ache)
2. vercel.com -> Add New Project -> repo select -> Deploy (kono env variable lage na)

## Babohar
- Niche-e click -> render + auto download (checkbox bondho korle shudhu preview hoy)
- "Sob ta ek ek kore banao" -> queue. Browser "multiple downloads" permission chaile Allow koro
- Tab open rakho, PC sleep-e jete dio na. 4K 20s clip-e kichu minute lage
- "Metadata CSV" -> sob niche-er title/keywords. Column Adobe-r CSV template-er sathe milie nio
- File name fixed (`<niche>-green-screen-loop.mp4`), tai CSV-r Filename-er sathe mile jay

## Browser
Desktop Chrome / Edge sobcheye bhalo. 4K encode PC-r hardware-er upor nirbhor kore; na hole error dekhabe, tokhon 1080p dao.
RAM: 4K 20s ~125MB file memory-te thake.

## Optional: local server batch (ffmpeg)
`npm run jobs` then `npm run dev` then `npm run batch` -> videos/ folder. (Vercel-e eta cholbe na.)

## Adobe Stock
- Title/keyword-e "4K" ar "video" nai (Adobe-r guide onujayi).
- Age 10-15 ta upload kore review dekho; onek similar clip reject hote pare.
- Browser MP4-te title metadata embed hoy na; title/keyword CSV ba portal-e dao.
