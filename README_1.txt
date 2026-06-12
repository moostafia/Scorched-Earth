==============================================================
 TANK VOLLEY  (scorched-earth.html)
 A browser tribute to Scorched Earth & Pocket Tanks.
 One HTML file. No installs. Phones, tablets, and computers.
==============================================================

HOW A MATCH WORKS
-----------------
- 2-6 tanks battle on a big fixed landscape (same map for every
  device - portrait phones just see it zoomed out, never squished).
- 10 VOLLEYS: everyone fires once per volley.
- Every match deals the SAME random 10 weapons (from a pool of 22)
  to all players. Each weapon fires exactly ONCE - spent weapons
  vanish from your rack, so pick your moment.
- SCORING: every bomb has a blast radius. A direct hit earns the
  weapon's full points; the further from the blast centre, the
  fewer points. HITTING YOURSELF SUBTRACTS points.
- 4 MOVES per match (⇤ ⇥ buttons) to reposition along the ground.
- Buried by a dirt weapon? Your next shot blasts you free AND fires.
- Shots can sail right past the edges of the arena (the land keeps
  going - they just land in the scenery or fly away).
- Most points after 10 volleys wins.

THE ARSENAL  (22 weapons - each card shows points + blast radius)
-----------------------------------------------------------------
 Single Shot   60pt r20   small & precise
 Big Shot      30pt r45   big dumb blast
 Three Shot    18pt r16   3-shot spread
 Five Shot     11pt r13   5-shot fan
 Nuke          30pt r130  HUGE crater + 2.5s colour show that keeps
                          dealing pulsing bonus points to anyone in
                          the glow (closer = bigger ticks)
 Sniper       100pt r8    fast, flat, tiny blast - direct hits only
 MIRV          14pt r18   splits into 5 at the top of its arc
 Death's Head   9pt r14   splits into 9
 Leapfrog      16pt r22   three hopping blasts (boing!)
 Funky Bomb     8pt r18   bursts into colourful bomblets
 Heavy Roller  40pt r55   rolls along the ground for ~2 seconds
 Roller        50pt r30   rolls for ~1 second
 Digger        40pt r30   drills THROUGH a hill once, exits the far
                          side, then explodes on its next landing
 Sandhog       13pt r18   tunnels with 3 underground blasts
 Napalm        10pt r24   liquid fire that flows downhill & burns
 Dirt Ball     12pt r45   buries the target in dirt
 Ton of Dirt    8pt r70   buries half the map
 Heatseeker    50pt r22   curves toward the nearest enemy (beeps)
 Crazy Ivan    55pt r24   wobbles unpredictably
 Hail Storm     7pt r13   8 shots rain from the sky
 Skipper       45pt r40   bounces along the ground
 Magic Wall     6pt r10   raises a thin stone wall (block shots, or
                          box an enemy in - it is destructible)
 Rule of thumb: harder to land = worth more points.

CONTROLS
--------
 Keyboard: arrows = aim & power (power goes to 200 for huge range)
           1-9, 0 = weapon    , . = move    SPACE = fire
 Phone:    on-screen steppers, swipeable weapon rack, FIRE button.
 Camera:   pinch = zoom, one-finger drag = pan, double-tap = reset.
           Mouse: scroll wheel zooms, drag pans.
 Music:    dropdown in the top bar - Battle, Bouncy 8-bit, Spooky,
           Chill, or Off. (All tunes are original chiptunes.)
 Wind changes every volley. The aim guide shows only the first 1/8
 of the arc - the rest is judgement.

==============================================================
 THREE WAYS TO PLAY
==============================================================

1) ONE DEVICE - zero setup
   Just open scorched-earth.html in a browser.
   Pass-and-play humans + AI opponents. Works offline.

2) ONLINE - one upload, no server (GitHub Pages + Supabase)
   a) Make a free project at supabase.com.
      Project Settings -> API -> copy the Project URL and the
      anon PUBLIC key (safe to share - it is meant to be public).
   b) Open the HTML in any text editor. At the very top:
         window.GAME_CONFIG = {
           SUPABASE_URL: "",
           SUPABASE_KEY: ""
         };
      Paste your two values between the quotes and save.
   c) Upload to a GitHub repo, rename to index.html if you like,
      then Settings -> Pages -> deploy from branch (main / root).
   d) Share your link - add #room=family to preset the room code.
   e) Everyone: PLAY WITH FAMILY -> Online -> type a name and the
      SAME room code -> CONNECT. The first person in is the host
      (crown) and presses START BATTLE.

   ABOUT CREDENTIALS: the lobby pre-fills them from the file and
   shows "credentials loaded ✓" so you can see they worked. If you
   ever type them into the lobby instead, that device remembers
   them permanently. You can also pass them in a link:
       yoursite/#supa=URL,KEY&room=family

3) SAME WI-FI - no internet needed (included server)
   Needs Node.js (nodejs.org), nothing else - no npm install.
   a) Put server.js in the same folder as scorched-earth.html.
   b) Run:  node server.js
   c) Open the printed http://192.168.x.x:8080 on every device.
   d) PLAY WITH FAMILY -> Same Wi-Fi -> CONNECT.

GOOD TO KNOW
------------
- The HOST's device runs the match - keep that tab open. If another
  player drops mid-game, their tank becomes an AI.
- Only the active shooter sees their own aim line.
- Guests sync terrain at turn boundaries; shots, explosions, lava,
  and the nuke show all stream live.
- Supabase free tier is plenty for family games; shot updates are
  rate-limited to stay well within it.
