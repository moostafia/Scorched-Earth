SCORCHED EARTH — how to play & how to host
===========================================

THE GAME
--------
Artillery game: aim, set power, pick a weapon, fire. Wind and hilly/cliffy
terrain make every shot a guess (the aim line only shows the first 1/8).

NOBODY DIES. You score points by hitting opponents. FIRST TO THE TARGET SCORE
WINS (default 150 points; set it in the menu, 25-500). Shoot yourself and you
LOSE that weapon's points. Mud Ball buries a tank (they must dig out, losing
points while buried).

10 WEAPONS, each with its own effect:
    Baby Missile (10)   Heavy Missile (20)   Roller (20)   Digger (20)
    Mud Ball (15, buries)   Nuke (60, huge)
    MIRV (28) - splits into 5 spreading warheads at the top of its arc
    Funky Bomb (18) - bursts into a dozen colourful bomblets
    Napalm (12 + burn) - sticky fire that burns ~2s, scoring the whole time
    Fireworks (8 + sparkle) - sparkles ~2.5s and rains bonus points (no crater)
Closer hits score more. Specials are limited; Baby Missile is infinite.

The terrain and sky are picked fresh for each GAME and stay for the whole game
(the terrain erodes as you play). Everything stays in sync for everyone online.


CONTROLS
    arrows: aim (left/right) + power (up/down)   1-9,0: pick weapon   SPACE: fire
    (On phones use the on-screen steppers, the swipeable weapon strip, and FIRE.)
    CAMERA: pinch with two fingers to zoom, drag to pan around the battlefield,
    double-tap to reset the view. Mouse: scroll wheel zooms, drag pans.


==========================================================================
THREE WAYS TO RUN IT
==========================================================================

1) SOLO / SAME-DEVICE  (zero setup)
   Double-click scorched-earth.html. You get pass-and-play (take turns on one
   device) plus AI opponents. Fully offline.


2) ONLINE FROM ONE WEBSITE  (recommended for family on different devices)
   Upload the single HTML file to any static host (GitHub Pages, Netlify,
   etc.) and use Supabase (free) to carry the live game between players. No
   server to run; animations come through for everyone.

   ONE-TIME SETUP (about 5 minutes):
   a) Go to supabase.com, sign in, create a new project (free tier is fine).
   b) In the project: Project Settings -> API. Copy two things:
        - Project URL        (looks like https://abcd1234.supabase.co)
        - anon public key    (a long "anon"/"public" key — safe to share)
      (Realtime is on by default; you do NOT need any database tables.)
   c) Open scorched-earth.html in a text editor. Near the very top you'll see:
        window.SUPABASE_URL = "";
        window.SUPABASE_ANON_KEY = "";
      Paste your URL and anon key between the quotes. Save.
      (You can skip this and type them into the lobby instead, but pasting
       them in the file means everyone shares them automatically.)

   PUT IT ON GITHUB PAGES:
   d) Create a GitHub repo, upload scorched-earth.html, rename it index.html
      (or keep the name and open .../scorched-earth.html).
   e) Repo -> Settings -> Pages -> Deploy from branch -> main / root.
      GitHub gives you a URL like  https://YOURNAME.github.io/REPO/
   f) Share that link. To preset a room, share:
        https://YOURNAME.github.io/REPO/#room=family

   PLAYING:
   g) Everyone opens the link, taps "PLAY WITH FAMILY", makes sure the toggle
      is on "Online", types a name and the SAME room code, taps CONNECT.
   h) You'll all appear in the lobby. The FIRST person to connect is the host
      and picks AI count / rounds / skill, then taps START BATTLE.
   i) Everyone controls their own tank from their own device.


3) SAME WI-FI, NO INTERNET  (local server)
   If you're all on one Wi-Fi and don't want Supabase, use the included server.
   Needs Node.js (nodejs.org); no "npm install".
   a) Put scorched-earth.html and server.js in the same folder.
   b) Run:   node server.js
   c) It prints an address like  http://192.168.1.42:8080
   d) Open that on each device, tap "PLAY WITH FAMILY", switch the toggle to
      "Same Wi-Fi", tap CONNECT. First device in is the host.
   (Change the port:  PORT=3000 node server.js)


==========================================================================
HOW THE ONLINE SYNC WORKS
==========================================================================
One device (the host) runs the actual game and streams the picture — terrain,
tanks, each shot in flight, explosions, and the background theme — to everyone
else, who mirror it and send their own shots back. Host-authoritative: simple
and reliable, not built to stop cheating (fine for family).

NOTES / LIMITS
  - Keep the host's tab open; it runs the match. If a player drops, their tank
    becomes AI; if the host itself leaves, the game stops.
  - Spectators see every shot fly, but only the active shooter sees their own
    aim line.
  - GitHub Pages is HTTPS by default, which Supabase needs.
  - "Same Wi-Fi" mode needs networks that allow device-to-device traffic; some
    public/guest Wi-Fi blocks it ("client isolation").
  - The Supabase anon key is meant to be public; shipping it in the page is
    normal and safe for broadcast/presence (no database is touched).
