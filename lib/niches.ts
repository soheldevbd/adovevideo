import { fileSlug } from "./ui";
// style | name | palette(0 gold,1 white,2 pink,3 red,4 blue,5 orange,6 purple,7 colorful) | energy(1-3) | keywords
const RAW = `
snow|Christmas Snowfall|1|1|christmas,xmas,holiday,december,festive
snow|Heavy Blizzard Snow|1|3|blizzard,snowstorm,winter storm,heavy snow,freezing
snow|Blue Ice Snowflakes|4|2|ice,frozen,frost,cold,winter wonderland
snow|Golden New Year Snow|0|1|new year,celebration,luxury,gold glitter,festive
snow|Pink Cotton Snow|2|1|cute,pastel,soft,dreamy,fairy tale
snow|Slow Winter Snowfall|1|1|calm,peaceful,winter night,cozy,serene
snow|Red Holiday Snow|3|2|santa,holiday season,gift,cheerful,seasonal
snow|Purple Magic Snow|6|1|magic,fantasy,enchanted,night,mystical
snow|Colorful Snowflakes|7|2|playful,kids,fun,cartoon style,bright
snow|Orange Sunset Snow|5|1|sunset,warm,golden hour,cinematic,dusk
rain|Light Rain Drops|1|1|drizzle,light rain,calm,mist,spring rain
rain|Heavy Rainstorm|1|3|downpour,thunderstorm,monsoon,heavy rain,storm
rain|Blue Rain Overlay|4|2|water drops,rainy day,cool,wet,cloudy
rain|Golden Rain|0|2|luxury,magic rain,glamour,precious,wealth
rain|Pink Rain Drops|2|1|cute,romantic,pastel,rainy mood,dreamy
rain|Purple Night Rain|6|2|night,mystery,moody,cinematic,dark mood
rain|Red Rain|3|2|dramatic,horror,danger,intense,thriller
rain|Orange Autumn Rain|5|1|autumn,fall season,warm rain,cozy,evening
rain|Colorful Rain|7|2|rainbow,playful,kids,fun,bright
rain|Silver Monsoon Rain|1|2|monsoon,wet season,tropical,rainfall,weather forecast
confetti|Birthday Confetti|7|2|birthday,party,celebrate,balloons,happy
confetti|Gold Celebration Confetti|0|2|luxury,award,anniversary,gala,festive
confetti|New Year Confetti|0|3|new year,countdown,midnight,nye,party
confetti|Wedding Confetti|1|1|wedding,bride,groom,romantic,marriage
confetti|Pink Baby Shower Confetti|2|1|baby shower,girl,gender reveal,cute,pastel
confetti|Blue Boy Confetti|4|1|baby boy,gender reveal,cute,celebration,kids party
confetti|Red Winner Confetti|3|3|winner,victory,success,championship,congratulations
confetti|Purple Party Confetti|6|2|disco,night party,celebration,club,festival
confetti|Orange Carnival Confetti|5|3|carnival,festival,fiesta,parade,fun
confetti|Graduation Confetti|7|2|graduation,school,achievement,success,ceremony
hearts|Valentine Hearts|3|1|valentine,february,love,romantic,romance
hearts|Pink Floating Hearts|2|1|cute,girly,affection,sweet,kawaii
hearts|Golden Love Hearts|0|1|luxury,anniversary,wedding,premium,love
hearts|White Wedding Hearts|1|1|wedding,bride,pure,elegant,marriage
hearts|Purple Hearts|6|1|magic love,fantasy,mystic,dreamy,romantic night
hearts|Blue Hearts|4|1|friendship,calm,peaceful,kind,support
hearts|Colorful Hearts|7|2|rainbow,pride,fun,kids,playful
hearts|Fast Rising Hearts|3|3|social media,reaction,popular,romantic,dynamic
hearts|Orange Warm Hearts|5|1|warm,kindness,charity,caring,family
hearts|Slow Dreamy Hearts|2|1|slow motion,dreamy,soft focus,tender,calm
petals|Gold Falling Petals|0|2|golden,luxury,spring,romantic,nature
petals|Cherry Blossom Petals|2|1|cherry blossom,sakura,japan,spring,pink
petals|Rose Petals Falling|3|1|rose,romance,valentine,wedding,flower
petals|White Wedding Petals|1|1|wedding,bride,elegant,pure,ceremony
petals|Purple Lavender Petals|6|1|lavender,relaxing,spa,fragrance,floral
petals|Blue Flower Petals|4|1|blue flowers,fresh,calm,garden,delicate
petals|Orange Marigold Petals|5|2|marigold,festival,celebration,traditional,warm
petals|Colorful Spring Petals|7|2|spring,garden,joy,easter,blossoming
petals|Windy Petals Storm|2|3|windy,breeze,petal storm,dynamic,fast
petals|Slow Romantic Petals|3|1|slow motion,romantic,gentle,love,tender
sparkles|Gold Glitter Sparkles|0|2|gold glitter,luxury,glamour,shiny,golden
sparkles|White Twinkling Stars|1|2|stars,twinkle,night sky,magic,wish
sparkles|Pink Fairy Sparkles|2|1|fairy dust,princess,cute,girly,fantasy
sparkles|Blue Magic Sparkles|4|2|magic,spell,ice,fantasy,mystical
sparkles|Purple Magic Dust|6|2|enchanted,wizard,mystic,cosmic,spell
sparkles|Red Shine Sparkles|3|2|valentine,glamour,festive,sparkling,party
sparkles|Orange Spark Glints|5|2|golden hour,glint,warm,shine,reflection
sparkles|Colorful Glitter|7|3|rainbow glitter,party,unicorn,fun,kids
sparkles|Slow Shimmer|1|1|shimmer,subtle,elegant,soft,dreamy
sparkles|Fast Flash Sparkles|0|3|flash,award,reveal,celebration,burst
bubbles|Soap Bubbles|7|1|soap,wash,clean,kids,playful
bubbles|Underwater Bubbles|4|2|underwater,ocean,sea,diving,aquarium
bubbles|Pink Bubbles|2|1|cute,baby,pastel,soft,sweet
bubbles|Golden Bubbles|0|1|champagne,luxury,celebration,fizz,sparkling
bubbles|White Clear Bubbles|1|2|clear,transparent,clean,fresh,water
bubbles|Purple Magic Bubbles|6|1|magic,fantasy,dreamy,mystical,floating
bubbles|Fast Rising Bubbles|4|3|fizz,carbonated,soda,rising,dynamic
bubbles|Red Bubbles|3|1|romantic,love,valentine,party,soft
bubbles|Orange Bubbles|5|1|summer,citrus,fresh,juice,warm
bubbles|Slow Floating Bubbles|1|1|slow motion,calm,peaceful,relaxing,meditation
embers|Fire Embers Rising|5|2|fire,sparks,flame,campfire,burning
embers|Red Hot Sparks|3|3|hot,explosion,forge,welding,intense
embers|Golden Embers|0|2|glowing,bonfire,warm,ember glow,heat
embers|Campfire Sparks|5|1|camping,night,bonfire,outdoor,cozy
embers|Blue Flame Sparks|4|2|cold fire,magic fire,energy,plasma,mystic
embers|Purple Magic Embers|6|2|fantasy,magic,dark,spell,enchanted
embers|White Hot Sparks|1|3|metal,grinding,industrial,sparks,heat
embers|Colorful Fireworks Sparks|7|3|fireworks,celebration,festival,night,burst
embers|Slow Floating Embers|3|1|slow motion,ash,remains,atmosphere,cinematic
embers|Fireflies Glow|0|1|fireflies,summer night,forest,glow,magical
leaves|Autumn Leaves Falling|5|2|autumn,fall,season,foliage,orange leaves
leaves|Golden Fall Leaves|0|1|golden,thanksgiving,october,nature,warm
leaves|Red Maple Leaves|3|2|maple,fall colors,harvest,seasonal,autumn
leaves|Colorful Autumn Leaves|7|2|fall colors,forest,vibrant,park,seasonal
leaves|Windy Leaves Storm|5|3|wind,windy,gust,storm,dynamic
leaves|Slow Drifting Leaves|0|1|calm,peaceful,slow motion,gentle,serene
leaves|Purple Magic Leaves|6|1|fantasy,enchanted,fairy tale,mystic,surreal
leaves|Blue Frost Leaves|4|1|frost,early winter,cold,november,fresh
leaves|Pink Spring Leaves|2|1|spring,fresh,blossom,soft,gentle
leaves|White Winter Leaves|1|1|winter,ice,snowy,cold,abstract
dust|Floating Dust Particles|1|1|dust motes,atmosphere,cinematic,particles,haze
dust|Golden Dust Bokeh|0|1|bokeh,golden light,sun rays,warm,dreamy
dust|Magic Dust Particles|6|1|magic,fantasy,mystic,fairy dust,enchanted
dust|Blue Dust Particles|4|1|cold,tech,sci-fi,clean,atmosphere
dust|Pink Dust Bokeh|2|1|romantic,soft,pastel,dream,glow
dust|Orange Dust Embers|5|1|warm,desert,sunset,smoky,vintage
dust|Fast Dust Storm|5|3|sandstorm,wind,desert,debris,dynamic
dust|Colorful Particles|7|2|abstract,colorful,floating,digital,festive
dust|Red Dust Particles|3|1|dramatic,dark,thriller,mood,cinematic
dust|Slow Light Particles|0|1|slow motion,light dust,calm,ethereal,peaceful
`;
export type Niche = { id: string; style: string; name: string; pal: number; energy: number; kw: string[] };
export const NICHES: Niche[] = RAW.trim().split("\n").map((l) => {
  const [style, name, pal, energy, kw] = l.split("|");
  return { id: fileSlug(name), style, name, pal: +pal, energy: +energy, kw: kw.split(",") };
});
export const nicheFile = (n: Niche) => `${n.id}-green-screen-loop.mp4`;
