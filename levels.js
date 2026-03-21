const npcDialogs = {
  1: [ // Meadow
    "Did you know unicorns invented rainbows?",
    "I once caught a fish THIS big! Well, maybe this big...",
    "Meow! I mean... neigh? I'm confused about what I am!",
    "Why did the unicorn cross the road? To get to the sparkle side!",
    "My horn gets great WiFi reception!",
    "This meadow grass is SO soft! *rolls around*",
    "I dreamed I was a regular cat last night. Worst nightmare ever!",
    "Wanna see my yarn ball collection? It's legendary!",
    "The bees make the best honey here. Don't tell them I said that!",
    "I heard the windmill is actually a giant cat toy!",
    "Have you tried the bacon from that grill? *chef's kiss*",
    "Legend says the rainbow bridge leads somewhere magical!",
    "I like to sit by the pond and watch the fish. So relaxing!",
    "My whiskers are tingling — adventure is near!",
    "Some cats chase mice. I chase rainbows! Much more fun!",
    "I tried to teach a fish to play fetch. Didn't go well.",
    "The clouds here look like giant yarn balls!",
    "My horn changes color when I'm happy. It's ALWAYS changing!",
    "I keep finding glitter in my fur. Where does it come from?!",
    "The windmill makes the best whooshing sounds at night!",
    "Someone left a trail of yarn from the house to the pond!",
    "I saw a double rainbow yesterday. Double the magic!",
    "The grill smoke makes shapes! I saw a fish wearing a top hat!",
    "I tried to count all the flowers. Lost count at a billion.",
    "My secret hiding spot is behind the camper. Don't tell anyone!",
    "The bees and I have an arrangement. Honey for horn sparkles.",
    "I once napped so long a bird built a nest on my horn!",
    "Rumor has it there's a golden yarn ball hidden somewhere...",
    "The pond fish tell the BEST jokes. Mostly about water.",
    "Today's forecast: 100% chance of sparkles with a side of meow!",
    "I can hear the rainbow bridge humming from here!",
    "The meadow crickets sing me lullabies every night!",
    "I accidentally set the grill to 'extra crispy'. Twice.",
    "There's a secret passage in the windmill! ...Or maybe it's just a closet.",
    "The camper fridge has infinite fish. Don't question it.",
    "I tried to befriend a butterfly. It landed on my nose!",
    "My horn doubles as a nightlight. Very convenient!",
    "The honey here tastes like sunshine and happiness!",
    "I wrote a poem about yarn. It goes: yarn yarn yarn yarn yarn.",
    "Fun fact: unicorn cats can purr AND whinny at the same time!",
    "The stars look different from every spot in the meadow!",
    "I've been practicing my rainbow bridge parkour moves!",
    "The fireflies and I have a light show competition every evening!",
    "Legend says if you collect enough yarn, you can knit a cloud!",
    "My favorite thing about the meadow? Everything. All of it.",
    "A meadow lark just sang my favorite song! ...I think it was about worms.",
    "The dandelions here are so fluffy! I made a wish on every single one.",
    "Did you know clover comes in FOUR leaf varieties? I found seven!",
    "The frogs in the pond have a choir. They're a little pitchy but I love them.",
    "I rolled down the hill and got covered in flower petals. Best day!",
    "The camper has a tiny kitchen! I made fish tacos. Don't judge.",
    "That robin keeps following me. I think it likes my sparkles!",
    "The morning dew makes the grass look like it's covered in tiny diamonds!",
    "I tried to chase my own tail in the tall grass. Got dizzy. Worth it.",
    "The beehive is like a tiny golden castle! The bees are the knights!",
    "I found a ladybug on my horn! She's my co-pilot now.",
    "The pond has exactly 47 fish. I counted. Three times.",
    "My favorite cloud today looks like a fish riding a bicycle!",
    "The meadow smells different every hour. Right now: honeysuckle and dreams!",
    "A groundhog popped up and we stared at each other for five whole minutes.",
    "The windmill blades cast the coolest shadow patterns in the afternoon!",
    "I tried to have a conversation with a mushroom. It was not very talkative.",
    "The sunset from the hill turns everything lavender. My horn approves!",
    "A bluebird landed on the fence and I swear it winked at me!",
    "The camper has a little awning and I nap under it when it drizzles!",
    "I saw a fox! We had a very polite standoff. Then it left. I think I won.",
    "The hay bales are the BEST for hide and seek. Nobody can find me!",
    "I keep a dream journal. Last night: flying over a river of honey!",
    "The wildflowers attract so many butterflies! It's like a fairy parade!",
    "The pond water reflects the clouds perfectly. It's like a sky mirror!",
    "I tried to whistle with the wind. Now we duet every afternoon!",
    "That old oak tree has been here forever. I bet it has STORIES!",
    "The moonrise over the meadow is almost as magical as me. Almost!",
    "A dragonfly just hovered in front of my nose! Tiny helicopter friend!",
    "The morning fog makes everything look mysterious. I feel like a detective!",
    "I found a perfectly round pebble. It's my new good luck charm!",
    "The creek that feeds the pond has the prettiest little waterfall!",
    "A family of quail just waddled past! The babies are SO tiny!",
    "The grill makes the whole meadow smell incredible at dinnertime!",
    "I built a tiny fort out of sticks near the pond. It's my summer home.",
    "The sunflowers turn to follow the sun! We have that in common — I follow sparkles!",
    "A barn owl lives in the windmill. We say hi every evening!",
    "The clover patches are like tiny green carpets. SO luxurious for paws!",
    "I swear the fish in the pond recognize me now. One of them waved a fin!",
    "The evening breeze carries the scent of lavender from over the hill!",
    "I tried to catch a firefly. It led me on the most magical chase!",
    "The dewdrops on spider webs look like tiny crystal necklaces!",
    "My favorite rock is by the pond. It's warm from the sun. Perfect nap spot.",
    "The cattails by the pond look like little hot dogs on sticks! Now I'm hungry.",
    "A red-tailed hawk circles above every morning. It's my alarm clock!",
    "The camper has the coziest little nook by the window!",
    "I planted a seed last week. Nothing yet but I'm being patient!",
    "The meadow looks different in every season. Right now is my favorite!",
    "A painted turtle is sunning itself on a log! Shell goals!",
    "The hummingbirds here are FASTER than me! And tinier! How?!",
    "I tried to make flower crowns for everyone. Mine keeps sliding off my horn.",
    "The night sky here has more stars than I have sparkles. That's a LOT.",
    "I saw a shooting star! I wished for more yarn. Obviously.",
    "The old stone wall has so many hiding spots for little critters!",
    "A monarch butterfly landed on my horn and stayed for ten whole minutes!",
    "The blackberries by the fence are ripe! My paws are permanently purple now.",
    "I can hear the distant train sometimes. It sounds like it's singing!",
    "The afternoon light turns the meadow into pure gold. Photography hour!",
    "I made a daisy chain so long it reaches from the house to the windmill!",
    "The bees are doing their waggle dance! It means they found good flowers!",
    "A chipmunk challenged me to a nut-gathering contest. I don't even eat nuts!",
    "The full moon makes the pond glow silver. Midnight swim anyone?",
    "I tried to teach the frogs to harmonize. We're getting there!",
    "The morning glories on the fence open at sunrise. Like tiny purple trumpets!",
    "A baby bunny is living under the porch! I named her Clover!",
    "The meadow grass makes the best whistling sounds when the wind blows just right!",
    "I hide treats in the knotholes of the old oak. My personal snack stations!",
    "The pond has water striders! They walk on water! I tried. I cannot.",
    "Every raindrop on my horn creates a tiny rainbow. Portable magic!",
    "The camper roof is the BEST stargazing platform. Bring a blanket!",
    "I found a fossil in the creek bed! It's a tiny ancient seashell!",
    "The cedar waxwings pass through every autumn. Most elegant birds ever!",
    "A woolly caterpillar predicted a mild winter. Good news for my fur!",
    "The meadow has exactly 12 different wildflower species. I'm a botanist now!",
    "I tried to organize a meadow parade. The animals weren't interested. Their loss!",
  ],
  2: [ // Sledding
    "Wheee! Watch out for the snowmen!",
    "My paws are cold but my heart is warm!",
    "I'm going so fast my ears are flapping!",
    "Snowball fight? Oh wait, we collect those!",
    "This hill goes on forever! I love it!",
    "I can't feel my whiskers and I don't care!",
    "Race you to the bottom! Oh wait, I can't steer!",
    "Did you know cats love snow? Okay maybe just unicorn cats!",
    "I just did a triple backflip! ...In my imagination!",
    "The snowmen look angry but I think they're just cold!",
    "My sled is powered by pure sparkle energy!",
    "I tried to make a snow angel but it came out as a snow cat!",
    "LOOK OUT FOR THAT— oh wait, you dodged it. Nice!",
    "The snow tastes like frozen rainbows up here!",
    "I'm leaving a glitter trail in the snow behind me!",
    "My horn is like an ice antenna! I can sense snowballs ahead!",
    "I saw a penguin! Wait... do they live here? WHO CARES!",
    "This is even better than sliding down a giant yarn ball!",
    "My tail is frozen in a permanent curl! ...It was already like that.",
    "I wonder if the snowmen are friendly. HI SNOWMAN! ...Nope.",
    "The train at the bottom better have a heater!",
    "Every snowflake is unique. Just like every unicorn cat!",
    "I'm collecting snowballs to build the world's biggest snowcat!",
    "Whoa, that tree came out of NOWHERE! They're sneaky!",
    "My whiskers are frozen into icicles! I look like a walrus!",
    "The snow sparkles like a billion tiny diamonds when the sun hits it!",
    "I tried to build an igloo at the top. Got distracted by the sledding.",
    "That snowman's carrot nose looks delicious. Don't judge me!",
    "My paw prints in the snow look like tiny hearts! How fitting!",
    "Snow is just clouds that fell asleep and landed down here!",
    "I challenged a snowman to a staring contest. I think I'm winning?",
    "The pine trees look like they're wearing big fluffy white hats!",
    "AAAGH A TREE— *dodges* —I meant to do that. Very graceful.",
    "My sled leaves a trail of sparkles! Best. Modification. Ever.",
    "I tried to catch a snowflake on my tongue. Caught forty-seven!",
    "The mountain echoes my 'WHEEE!' back to me! It's like I have a fan!",
    "These snowballs are the perfect size for juggling! Not that I CAN juggle...",
    "I bet the snowmen were built by the mountain goats. Nobody else is up here!",
    "My horn is glowing extra bright in the cold! Natural headlight!",
    "The ice crystals on the trees look like chandeliers! So fancy!",
    "I tried to make friends with an icicle. Short friendship. It dripped away.",
    "That was my fastest run yet! Or my most terrifying! Same thing!",
    "The wind up here sings! ...Or maybe that's just me screaming. Hard to tell.",
    "I saw a snow bunny! It's even fluffier than me! Is that possible?!",
    "My tail is an excellent rudder! ...In theory. Practice needs work.",
    "The snowball I'm collecting is almost bigger than me now!",
    "I can see the chalet from up here! WARM COCOA HERE I COME!",
    "The icicles on the trees make the most beautiful tinkling sounds!",
    "A snowflake landed on my nose and I went cross-eyed looking at it!",
    "Fun fact: fresh snow is 90% air! That explains why I sink in it!",
    "I saw a snowy owl! It looked SO wise. Then it flew into a tree.",
    "The best part about sledding? The hot chocolate AFTER sledding!",
    "My fur is so static-y from the cold! Everything I touch goes ZAP!",
    "I tried to make a snow-cat family. Dad, mom, and 47 kittens!",
    "The trees are playing dodge-kitty with me! ...I don't think I'm winning.",
    "Snow is nature's glitter! And I'm already covered in glitter! DOUBLE GLITTER!",
    "I lost my scarf somewhere on the slope. It's probably a snowman's now.",
    "The mountain air is so crisp! Every breath makes my whiskers tingle!",
    "I'm pretty sure I just broke the land speed record for unicorn cats!",
    "That tree branch had a perfect snow hat. Very fashion-forward, tree!",
    "My paws are making that satisfying CRUNCH sound in the snow! Love it!",
    "I bet from space you can see my glitter trail down this mountain!",
    "The northern lights would look AMAZING from up here. Wrong hemisphere though!",
    "I found a frozen stream! The ice is clear as glass! I can see fish sleeping!",
    "Snowboarding is next on my list. After I figure out this sledding thing.",
    "The fog at the bottom of the mountain looks like I'm sledding into clouds!",
    "I tried to name every tree I dodged. So far: Steve, Karen, Broccoli...",
    "My horn works as a snow plow! Very multifunctional in winter conditions!",
    "The mountain is so high the clouds are BELOW us! We're above the weather!",
    "I packed an emergency snack. It's a fish popsicle! Frozen naturally!",
    "Every time I hit a bump I do an involuntary meow! Meow! See?! Again!",
    "The snowdrifts are so deep I could disappear! ...That's not reassuring.",
    "I can see my breath! It looks like tiny clouds! I'm a cloud factory!",
    "This slope has personality. The personality of someone who wants me to crash.",
    "A ski patrol kitty just gave me a thumbs up! I'm basically professional!",
    "The powder snow puffs up like confetti when I whoosh through it!",
    "I drew a smiley face in the snow with my tail. Art!",
    "The run looks different every time! Or maybe I just can't remember. TREE!",
    "My ears are so cold they've gone full helicopter mode to keep warm!",
    "Someone built a snowman FAMILY! Mom, dad, and a tiny snow-kitten!",
    "I tried to calculate my speed but my brain froze. Literally.",
    "The setting sun turns the snow pink! Everything is rose-flavored now!",
    "I can hear sleigh bells somewhere! Or maybe that's my horn tinkling!",
    "My best time down the slope is... actually I don't have a watch. FAST though!",
    "The snow cushions every landing! Nature's bubble wrap!",
    "I made snow whiskers on a snowman. It's my self-portrait!",
    "The trees sway in the wind like they're cheering me on! GO ME!",
    "That was the wobbliest run yet! Points for style? Please?",
    "The mountain smells like pine and adventure! My two favorite scents!",
    "I'm going to tell stories about this run for ALL of my nine lives!",
    "The shadows on the snow make abstract art! I'm in a living gallery!",
    "My favorite snowball is perfectly round. I'm naming her Pearl!",
    "A red cardinal just flew alongside me! We raced! I think it won!",
    "The trail has little bumps that launch me! Unintentional air time!",
    "I heard the mountain whisper. It said: 'dodge left.' Good advice, mountain.",
    "The tracks in the snow tell a story! Mine says: panic, swerve, sparkle!",
    "Someone left ski tracks in a zigzag pattern. Challenge accepted!",
    "The sun makes my horn cast a rainbow on the snow! Moving light show!",
    "I'm going to miss this slope. Just kidding — I'll sled it again!",
    "The best crashes are the ones where you bounce right back up! BOUNCE!",
    "My sled and I have bonded. I've named her Glitter Express!",
    "The snow is so white it makes my sparkles look even more sparkly!",
    "I think that snowman just waved! ...No wait, its arm fell off. Oops.",
    "Halfway down! Or halfway up! Depends on your perspective!",
    "I tried to yodel while sledding. It came out as: MEYODELOWHWHWHW!",
    "The chalet chimney smoke means hot cocoa is being prepared! FASTER, SLED!",
    "Final stretch! Give me everything you've got, sparkle power!",
    "I can see the train! NYC here I come! ...After hot chocolate though.",
    "That was EPIC! Let's do it again! Wait, there's only one hill? NOOO!",
    "The snowflakes are applauding me! Or just falling. But I choose applause!",
    "Best sledding run of my LIFE! And I've had nine of them! Lives, not runs!",
    "The finish line should have confetti! Oh wait, it's snowing. Close enough!",
    "I left a trail of sparkles, joy, and slightly terrified meows down that mountain!",
  ],
  3: [ // NYC
    "The pizza here is AMAZING! Even for a cat!",
    "I tried to hail a taxi but they kept driving past!",
    "Central Park is basically a giant cat playground!",
    "Hot dogs! Get your hot dogs! ...Can cats eat hot dogs?",
    "The buildings are so tall I can't see the top of my horn!",
    "I heard there's a secret cat society under the subway!",
    "Times Square has nothing on my sparkle power!",
    "This city never sleeps, and neither do cats! Perfect match!",
    "I saw a pigeon the size of a small dog. We're friends now.",
    "The fire escapes are basically cat jungle gyms!",
    "A taxi driver honked at me. I sparkled back. I won.",
    "I tried to order a pizza with extra glitter. They said no.",
    "The subway grates blow warm air. Perfect for fur drying!",
    "Central Park squirrels are SO dramatic. Love that energy.",
    "I found a $20 bill! Oh wait, it's just a napkin. Still cool.",
    "The street performers here are good, but have they seen ME dance?",
    "I tried busking with my horn. Made 47 cents and one button.",
    "The Empire State Building would look better with a horn on top.",
    "A hot dog vendor called me 'kid.' I'm a UNICORN CAT, sir.",
    "I saw my reflection in a skyscraper. Looking FABULOUS.",
    "The pigeons here have attitudes. I respect that.",
    "Someone's playing saxophone in the subway. My ears are in heaven!",
    "I tried to climb a fire escape. Made it up three floors!",
    "The pizza shop owner gives me extra cheese. Cat privilege!",
    "The Statue of Liberty is holding a torch! I hold a sparkle. We're basically twins.",
    "Did you know NYC has over 800 languages spoken? I only speak cat. And sparkle.",
    "The Brooklyn Bridge is so long! I walked halfway and took a nap.",
    "Central Park has 843 acres! That's a LOT of grass to roll in!",
    "There are more than 200 cat cafes in NYC! I tried to apply at ALL of them!",
    "The NYC subway runs 24/7. Just like my sparkle engine!",
    "I found a bodega cat! We bonded instantly. Professional respect.",
    "Grand Central Terminal's ceiling has painted stars! Almost as pretty as mine!",
    "Times Square has 238,000 lights! But can they change color? My horn can!",
    "The High Line is a park built on old train tracks! Cats LOVE trains!",
    "Broadway has been around since the 1700s! I could headline ANY show!",
    "NYC pizza is famous because of the WATER they use in the dough. Science!",
    "The Chrysler Building has eagle gargoyles on it! SO cool!",
    "I tried to count the yellow taxis. Lost count at 307. There are 13,000!",
    "Central Park was designed by the same people who designed... wait, who?",
    "The subway has a secret abandoned station! City Hall! I want IN!",
    "A pretzel vendor gave me a free pretzel! NYC is the BEST!",
    "The flatiron building looks like a giant slice of pizza! I'm so hungry!",
    "Coney Island has a roller coaster from 1927! The Cyclone! I'd ride it!",
    "The NYC library has TWO stone lions out front! Patience and Fortitude! Goals.",
    "Did you know there's a waterfall INSIDE Central Park? Nature in the city!",
    "The bodegas here are open 24 hours and they ALL have cats. My people!",
    "Wall Street has a charging bull statue! I charged back. We're even now.",
    "The steam rising from the manholes makes the city look SO mysterious!",
    "I heard there are alligators in the sewers. Urban legend! ...Probably!",
    "Central Park has a castle! Belvedere Castle! I deserve a castle.",
    "The NYC rats are fearless. One just walked right past me eating a bagel.",
    "I tried to take the Staten Island Ferry. It's FREE! Everything else here isn't!",
    "Rockefeller Center has the biggest Christmas tree every year! Horn-shaped, maybe?",
    "The Met Museum has over 2 million artworks! None of them are of ME. Yet.",
    "I saw a celebrity! I think! Everyone here looks famous!",
    "The Vessel at Hudson Yards has 154 flights of stairs! My legs are tired just looking!",
    "There's a whispering gallery at Grand Central! I whispered 'meow.' It echoed!",
    "NYC was the first capital of the United States! Before they moved. Rude.",
    "The Chelsea Market used to be a cookie factory! I can still smell the cookies!",
    "I found a jazz club in Greenwich Village! The saxophonist played to my sparkles!",
    "The Roosevelt Island tram is basically a gondola! With better views!",
    "There are over 1,700 parks in NYC! I've napped in... three so far.",
    "A food cart has the BEST falafel! I didn't know cats liked falafel but HERE WE ARE!",
    "The brownstones in Brooklyn have the prettiest stoops for sitting!",
    "I tried to fit through a subway turnstile. Technically I'm below fare height!",
    "Little Italy smells like heaven! Garlic bread and marinara and DREAMS!",
    "The NYC skyline at sunset looks like a crown! Fitting for a unicorn cat!",
    "Central Park Conservatory Garden has three different styles! I prefer 'cat nap.'",
    "I visited the 9/11 Memorial. The reflecting pools are so peaceful and beautiful.",
    "The Empire State Building changes colors every night! Just like my horn!",
    "SoHo has the best galleries! I left a paw print on one. Art contribution!",
    "I tried New York cheesecake. I now understand why people fight over it.",
    "There are over 26,000 restaurants in Manhattan alone! I need nine lives to try them all!",
    "The Oculus at WTC looks like a bird taking flight! Architecture is wild!",
    "I rode the B train express! Express means FAST! My whiskers are STILL vibrating!",
    "Chinatown's dumpling houses are incredible! Eight for a dollar! EIGHT!",
    "The NYC Public Library has 55 million items! Including, hopefully, a book about ME.",
    "Washington Square Park has the best people-watching! And cat-watching! I'M the cat!",
    "I saw a man walking ten dogs at once! He's living my dream! But with cats!",
    "The pizzeria said I'm their smallest customer ever. But their MOST enthusiastic!",
    "Broadway lights make my horn glow in six colors! I'm the 7th color of the rainbow!",
    "I found a rooftop garden in the East Village! Tomatoes growing IN the sky!",
    "The NYC Marathon goes through all five boroughs! I could do that! ...Maybe! ...No.",
    "A jazz quartet played outside the Met! My tail kept time! I have RHYTHM!",
    "The bagels here are boiled first! That's the secret! NYC water strikes again!",
    "I spent an hour watching the ice skaters at Rockefeller. I'd sparkle circles around them!",
    "Grand Central's clock is worth $20 million! My horn is worth... priceless. Obviously.",
    "I tried to see a show on Broadway. Standing room only! I stood on someone's hat!",
    "The food trucks here have cuisine from EVERY country! Today: Korean tacos! Tomorrow: the world!",
    "Central Park Zoo has penguins! They waddled at me! I waddled back! Friendship!",
    "The Whitney Museum has a terrace with AMAZING views! I posed for every tourist there.",
    "Graffiti is an art form here! Someone sprayed a cat mural! It looks like ME! ...ish.",
    "I left my heart in NYC! And also some fur. And a yarn ball. I'll be back for those.",
  ],
  4: [ // Rome
    "When in Rome, do as the cats do: nap in the sun!",
    "The gelato here is to die for! All 9 lives!",
    "I tried to drive a Fiat. Couldn't reach the pedals!",
    "The Pantheon has the best acoustics for meowing!",
    "Roman cats have it made — free food everywhere!",
    "I'm basically a gladiator. A very fluffy gladiator!",
    "They say all roads lead to Rome. I followed a yarn ball!",
    "The fountain water is surprisingly refreshing!",
    "I tried to have a staring contest with a Roman statue. I lost.",
    "The cobblestones are perfect for sharpening claws!",
    "I made friends with a pigeon at the Colosseum. Her name is Bianca.",
    "Gelato for breakfast, gelato for lunch, gelato for dinner. Living the dream!",
    "The Vespa drivers are wild! I feel right at home!",
    "I tried speaking Italian. 'Miao' is basically the same as 'meow'!",
    "The Roman columns make great scratching posts. Don't tell anyone.",
    "A tourist took my photo thinking I was a street performer!",
    "The sunset here turns my horn pure gold. Molto bello!",
    "I left paw prints in the ancient ruins. Future archaeologists will be confused.",
    "The fountain coins are SO tempting but I'm a good kitty!",
    "Roman cats get free passage everywhere. It's the law! Probably.",
    "I challenged a gladiator statue to a duel. Still waiting for a response.",
    "The Pantheon's hole in the ceiling is perfect for stargazing!",
    "I tried to order gelato in 9 flavors. One for each life!",
    "The Fiat is tiny but so am I. Perfect fit! ...Almost.",
    "Rome is 2,700 years old! That's like... a lot of cat naps!",
    "The Trevi Fountain uses 2,824,800 cubic feet of water! I could swim LAPS!",
    "Did you know the Colosseum could hold 50,000 spectators? That's a LOT of fans!",
    "The Pantheon's dome has no supports! It just... stays up! Like my tail!",
    "Roman cats live in the ruins of Largo di Torre Argentina. Cat colony royalty!",
    "There are over 2,000 fountains in Rome! I've drunk from... four. So far.",
    "The Spanish Steps have 135 steps! I counted. My paws confirm.",
    "Italy has more UNESCO World Heritage sites than ANY other country! Fancy!",
    "The Romans invented concrete! Without it, no buildings. No buildings, no windowsills for cats!",
    "Piazza Navona used to be a stadium! Now it's for gelato. Big improvement!",
    "A Vespa driver waved at me! I sparkled back! Italian friendliness!",
    "The Vatican is technically its own country INSIDE Rome! A country inside a city!",
    "Roman pizza is thin and crispy! Not like NYC pizza! Both are amazing though!",
    "I tried to throw a coin in the Trevi Fountain. My aim needs work.",
    "The catacombs go for MILES under the city! I'm not going down there. Nope.",
    "Italy invented espresso! No wonder everyone here is so energetic!",
    "The Mouth of Truth bites liars' hands! I put my paw in. Nothing happened! I'm honest!",
    "The stone pines here look like giant lollipops! Nature's sculptures!",
    "Ancient Romans had heated floors! HEATED FLOORS! I need to time-travel!",
    "Bernini's fountains are so detailed! Every water splash is art!",
    "Roman cats are protected by law! They can live wherever they want! My heroes!",
    "The Appian Way is one of the oldest roads ever! 2,300 years old! Still works!",
    "I ate supplì — fried rice balls with melted cheese inside! INSIDE!",
    "The pine tree lined avenues here are so elegant! Like a green cathedral!",
    "Michelangelo painted the Sistine Chapel ceiling lying on his BACK! My back hurts just thinking!",
    "I found a cat colony near the Colosseum! They treated me like royalty! As they should.",
    "The sunset from the Pincian Hill turns the whole city golden! Magical!",
    "Romans eat dinner at like 9 PM! That's past my bedtime! ...Just kidding, cats don't have bedtimes!",
    "There are wild parrots in Rome! Green ones! They escaped from a zoo decades ago!",
    "I tried bruschetta! The tomatoes are so RED! Like my horn when I'm excited!",
    "The old Roman aqueducts brought water from 57 miles away! Impressive plumbing!",
    "The Tiber River has an island called Isola Tiberina! It's shaped like a boat!",
    "I visited the Borghese Gallery! There's a sculpture of Apollo that looks like it could MOVE!",
    "Romans invented the calendar! July is named after Julius Caesar! Where's Sparkle-ember?",
    "The orange trees along the streets smell INCREDIBLE! Orange blossom perfume, naturally!",
    "I walked the Via dei Condotti! It's the fanciest shopping street! I window-shopped. Very fancy.",
    "Roman gladiators were basically the rock stars of ancient times! I'd be front row!",
    "There's a keyhole on Aventine Hill — you look through it and see St. Peter's dome PERFECTLY framed!",
    "Italian cats say 'miao' not 'meow.' Very sophisticated. I'm bilingual now!",
    "The Tiber River is green! Not pollution — just the reflections of all the trees!",
    "I tried tiramisù! It means 'pick me up'! And it DID! I'm FLYING! Metaphorically!",
    "Rome's nickname is 'The Eternal City.' I'm the Eternal Cat. We match!",
    "The umbrella pines drop pine nuts! Which means: pesto! Nature's recipe!",
    "I climbed to the top of St. Peter's dome! 551 steps! My paws are JELLY!",
    "The old Roman Forum used to be the center of the WORLD! Now cats nap there! Even better!",
    "I saw a street artist draw the Colosseum in chalk! In 20 minutes! I can barely draw a circle!",
    "The gelato flavors here include stracciatella, pistachio, and RICOTTA! Italy is wild!",
    "There's a pasta shape for every occasion! Today I feel very farfalle. Bow-tie energy!",
    "The Baths of Caracalla were ancient swimming pools! Romans had the right idea!",
    "I tried to ride a Vespa. My paws can't reach the handlebars. Tragic design flaw!",
    "The obelisk in Piazza del Popolo came from EGYPT! Romans were the original souvenir collectors!",
    "A street musician played the accordion and I danced! The crowd loved it! Or just me!",
    "The ivy on the old walls makes everything look like a fairy tale! Molto romantico!",
    "I ate cacio e pepe — just cheese and pepper pasta! Simple but INCREDIBLE!",
    "Rome wasn't built in a day and neither was my sparkle. Actually, mine was. Born fabulous!",
    "I pressed my nose against a bakery window! The pastries! The CORNETTI! Heaven!",
    "The cats of Rome have their own social media following! Move over, influencers!",
    "I napped in a sunbeam at the Forum. Best nap in 2,000 years of history!",
    "The wisteria blooming on Roman balconies is purple like my favorite sparkle!",
    "Arrivederci means 'until we meet again!' I'll be back, Roma! Save me some gelato!",
  ],
  5: [ // Hawaii
    "Aloha! That means hello AND goodbye! How efficient!",
    "I tried surfing — it's like riding a moving floor!",
    "Coconut milk is basically cat milk from a tree!",
    "The tiki torches make my horn glow extra sparkly!",
    "I put a flower on my ear. Do I look tropical enough?",
    "Beach naps are the BEST kind of naps!",
    "I buried a fish in the sand. Don't tell anyone!",
    "The ocean is like a giant bathtub! But salty!",
    "I tried to do the hula. My tail kept getting in the way!",
    "A sea turtle waved at me! Or maybe it was just swimming.",
    "The volcano rumbles but I think it's just hungry. Same, volcano.",
    "I built a sandcastle shaped like a giant yarn ball!",
    "The coconuts fall off the trees like nature's bowling balls!",
    "My fur gets so fluffy in the humidity! I'm a cotton ball!",
    "I tried to catch a wave. The wave caught ME instead.",
    "The tiki torch flames dance to a beat only they can hear!",
    "A crab tried to pinch my tail. BAD CRAB. We're cool now though.",
    "I found a pearl in a seashell! ...Oh wait, that's a pebble.",
    "The sunset here paints the sky in unicorn colors!",
    "I wore a coconut shell as a hat. Fashion icon!",
    "The fish here are SO colorful. I just want to be friends!",
    "Hawaiian pizza exists because a unicorn cat dreamed it. True story.",
    "The beach sand is warm between my paw beans!",
    "I tried to befriend the volcano. It's the strong, silent type.",
    "Hawaii is the only US state that grows coffee! Kona coffee is famous! I tried it. TOO AWAKE.",
    "The Hawaiian Islands were formed by volcanoes! The Big Island is still growing!",
    "Mauna Kea is taller than Everest if you measure from the ocean floor! Sneaky mountain!",
    "Hawaii has its own alphabet with only 12 letters! A, E, I, O, U, H, K, L, M, N, P, W!",
    "The state fish is the humuhumunukunukuapua'a! Try saying THAT three times fast!",
    "Sea turtles here are called 'honu' and they're sacred! I gave one a respectful nod.",
    "Spam musubi is a popular snack here! Rice, spam, seaweed! Surprisingly delicious!",
    "The Na Pali Coast has cliffs 4,000 feet high! Even I'M dizzy looking up!",
    "Hawaiian monks seals are one of the most endangered marine mammals! Only about 1,400 left!",
    "The Menehune are legendary little people who build things overnight! Like construction fairies!",
    "Plumeria flowers smell like paradise decided to become a perfume!",
    "The black sand beaches are made from volcanic lava! Hot topic! Get it? HOT? ...Okay.",
    "Surfing was invented here! Ancient Hawaiians called it 'he'e nalu' — wave sliding!",
    "The trade winds keep the temperature perfect ALL year! Nature's AC!",
    "I tried poi — mashed taro root! It's purple! MY COLOR! Destiny!",
    "Haleakalā means 'House of the Sun' — the crater is SO big it has its own weather!",
    "Rainbow eucalyptus trees have RAINBOW bark! The trees here match my vibe!",
    "I learned to say 'mahalo' — it means thank you! Mahalo for the yarn!",
    "The waves at Pipeline on the North Shore are 30 feet tall! I watched from VERY far away.",
    "Hawaiian green sea turtles can live to be 80! That's like... almost one cat life! In turtle years!",
    "Hula isn't just a dance — it's storytelling with your body! My story: sparkly cat loves yarn!",
    "The lava from Kilauea has added 500 acres of new land! Free real estate!",
    "I tried a shave ice from Matsumoto's! Li hing mui flavor! My tongue turned red!",
    "Hawaiian shirts were actually invented by Japanese immigrants in the 1930s! Fashion fusion!",
    "The Waimea Canyon is called the 'Grand Canyon of the Pacific!' It's SO colorful!",
    "There are no snakes in Hawaii! ZERO! Paradise confirmed!",
    "The mongoose was brought here to eat rats. But rats are nocturnal and mongooses aren't. Oops!",
    "I saw a nēnē — the Hawaiian state bird! They're endangered geese! Very distinguished!",
    "The Pacific Plate moves Hawaii northwest 3 inches every year! I'm moving and I can't even feel it!",
    "Poke bowls originated here! Raw fish, rice, and SO much flavor! *chef's kiss*",
    "The Merrie Monarch Festival celebrates hula every spring! I'd enter! Is there a cat division?",
    "Hawaiian coral reefs are home to over 7,000 species! It's a whole underwater city!",
    "I tried to play the ukulele! It's so tiny! Perfect for cat paws! 'Ukulele' means 'jumping flea'!",
    "The sunset from the top of Haleakalā is rated the most beautiful in the world! My horn agrees!",
    "Macadamia nuts grow on trees here! I cracked one with my horn! Don't try this at home!",
    "The old Hawaiian fishponds are still used today! Ancient engineering that WORKS!",
    "I visited a coffee farm! The beans dry in the sun! Then they become ENERGY JUICE!",
    "Hawaiian sea salt comes in different colors — red, black, pink! Fancy salt! For fancy cats!",
    "The Aloha spirit is a real law here! You HAVE to be kind! I was already! Extra credit!",
    "I stood at the exact spot where the Pacific Plate is creating new land! My paws: HISTORIC!",
    "The palm trees sway like they're dancing! I sway too! We're in sync!",
    "Night diving here means seeing manta rays! Their wingspan is up to 23 feet! MAJESTIC!",
    "King Kamehameha united all the Hawaiian Islands! Like me uniting cats and unicorns!",
    "I tried a malasada — Portuguese donut! No hole! Just pure dough joy! I ate three!",
    "The volcanic glass here is called Pele's tears! Named after the goddess! SO dramatic!",
    "Trade winds blow my ear fur in the most photogenic direction! Nature knows my angles!",
    "Hawaiian leis aren't just flowers — they can be shells, feathers, or even candy! I want a candy one!",
    "The Polynesian Voyaging Society sailed across the Pacific using ONLY stars! No GPS! Legends!",
    "I watched a sea turtle lay eggs on the beach at night! She covered them with sand! So careful!",
    "The coral here comes in every color! Pink, purple, orange! It's an underwater rainbow!",
    "I learned 'ohana' means family! And family means nobody gets left behind! ...Or without yarn!",
    "The volcanic soil makes everything grow like crazy! Bananas, papayas, mangoes! Fruit paradise!",
    "A spinner dolphin just did SEVEN spins in the air! Show-off! ...I'm impressed though.",
    "The beach has glass floats that wash up from Japanese fishing nets! Ocean treasure!",
    "Kauai gets 450 inches of rain a year! Good thing my sparkles are waterproof!",
    "I buried my paws in warm Punalu'u black sand! It tickles differently than regular sand!",
    "The mongoose here is always in a hurry! Running everywhere! Me too, buddy. Me too.",
    "Sunset paints Diamond Head in gold! It's like the mountain put on jewelry!",
    "I tried to learn the traditional 'oli' chant! My version: 'meeeoooowww!' Close enough!",
    "The waterfalls here fall into rainbow mist! LITERAL rainbow territory! I feel so at home!",
    "I'm taking the Aloha spirit with me everywhere! Mahalo, Hawaii! You're purrfect!",
  ],
  6: [ // Oriental NC
    "Welcome to the Sailing Capital of North Carolina!",
    "There are more boats here than people! How cool is that?",
    "The Neuse River is SO wide! I can barely see the other side!",
    "I tried to name all the sailboats in the harbor. Lost count at 200.",
    "The shrimp boats come in at sunset. It's SO beautiful!",
    "A pelican just swooped right past my horn! Rude. But impressive.",
    "The pine trees smell like Christmas AND the beach combined!",
    "I saw a dolphin! It did a flip! I tried to do one too. Don't ask.",
    "This town is named after a shipwreck. The USS Oriental! How dramatic!",
    "There are only 880 people here but 3000 boats. The boats outvoted everyone!",
    "The harbor is so calm — no waves at all! Perfect for napping on a dock.",
    "A crab just walked sideways across my path. We had a moment.",
    "I tried fishing off the dock. The fish here are HUGE!",
    "The sunset turns the whole river golden. My horn matched perfectly!",
    "I heard there's amazing stuff underwater around here. Wanna dive?",
    "The wooden docks creak in the best way. Very atmospheric!",
    "A seagull stole my shell! Well, I have more. Take THAT, seagull!",
    "The Intracoastal Waterway goes RIGHT through here! Fancy!",
    "I tried sailing once. The wind and I had... creative differences.",
    "The oysters here build their own little reef cities! Tiny architects!",
    "Every sunset here looks like a painting. My fur turns golden!",
    "A blue heron was standing so still I thought it was a statue!",
    "The boat masts look like a forest of metal trees at night!",
    "I made friends with a river otter this morning. Her name is Sandy.",
    "Oriental is called the smallest town in NC but it has the BIGGEST heart!",
    "The Neuse River is the widest river in the US at its mouth — 6 miles across!",
    "The town got its name when a sailor found the nameplate of the wrecked ship USS Oriental!",
    "Blue crabs are the local specialty! They have the most expressive little eyes!",
    "The Oriental Marina hosts sailboat races every weekend! I cheered so hard I lost my voice!",
    "The Pamlico Sound is right next door! It's the largest lagoon on the US East Coast!",
    "This area was home to the Tuscarora people long before the settlers arrived!",
    "The fishing here is legendary — red drum, flounder, speckled trout! I tried for a catfish. Get it?",
    "The Oriental Rotary Tarpon Tournament is a big deal! People come from everywhere!",
    "The Inner Banks of NC are quieter than the Outer Banks. I like quiet. More napping!",
    "The live oaks here are draped in Spanish moss! Like natural curtains!",
    "The town croaker contest is a thing! People CROAK like frogs! Competitively! I entered!",
    "Smith Creek runs through town and it's perfect for kayaking! Or tiny boat races!",
    "The Old Theater has been showing movies since the 1940s! Classic cinema!",
    "Osprey nests on the channel markers are MASSIVE! Those birds are serious architects!",
    "The Pamlico-Tar River is one of the longest rivers entirely within North Carolina!",
    "Sailing here is special because the Neuse is wide but shallow — tricky navigation!",
    "The Oriental School of Sailing teaches beginners! I aced the theory. Failed the practical.",
    "There's a dragon boat festival here! Teams race long boats with dragon heads! DRAGONS!",
    "The wild ponies of the nearby Outer Banks sometimes swim across! Free-range horses!",
    "The local seafood market has the freshest shrimp you'll ever taste! Caught TODAY!",
    "The loblolly pines here grow super tall because of the coastal soil! Tree giants!",
    "Oriental celebrates its founding with the Spirit of Christmas boat parade every December!",
    "The Neuse River dolphins are bottlenose dolphins! They hunt fish by slapping their tails!",
    "I watched a blue crab molting! It wiggled out of its old shell! Tiny Houdini!",
    "The local general store has been around forever! They sell everything from bait to candy!",
    "NC is the third-largest sweet potato producer! And oriental yams are a thing! Coincidence?",
    "The water here changes from fresh to salt depending on the tide and wind. Nature's cocktail!",
    "Bald eagles nest along the Neuse! I saw one fishing! Competition? No, respect!",
    "The old Fish House has the best hush puppies! Fried cornmeal balls! Cat approved!",
    "The Hodges Street Pier is THE place for sunset watching! Bring yarn and a friend!",
    "River herring still run up the tributaries every spring! Ancient fish traditions!",
    "The longleaf pine ecosystem here is one of the most endangered in the world! Important trees!",
    "Fiddler crabs have one giant claw! They wave it to impress other crabs! Same energy!",
    "The Oriental Cup Regatta brings sailors from all over the East Coast! So many sails!",
    "Ghost crabs come out at night on the nearby beaches! They're see-through! Spooky cute!",
    "The Neuse River estuary is a nursery for baby fish! Like a fishy daycare!",
    "The pelicans here dive-bomb for fish! STRAIGHT DOWN! I tried it. Don't try it.",
    "Local shrimpers use trawl nets! The fresh catch goes from boat to plate in HOURS!",
    "The morning fog on the river makes everything look like a dream! Especially me!",
    "Oriental has one of the highest concentrations of sailboats per capita in the COUNTRY!",
    "The wax myrtles along the shore smell so sweet! Colonial settlers used the berries for candles!",
    "Sea nettles sometimes visit the river in summer! Pretty jellyfish! Do NOT pet!",
    "The town dock is the social hub! Everyone gathers to watch boats and share fish stories!",
    "Cormorants sit on the pilings and spread their wings to dry! Like little bird yoga poses!",
    "The Maritime Museum in Beaufort is nearby! So much boat history! I napped through half of it!",
    "NC oysters are making a comeback thanks to reef restoration! Go oysters! Build those reefs!",
    "The river breeze keeps the bugs away in summer! Natural pest control! Thanks, Neuse!",
    "I saw a terrapin crossing the road! Diamondback terrapins are brackish water specialists!",
    "The fishing piers here have the best crabbing! Just tie a chicken leg to a string! Genius!",
    "The Pamlico Sound connects to the Atlantic through the Outer Banks inlets! Geography is cool!",
    "River otters slide down muddy banks for FUN! They're my spirit animal!",
    "The Neuse River got its name from the Neusiok people who lived along its banks!",
    "I tried to befriend a horseshoe crab! They're not actually crabs — they're related to spiders! WHAT!",
    "The sunsets here are famous because the river faces WEST! Perfect angle every evening!",
    "The Oriental farmers market has local honey, jam, and the best boiled peanuts!",
    "Skate egg cases wash up on shore! They're called 'mermaid's purses!' I collect them!",
    "The tidal creeks here are a maze! I got lost twice but found great fishing spots!",
    "Oriental's zip code is 28571! I memorized it! In case I need to mail myself here!",
    "The egrets here are snow-white! Standing in the marsh they look like little ghosts!",
    "Cedar Island National Wildlife Refuge is nearby! 14,000 acres of wild beauty!",
    "The clam rakers work at low tide! Digging for clams is basically treasure hunting!",
    "I asked a shrimp boat captain about the best catch spot. He winked and said 'everywhere!'",
    "The star-filled sky here rivals any planetarium! Zero light pollution! ALL the sparkle!",
    "I made a friendship bracelet out of marsh grass! Smells like adventure and low tide!",
  ],
  61: [ // Scuba diving mercats
    "Welcome to our underwater kingdom! I'm Coral — purr-lease enjoy your visit!",
    "The USS Oriental wreck is over there! It sank in 1862! Ancient history!",
    "My starfish hair clip? Thanks! I found it on the reef! Isn't it sparkly?",
    "We mercats protect these waters. Also we chase shiny things. Cat instincts!",
    "The seagrass meadows are our favorite napping spots! So swishy!",
    "I tried to befriend a crab but it pinched my tail! Some cats never learn!",
    "See those oyster reefs? Thousands of tiny creatures live in each one!",
    "My tail changes color in the moonlight. Tonight it'll be extra sparkly!",
    "We mercats can purr AND bubble at the same time! It's our superpower!",
    "A sea turtle just swam by! They're always so chill. Life goals!",
    "The seahorses here are my cousins! ...Sort of. We share the cat ears thing.",
    "I once rode a dolphin through the channel! Best. Day. Ever!",
    "The water here is where the river meets the sea — brackish and beautiful!",
    "My friend Bubbles collects pearls. She has 847. Yes, she counted.",
    "Watch for the jellyfish! They're pretty but they DON'T like cuddles!",
    "The shipwreck has a whole garden of sea life growing on it now!",
    "At night, the bioluminescence makes the water glow. Magical!",
    "I taught a school of fish to swim in the shape of a cat face! Took weeks.",
    "The USS Oriental was a Civil War era steamship! Union troops sailed it!",
    "Hermit crabs here trade shells! It's like a tiny underwater flea market!",
    "The seagrass produces oxygen! It's like an underwater forest!",
    "Blue crabs swim using their back legs like little paddles! Adorable AND efficient!",
    "The barnacles on the wreck are like little apartment buildings! Tiny ocean condos!",
    "I can hold my breath for... well, I'm a mercat so... forever? Is that cheating?",
    "The stingrays here glide like underwater birds! So graceful! So flat!",
    "There's a sea cucumber down here that breathes through its butt! Nature is WILD!",
    "The shrimp here are see-through! You can see their tiny hearts beating! Aww!",
    "Octopuses change color to match anything! I tried. My horn just sparkled more.",
    "The sponges on the reef are ANIMALS, not plants! Mind blown! Bubbles everywhere!",
    "Flounder have both eyes on ONE side of their body! Fashion-forward or just weird?",
    "The mantis shrimp punches SO fast it creates tiny bubbles of PLASMA! Don't mess with them!",
    "Moon snails drill holes in other shells to eat them! Tiny horror movie! But also nature!",
    "I found a sand dollar! Down here they're purple and fuzzy! They're alive! Hi, sand dollar!",
    "The shipwreck creates an artificial reef — it gives homes to hundreds of species!",
    "Starfish can regenerate their arms! I wish I could regenerate yarn balls!",
    "The cleaner wrasses set up 'cleaning stations' where big fish line up! Fish car wash!",
    "Scallops have up to 200 EYES! And they swim by clapping their shells! SO dramatic!",
    "The parrotfish eat coral and poop SAND! Hawaii's white beaches? Fish poop! You're welcome!",
    "Sea cucumbers shoot their GUTS at predators! Most extreme defense ever!",
    "An eel just peeked out at me from the wreck! We had an awkward moment.",
    "The pressure down here makes my bubbles go BLOOP BLOOP BLOOP! Music to my ears!",
    "I found a bottle with a message! It says... 'buy more yarn.' Destiny!",
    "The coral polyps only open at night to feed! They're nocturnal like proper cats!",
    "Cuttlefish have THREE hearts! And blue blood! Royalty of the sea!",
    "The tiny skeleton shrimp on the seagrass look like underwater praying mantises! Fierce!",
    "A nautilus just floated by! Living fossils! They've been around 500 million years!",
    "The algae on the wreck creates oxygen bubbles that float up like tiny silver balloons!",
    "I collect sea glass from the bottom! Smoothed by the water! Nature's gems!",
    "The pistol shrimp snaps so fast it creates a SONIC BOOM underwater! Tiny but MIGHTY!",
    "Anemones look like flowers but they're animals! Their tentacles sting! Pretty but DANGEROUS!",
    "I saw a nudibranch — a sea slug in RAINBOW colors! Fashion icon of the reef!",
    "The wreck's anchor is still here after 160 years! Sturdy boat. Not sturdy enough!",
    "The tides bring new treasures every day! Yesterday: a sparkly rock! Today: a shell crown!",
    "Marina says the deepest part of the Neuse is 25 feet! That's like 15 mercats stacked up!",
    "I tried to race a barracuda. I don't want to talk about the results.",
    "Every full moon the worms come out to dance! Seriously! It's called a palolo worm swarm!",
    "The sand waves on the bottom look like tiny desert dunes! Underwater Sahara!",
    "I hide pearls in secret spots around the reef! Mercat treasure maps exist! I'll never tell!",
    "The shipwreck creaks when the current is strong! It's telling stories from 1862!",
    "Bubble coral looks like bubblegum! I tried to chew it. BAD idea! Not bubblegum!",
    "The pygmy seahorses here are smaller than my claw! They hide on fan corals! Master spies!",
    "At sunset the light filters down in golden beams! Underwater cathedral of sparkles!",
    "I'm friends with a lobster who lives in the wreck! His name is Clawde! Get it?!",
    "The plankton bloom makes the water glow green! It's like swimming in a lava lamp!",
    "I once found a Civil War button from the USS Oriental! A piece of history in my paws!",
    "The moray eel in the wreck always has its mouth open! It's not angry — that's how it breathes!",
    "Dolphins sometimes swim above us and their shadows look like clouds! Underwater weather!",
    "The water gets warmer near the wreck because the metal absorbs sunlight! Built-in heater!",
    "I taught the baby sea turtles the way to the surface! Every mercat's duty! Swim, babies, swim!",
    "The conch shells here make music when the current flows through them! Ocean symphony!",
    "I'm not lost — I'm exploring! There's a BIG difference! ...Which way is up again?",
  ],
  7: [ // Alps
    "These mountains make my horn look tiny!",
    "I'm basically a mountain goat with better style!",
    "Diamond hunting is my new favorite hobby!",
    "The chalet has the coziest fireplace!",
    "I tried yodeling but it just came out as meowing!",
    "The snow up here sparkles almost as much as me!",
    "Watch out for the trees! They jump out at you!",
    "Hot chocolate after skiing is the best thing ever invented!",
    "I tried to ski backwards. Let's not talk about it.",
    "The pine trees smell SO good! Like Christmas times infinity!",
    "My horn makes a great ski pole. Multifunctional!",
    "I saw an eagle up here! We had a mutual respect moment.",
    "The diamonds in the snow catch the light like my sparkles!",
    "I carved my name in the snow: S-P-A-R-K-L-E. Then a tree hit me.",
    "The chalet hot chocolate has TINY marshmallows. Adorable!",
    "I made a snow unicorn. It's my new best friend!",
    "The mountain echo repeats my meows! Meow... meow... meow...",
    "Skiing is just falling with style. I'm very stylish!",
    "I found a diamond bigger than my paw! Score!",
    "The cornices are nature's ski jumps! WHEEE!",
    "A mountain goat challenged me to a climbing contest. I won. Barely.",
    "The view from up here makes my whiskers tingle!",
    "I tried to catch a snowflake on my horn. Caught twelve!",
    "The Alps sunset turns everything pink and purple. My colors!",
    "The Swiss Alps have over 48 peaks above 4,000 meters! That's a LOT of skiing!",
    "The Matterhorn is 4,478 meters tall! It's on the Toblerone chocolate bar! I checked!",
    "Switzerland has four official languages! German, French, Italian, and Romansh! I speak cat!",
    "Swiss chocolate was invented in 1819! That's over 200 years of deliciousness!",
    "Alpine ibex can climb nearly vertical cliffs! They make mountain goats look amateur!",
    "The St. Bernard rescue dogs carried brandy barrels! Or so the legend says! Good doggos!",
    "Swiss cheese has holes because of bacteria creating CO2 bubbles! Science makes snacks!",
    "The longest glacier in the Alps is the Aletsch — 23 km long! That's a BIG ice cube!",
    "Edelweiss flowers grow above the tree line! They're fuzzy and white like tiny stars!",
    "The Jungfrau railway goes INSIDE the mountain! Through a tunnel to the top! Engineering!",
    "Swiss cows wear bells so farmers can find them in fog! I want a sparkle bell!",
    "The Alpine chough — a bird that lives at 8,000 meters! Higher than any cat has ever napped!",
    "Fondue is the Swiss national dish! Melted cheese for dipping! I dipped my paw. No regrets!",
    "The Alps are 65 million years old! Made when Africa bumped into Europe! Geological drama!",
    "Swiss trains are famous for being ON TIME! Unlike me. I'm always fashionably late!",
    "The crystal clear Alpine lakes are that blue because of glacial minerals! Nature's filter!",
    "Alphorn music echoes across the valleys! They're 12 feet long! I tried to play one. Wheeze.",
    "The snow on Mont Blanc is 200 meters deep in places! That's a 600-foot deep freeze!",
    "Chamois — Alpine goat-antelopes — can jump 6 meters high! I can jump... less. Much less.",
    "The Glacier Express train ride takes 8 hours through 291 bridges! Scenic route goals!",
    "Swiss Army knives were invented in 1891! I wish my horn had that many tools!",
    "Raclette is melted cheese scraped onto potatoes! SCRAPED! ONTO! POTATOES! I'm in!",
    "The Eiger's North Face is one of the hardest climbs in the world! I'll admire from the chalet.",
    "Alpine meadows in summer are covered in wildflowers! But I prefer the snowy version!",
    "The wooden chalets here have been built the same way for 500 years! Tradition!",
    "Marmots whistle to warn each other of danger! I sparkle to warn of awesomeness!",
    "The Aurora Borealis is sometimes visible from the highest peaks! Northern lights AND sparkles!",
    "Swiss watchmaking is so precise they measure in millionths of a second! My nap timing? Not so much.",
    "Glacier water is so pure you can drink it right from the stream! Crystal clear refresh!",
    "The mountain huts (Berghütte) have blankets and hot soup for tired climbers! Cat-friendly? I hope!",
    "The Bernese Alps gave the Bernese Mountain Dog its name! Big fluffy friends!",
    "Rösti is the Swiss version of hash browns! Crispy potato perfection! My paws approve!",
    "The sound of cowbells in the morning is the Alpine alarm clock! Very gentle. Much pastoral!",
    "I tried to build a quinzhee (snow shelter)! It collapsed. The chalet is better.",
    "The Alpine flower gentian is SO blue! It looks like a piece of the sky fell down!",
    "Avalanche dogs are trained to find people in snow! I'd volunteer but I'd get distracted by sparkles!",
    "The glaciers have blue ice caves inside! Like frozen cathedrals! My horn glowed in there!",
    "Swiss neutrality means they've been peaceful since 1815! Over 200 years! I'm neutral about nothing!",
    "The cable cars here swing in the wind! It's like a ski lift carnival ride! WHEE then AAAH!",
    "I found a crystal in the rock! Quartz! It sparkles like a tiny horn! Collection: growing!",
    "The summit crosses on Alpine peaks are SO dramatic! I posed next to one. Instagram material!",
    "Fresh Alpine air is supposed to cure everything! I breathed deeply! Still a cat! But refreshed!",
    "The Via Ferrata climbing routes have metal rungs and cables! Indoor rock wall but OUTDOORS!",
    "I tried Swiss German: 'Grüezi!' It means hello! The locals smiled! Or laughed. Either way!",
    "The Lauterbrunnen valley has 72 waterfalls! SEVENTY-TWO! Each one more sparkly than the last!",
    "Mountain cheese aged in Alpine caves has the most amazing flavor! Sharp and nutty! Cat approved!",
    "I reached the summit! The view! The majesty! The... OH NO how do I get DOWN?!",
    "Fresh powder snow is my favorite surface! Each step goes POOF! Like walking on clouds!",
    "The après-ski hot chocolate in the chalet tastes like a warm hug in a mug! BEST. DRINK. EVER!",
    "The stars at this altitude are HUGE! Closer to the sky means closer to sparkle headquarters!",
    "I pressed my nose against the chalet window. The frost made a perfect nose print! Art!",
    "The mountain rescue helicopters are red! Like Rudolph's nose! But louder! Much louder!",
    "I spotted a lynx in the forest! We made eye contact! Cat-to-cat respect! Then it vanished!",
    "Swiss meringue melts on your tongue! Light as snowflakes! I ate seven. Or twelve. Who's counting?",
    "The echo off the glacier sounds like the mountain is SINGING! And it's singing MY name!",
    "I made a snow throne at the summit! Queen of the Alps! Accepting subjects now!",
    "The fondue pot is bubbling! The cheese is SWIRLING! My horn is tingling! Dinner time!",
  ],
  9: [ // Africa Safari
    "Welcome to the savanna! Watch out for rhinos!",
    "Did you know cheetahs can't roar? They meow! We have SO much in common!",
    "That elephant just winked at me. We're basically best friends now.",
    "The baobab trees look like they're growing upside down!",
    "I tried to outrun a cheetah. Spoiler: I did NOT.",
    "The giraffes up here have the BEST view of everything!",
    "I put on safari khaki but my horn still sparkles. Can't hide fabulous!",
    "A rhino charged at me! Turns out it just wanted to say hi. Aggressively.",
    "The sunset here turns the whole savanna into gold! My favorite color!",
    "I tried to take a selfie with an elephant. Its trunk photobombed me!",
    "The watering hole is like a community pool for all the animals!",
    "An antelope herd just ran past! They're SO graceful. I tripped watching.",
    "Safari tip: if a cheetah asks for yarn, GIVE IT THE YARN. Trust me.",
    "I made friends with a giraffe! It can see my sparkles from miles away!",
    "The tall grass tickles my belly! *giggles and rolls around*",
    "I heard the safari jeep has air conditioning. Luxury!",
    "The baobab fruit tastes like fizzy sherbet! Nature's candy!",
    "I tried to photograph a rhino but it charged the camera. Great action shot!",
    "The dust here gets in my fur but it makes me look rugged and adventurous!",
    "That cheetah keeps staring at my yarn ball. I think it's in love.",
    "An elephant used its trunk to give me a shower! Unexpected but refreshing!",
    "The stars in Africa are incredible. Even brighter than my horn!",
    "I tried to ride an antelope. It said no. The cheetah said maybe. Progress!",
    "Safari guide rule #1: never get between a unicorn cat and baobab fruit.",
    "The savanna breeze makes my mane flow majestically. I was born for this!",
    "I saw lion tracks! Or maybe big cat prints. Wait... am I a big cat?",
    "The acacia trees look like giant umbrellas! Nature's shade!",
    "Riding a cheetah is like riding a furry rocket! WHEEEEE!",
    "The elephants here have better memories than me. They remember ALL the yarn!",
    "I learned to say 'meow' in elephant. It's just a really loud trumpet sound.",
    "The safari jeep driver says I'm the first unicorn cat passenger. Celebrity!",
    "These animal tracks lead somewhere... probably to more yarn!",
    "I wore a pith helmet but it kept sliding off my horn. Design flaw!",
    "The antelope do parkour across the savanna. Respect!",
    "Elephants are the only animals that can't jump! But they don't need to — they're HUGE!",
    "The Serengeti means 'Endless Plains' in Maasai! And it IS endless! I've been walking for hours!",
    "Giraffes only sleep 30 minutes a day! In 5-minute naps! I sleep 16 hours! We're SO different!",
    "A hippo can outrun a human! And they're grumpy about it! Fastest angry animal!",
    "Termite mounds can be 30 feet tall! They're like tiny skyscrapers! For bugs! With air conditioning!",
    "The wildebeest migration is 1.5 million animals moving at once! Nature's biggest parade!",
    "Zebras have unique stripe patterns! Like fingerprints! I tried to read one. It says 'zoom zoom.'",
    "Ostriches can't fly but they run 45 mph! Trade-off accepted!",
    "The savanna has wet and dry seasons! Right now it's sparkle season! (That's every season for me.)",
    "Lions sleep up to 20 hours a day! They're basically big cats! Wait — they ARE big cats! My people!",
    "Baobab trees can live for 3,000 years! And store 30,000 gallons of water! Nature's water tower!",
    "Dung beetles roll poop into balls and navigate by the Milky Way! Gross but BRILLIANT!",
    "A group of flamingos is called a 'flamboyance'! Most accurate name in ALL of nature!",
    "The African Wild Dog has the highest hunting success rate of any predator — 80%! Impressive teamwork!",
    "Elephants communicate with sounds too low for us to hear! Infrasound! Secret elephant radio!",
    "Cheetahs use their tails as rudders when running! Like a furry steering wheel!",
    "The lilac-breasted roller is the most colorful bird here! Eight different colors! Competition!",
    "Oxpeckers ride on rhinos and eat their parasites! Free meal AND free taxi! Win-win!",
    "Weaver birds build the most elaborate nests! They hang like ornaments from branches!",
    "The secretary bird STOMPS snakes to death with its legs! Fashion AND self-defense!",
    "Meerkats post sentries who watch for predators! They take TURNS! Very organized!",
    "Honey badgers don't care about ANYTHING! They fight cobras! They raid beehives! Absolute legends!",
    "Pangolins roll into armor balls when scared! I curl into a sparkle ball! Same energy!",
    "African elephants have bigger ears than Asian elephants! Shaped like Africa! How meta!",
    "The fever tree got its name because people got malaria near them! It was the mosquitoes, not the tree!",
    "Hippos secrete a natural sunscreen that's red! They look like they're sweating blood! Nature is METAL!",
    "The savanna grasses can grow back after being burned! Fire-resistant! Tough little plants!",
    "A group of rhinos is called a 'crash'! Most accurate group name EVER!",
    "Warthogs run with their tails straight up! Like little hairy antennas! Hilarious every time!",
    "The African fish eagle's call is the 'Voice of Africa'! It screams freedom and fish!",
    "Crocodiles have been around for 200 million years! They saw DINOSAURS! Living fossils!",
    "Impala can jump 10 meters in a single bound! I can jump... well, high enough. Don't measure.",
    "The Maasai people can identify individual lions by their whisker patterns! CSI: Savanna!",
    "Elephants mourn their dead and revisit bones! They feel things so deeply! *wipes tear with paw*",
    "Spotted hyenas are actually more related to cats than dogs! Distant cousins! Hey, cuz!",
    "The Kori Bustard is the heaviest flying bird in Africa — 40 lbs! Barely airborne!",
    "Vervet monkeys have different alarm calls for different predators! Eagle call? Look UP! Leopard? RUN!",
    "The sausage tree has fruits that weigh 22 lbs and look like... well... sausages! Nature had fun.",
    "Leopards stash their prey in TREES! Up high where no one can steal it! Meal prep level: expert!",
    "The Nile crocodile can go a YEAR without eating! I can't go a HOUR! Different metabolisms!",
    "African sunset is SO fast! The sun just DROPS! 15 minutes from daylight to stars! Speed run!",
    "I tried to match the cheetah's chirp! It sounded like 'mrrp!' Close enough for jazz!",
    "The vultures circle overhead watching everything! Nature's surveillance team! A bit judgy though!",
    "Elephant calves suck their trunks like babies suck their thumbs! ADORABLE! My heart!",
    "This Jeep safari is the adventure of ALL my nine lives! Can we do it eight more times?",
    "I'm sketching every animal I see! My art style? Abstract sparkle impressionism!",
    "The Big Five are lion, leopard, rhino, elephant, and buffalo! I'm adding unicorn cat. Big SIX!",
    "The night sky here has the Southern Cross constellation! Navigating by stars! Like a pirate! Arr!",
    "I heard a hyena laugh! It wasn't at my joke! ...Or WAS it?!",
    "The red oat grass here turns golden in dry season! The whole savanna becomes treasure!",
    "A hornbill bird sealed itself inside a tree to nest! The male feeds her through a tiny hole! Devotion!",
    "The African sunset makes silhouettes of every acacia tree! Photography GOLD! *snap snap snap*",
  ],
  8: [ // Campground
    "Nothing beats the smell of a campfire!",
    "I saw Bigfoot over there... he seems friendly!",
    "S'mores are the best invention since yarn balls!",
    "This hammock is SO cozy! I could nap all day!",
    "Did you bring enough sticks? The fire pit needs fuel!",
    "I tried digging a pool with my paws. Bad idea!",
    "Bigfoot's chocolate milk recipe is top secret!",
    "The stars out here are amazing... almost as sparkly as me!",
    "I heard an owl last night. We had a great conversation!",
    "Camping tip: always keep your marshmallows safe from raccoons!",
    "Who needs a tent when you have a hammock and the stars?",
    "Bigfoot said I'm the first unicorn cat he's ever met!",
    "The campfire smoke rings look like tiny halos!",
    "I tried to toast a marshmallow with my horn. It... worked actually!",
    "Bigfoot taught me a secret handshake. It's very large.",
    "The fireflies here think my horn is one of them!",
    "I told a scary story around the campfire. Scared myself.",
    "The chocolate milk here has a hint of... Bigfoot magic?",
    "I found a four-leaf clover! Wait, that has five leaves. Even better!",
    "A raccoon tried to steal my s'more. I shared. I'm generous like that.",
    "The pine needles make the softest bed! After the hammock, obviously.",
    "Bigfoot can't whisper. His 'quiet voice' shakes the trees.",
    "I counted 847 stars last night. Then I fell asleep on 848.",
    "The pool water is perfect temperature. I may have used my horn to heat it.",
    "There's a leprechaun by the pool! He LOVES s'mores apparently.",
    "Bigfoot showed me his photo album. He's been everywhere!",
    "The campfire crackles sound like tiny applause for my sparkles!",
    "I saw my reflection in the pool and thought it was another unicorn cat!",
    "Camping rule #1: always bring more marshmallows than you think you need.",
    "The hammock sways in the breeze like a cozy cradle!",
    "Bigfoot's footprints are so big I can take a bath in one!",
    "I made friendship bracelets for everyone. Bigfoot's is ENORMOUS.",
    "The stars spell out 'SPARKLE' if you squint. Trust me.",
    "The owls here are super wise. One told me where to find extra sticks!",
    "I want to camp here forever. Can we? Please?",
    "Bigfoot can play the harmonica. Who knew?!",
    "The campfire sparks float up like tiny orange fireflies! They're competing with my horn!",
    "I tried to identify constellations. I found one shaped like a yarn ball! Officially named it!",
    "Bigfoot's favorite bedtime story is about a cat who discovered sparkles. Suspiciously familiar.",
    "The morning dew on the tent makes everything sparkle! Nature copied MY look!",
    "S'mores have three ingredients: graham cracker, chocolate, marshmallow. Perfect trinity!",
    "I heard coyotes howling! They sound like backup singers! I'm the lead vocalist!",
    "The fire pit stones are warm hours after the fire goes out! Nature's heating pads!",
    "Bigfoot collects pinecones. His collection fills an entire cave! Very organized!",
    "I tied a glow stick to my tail. Now I'm a walking nightlight! Safety AND sparkle!",
    "The crickets out here chirp faster when it's warm! They're tiny thermometers!",
    "A woodpecker woke me up at dawn! RAT-TAT-TAT! Rude but rhythmic!",
    "Bigfoot makes the BEST campfire coffee! His cup is the size of my head!",
    "I found a geode in the creek bed! Cracked it open! CRYSTALS INSIDE! Nature's surprise egg!",
    "The moss on the north side of trees is nature's compass! Or is that a myth? Testing...",
    "Bigfoot can stack stones so high without them falling! Like a furry Jenga master!",
    "The camper has a skylight! I watched a meteor shower from my bunk! Shooting sparkles!",
    "Poison ivy has three leaves! 'Leaves of three, let them be!' Wise camping wisdom!",
    "I roasted my marshmallow to PERFECT golden brown! Then dropped it. The ground got a treat.",
    "The old tree stump by the fire pit is the BEST drum! *tap tap tap* Jungle rhythm!",
    "Bigfoot showed me how to find water by following animal trails! Survival skills!",
    "The sunset through the pine trees makes striped shadows! Like nature's barcode!",
    "I made a leaf crown! It has oak, maple, and sparkle leaf! (I added the last one.)",
    "Catching fireflies in a jar makes a tiny lantern! Then I let them go! Freedom AND light!",
    "Bigfoot says the best camping food is whatever you cook yourself! My specialty: fish on a stick!",
    "The wildflowers near the campsite attract hummingbirds! They hover! Like tiny helicopters!",
    "I tried to whittle a cat figurine from a stick! It looks more like a potato. Art is subjective!",
    "The lake at dawn is perfectly still — like a mirror! I saw two sparkly cats! Oh wait, that's me!",
    "A beaver is building a dam downstream! That's serious engineering! Respect, beaver!",
    "The pine sap smells SO good! Sticky but fragrant! My paws are stuck together! Worth it!",
    "Bigfoot knows all the bird calls! He taught me three! I can say 'hawk,' 'owl,' and 'meow' in bird!",
    "The night sky out here has the Milky Way! A river of stars! I want to swim in it!",
    "I found a perfect skipping stone! It bounced SEVEN times on the lake! New personal record!",
    "There's a family of deer at the meadow edge! The fawn has SPOTS! Like me but different!",
    "Bigfoot's morning stretches shake the ground! My morning stretch shakes... my tail. Scale is relative.",
    "The campfire stories get better every night! Tonight's theme: the Legend of the Sparkle Horn!",
    "Acorns are everywhere! The squirrels are running a whole economy here! Supply and demand!",
    "I tried cloud-watching while lying in the hammock! Saw a fish, a castle, and BIGFOOT'S FACE!",
    "The mushrooms after rain pop up overnight! Like tiny umbrellas! Fairy furniture!",
    "Bigfoot's snore echoes through the entire forest! The trees vibrate! It's actually soothing!",
    "I learned to start a fire with flint! Okay, Bigfoot started it. But I SUPERVISED!",
    "The creek has crawdads! They're like tiny lobsters! We had a pinching contest! I lost!",
    "Camping under the stars with friends is the greatest treasure of all! ...After yarn. Obviously.",
    "The fog rolls in like a blanket every morning! The world disappears then REAPPEARS! Magic!",
    "I carved 'Sparkle was here' on a fallen log! Future campers will know greatness visited!",
    "Bigfoot makes dream catchers from willow branches! Mine catches dreams about sparkles! So... all of them!",
    "The old fire lookout tower has the BEST 360-degree view! I can see three states from up there!",
    "Trail mix is the perfect food! Nuts, raisins, chocolate, and... I added glitter. Don't tell.",
    "A porcupine walked through camp! Very slowly! Very pointy! We gave it the right of way!",
    "The sunset campfire songs are my favorite! Bigfoot plays guitar! His picks keep breaking though!",
    "I tried sleeping in a tree like a cat should. Fell out. The hammock is more my speed.",
    "The morning birdsong is nature's alarm clock! Much better than the woodpecker!",
    "Bigfoot draws nature sketches in his journal! His latest: a sparkly horn! Clearly inspired by moi!",
    "The pine cone forecast: open means dry weather, closed means rain! Nature's weather app!",
    "I built a fairy house out of bark, moss, and acorn caps! If fairies exist, they'll LOVE it!",
    "The campfire embers glow like tiny cities! Each one is a sparkle neighborhood!",
    "Bigfoot says we should leave the campsite better than we found it! I left extra sparkles!",
    "The tree frogs here are TINY! One sat on my horn! We were both thrilled!",
    "I want to come back every season! Spring flowers, summer sun, fall colors, winter snow! All sparkly!",
    "The last s'more of the night is always the best one! Or maybe that's just my chocolate-covered paws talking.",
    "Camping life lesson: the journey matters more than the destination! Unless the destination has yarn!",
  ],
  10: [ // Transatlantic Flight
    "Look at that ocean! It goes on forever!",
    "I saw a whale down there! Or maybe it was a really big fish...",
    "My wings — er, paws — are getting tired!",
    "Is that a pirate ship? No, just a cloud. Disappointing!",
    "The seagulls here are NOT friendly! Dodge dodge dodge!",
    "I can see the curvature of the Earth! Just kidding, it's flat... wait, no!",
    "Who put thunderstorms in our flight path?! Rude!",
    "That hurricane is spinning like a giant yarn ball!",
    "Flying through clouds feels like swimming through cotton candy!",
    "I think I see Florida! Or is that more ocean? Hard to tell up here.",
    "My fur is SO windswept right now. I look fabulous!",
    "The rubies up here are WAY shinier than yarn balls!",
    "Note to self: unicorn cats CAN fly. Sort of. With a plane.",
    "I wonder if fish can see us from down there...",
    "Altitude check: very high. Sparkle level: maximum!",
    "The sunset from up here is absolutely PURR-fect!",
  ],
};

// Fish in pond
let pondFish = [];
function spawnPondFish() {
  pondFish = [];
  const colors = ['#fb923c','#38bdf8','#4ade80','#f472b6'];
  for (let i = 0; i < 5; i++) {
    pondFish.push({
      x: POND.x + 40 + Math.random() * (POND.w - 80),
      y: GROUND_Y + 10 + Math.random() * (POND.depth - 30),
      vx: (Math.random() - 0.5) * 1.5,
      color: colors[i % colors.length],
      size: 14 + Math.random() * 8,
      wobble: Math.random() * Math.PI * 2
    });
  }
}
spawnPondFish();

// NPCs
const npcs = [];
const npcColors = ['#86efac','#c4b5fd','#fdba74','#7dd3fc'];
const npcAccessories = ['bow','scarf','glasses','flower'];
for (let i = 0; i < 4; i++) {
  npcs.push({
    x: 300 + i * 450 + Math.random() * 100,
    y: GROUND_Y,
    color: npcColors[i],
    accessory: npcAccessories[i],
    vx: (Math.random() - 0.5) * 1.2,
    walkFrame: 0, walkTimer: 0,
    facing: 1,
    idleTimer: Math.random() * 200
  });
}

// Platforms — staircase arrangement across the world
const platforms = [
  // Pond area platforms (left side)
  { x: 100, y: 340, w: 90 },
  { x: 240, y: 290, w: 80 },
  { x: 400, y: 250, w: 70 },
  // Middle area platforms
  { x: 700, y: 340, w: 100 },
  { x: 850, y: 280, w: 80 },
  { x: 980, y: 220, w: 90 },
  { x: 1100, y: 340, w: 80 },
  // Right side platforms
  { x: 1300, y: 320, w: 90 },
  { x: 1450, y: 260, w: 80 },
  { x: 1600, y: 200, w: 100 },
  // Far right original
  { x: 1850, y: 330, w: 90 },
  { x: 2000, y: 270, w: 80 },
  { x: 2150, y: 210, w: 90 },
  // Extended world platforms
  { x: 2500, y: 340, w: 100 },
  { x: 2680, y: 280, w: 80 },
  { x: 2850, y: 220, w: 90 },
  { x: 3100, y: 330, w: 80 },
  { x: 3280, y: 260, w: 90 },
  { x: 3500, y: 340, w: 100 },
  { x: 3650, y: 280, w: 80 },
  { x: 3820, y: 210, w: 90 },
  { x: 4050, y: 320, w: 80 },
  { x: 4200, y: 250, w: 90 },
  { x: 4400, y: 340, w: 100 },
  { x: 4550, y: 270, w: 80 },
];

// Yarn balls — placed on top of the higher platforms
const yarnColors = ['#fda4af','#c4b5fd','#a5f3fc','#fde68a','#bbf7d0','#fbcfe8','#ddd6fe'];
const yarnBalls = [];
for (const p of platforms) {
  if (p.y < 300) { // only on higher platforms
    yarnBalls.push({
      x: p.x + p.w / 2,
      y: p.y - 14,
      color: yarnColors[yarnBalls.length % yarnColors.length],
      collected: false,
      bobPhase: Math.random() * Math.PI * 2
    });
  }
}

// Background scenes — decorations that appear as you scroll right
const bgScenes = [
  // Camper RVs
  { type: 'rv', x: 800, color: '#fbbf24' },
  { type: 'rv', x: 2300, color: '#fb7185' },
  { type: 'rv', x: 3800, color: '#67e8f9' },
  // Cacti
  { type: 'cactus', x: 650, size: 1 },
  { type: 'cactus', x: 1200, size: 0.8 },
  { type: 'cactus', x: 2600, size: 1.2 },
  { type: 'cactus', x: 3400, size: 0.9 },
  { type: 'cactus', x: 4300, size: 1.1 },
  // Scene 1: Mushroom grove
  { type: 'mushroom', x: 1900, count: 4 },
  // Scene 2: Flower garden
  { type: 'flowers', x: 2450 },
  // Scene 3: Campfire with log seating
  { type: 'campfire', x: 2800 },
  // Scene 4: Windmill
  { type: 'windmill', x: 3200 },
  // Scene 5: Crystal cluster
  { type: 'crystals', x: 3600 },
  // Scene 6: Beehive in a tree
  { type: 'beehive', x: 4000 },
  // Scene 7: Waterfall rocks
  { type: 'waterfall', x: 4350 },
  // Scene 8: Rainbow bridge (portal to Level 2)
  { type: 'bridge', x: 4600 },
];

// ── Level 2: Sledding ──
const BRIDGE_PORTAL = { x: 4600, radius: 55 }; // rainbow bridge hitbox

const level2Sled = {
  worldW: SLED_WORLD_W,
  // Minimal platform set — terrain features along the slope (tests require at least 1)
  platforms: [
    { x: 500, y: Math.round(sledTerrainY(500)) - 20, w: 100 },
    { x: 2000, y: Math.round(sledTerrainY(2000)) - 20, w: 100 },
    { x: 3500, y: Math.round(sledTerrainY(3500)) - 20, w: 100 },
  ],
  yarnBalls: [],
  // Snowballs to collect
  snowballs: [],
  // Snowmen to dodge
  snowmen: [],
  // Background pine trees (decorative)
  pines: [],
};

// Generate yarn balls above terrain (tests require at least 1)
const sledYarnColors = ['#ef4444','#3b82f6','#22c55e','#eab308','#a855f7'];
for (let i = 0; i < 5; i++) {
  const yx = 600 + i * 900;
  level2Sled.yarnBalls.push({
    x: yx,
    y: sledTerrainY(yx) - 50,
    color: sledYarnColors[i % sledYarnColors.length],
    collected: false,
    bobPhase: Math.random() * Math.PI * 2
  });
}

// Generate snowballs along the terrain
for (let sx = 300; sx < SLED_WORLD_W - 300; sx += 150 + Math.random() * 120) {
  level2Sled.snowballs.push({
    x: sx,
    y: sledTerrainY(sx) - 35 - Math.random() * 25,
    collected: false,
    bobPhase: Math.random() * Math.PI * 2
  });
}

// Generate snowmen obstacles on the terrain
for (let smx = 500; smx < SLED_WORLD_W - 300; smx += 250 + Math.random() * 200) {
  level2Sled.snowmen.push({
    x: smx,
    y: sledTerrainY(smx),
    hit: false,
    size: 0.8 + Math.random() * 0.4
  });
}

// Background pine trees on the terrain
for (let px = 100; px < SLED_WORLD_W; px += 180 + Math.random() * 120) {
  level2Sled.pines.push({
    x: px,
    y: sledTerrainY(px),
    size: 0.7 + Math.random() * 0.5
  });
}

// Sledding NPCs — positioned on the terrain near the bottom of the hill
const sledNpcs = [];
const sledNpcColors = ['#bae6fd','#fda4af','#bbf7d0','#e9d5ff'];
const sledNpcAccessories = ['scarf','bow','glasses','flower'];
for (let i = 0; i < 4; i++) {
  const npcX = 600 + i * 1000 + Math.random() * 200;
  sledNpcs.push({
    x: npcX,
    y: sledTerrainY(npcX),
    color: sledNpcColors[i],
    accessory: sledNpcAccessories[i],
    vx: (Math.random() - 0.5) * 0.8,
    walkFrame: 0, walkTimer: 0,
    facing: 1,
    idleTimer: Math.random() * 200
  });
}

// ── Level 3: New York City ──

const level2 = {
  worldW: 4800,
  platforms: [
    // Fire escapes & ledges on buildings
    { x: 150, y: 340, w: 80 },
    { x: 350, y: 280, w: 90 },
    { x: 550, y: 330, w: 70 },
    { x: 700, y: 260, w: 80 },
    { x: 900, y: 340, w: 100 },
    { x: 1100, y: 290, w: 80 },
    { x: 1300, y: 230, w: 90 },
    { x: 1500, y: 340, w: 80 },
    { x: 1700, y: 280, w: 90 },
    { x: 1900, y: 220, w: 80 },
    { x: 2150, y: 340, w: 100 },
    { x: 2350, y: 270, w: 80 },
    { x: 2550, y: 210, w: 90 },
    { x: 2800, y: 330, w: 80 },
    { x: 3000, y: 260, w: 90 },
    { x: 3200, y: 340, w: 100 },
    { x: 3400, y: 280, w: 80 },
    { x: 3600, y: 220, w: 90 },
    { x: 3850, y: 340, w: 80 },
    { x: 4050, y: 270, w: 90 },
    { x: 4250, y: 210, w: 80 },
    { x: 4500, y: 340, w: 100 },
  ],
  yarnBalls: [],
  buildings: [
    // NYC skyline buildings: x, width, height, color, windows
    { x: 50, w: 120, h: 250, c: '#64748b', windows: true },
    { x: 200, w: 80, h: 180, c: '#78716c', windows: true },
    { x: 310, w: 100, h: 320, c: '#475569', windows: true, spire: true },
    { x: 450, w: 90, h: 200, c: '#6b7280', windows: true },
    { x: 580, w: 130, h: 280, c: '#57534e', windows: true },
    { x: 750, w: 70, h: 160, c: '#71717a', windows: true },
    { x: 860, w: 110, h: 340, c: '#44403c', windows: true, spire: true },
    { x: 1010, w: 90, h: 220, c: '#64748b', windows: true },
    { x: 1140, w: 120, h: 260, c: '#525252', windows: true },
    { x: 1300, w: 80, h: 190, c: '#78716c', windows: true },
    { x: 1420, w: 100, h: 300, c: '#475569', windows: true },
    { x: 1560, w: 110, h: 230, c: '#6b7280', windows: true },
    { x: 1710, w: 90, h: 350, c: '#44403c', windows: true, spire: true },
    { x: 1840, w: 120, h: 200, c: '#57534e', windows: true },
    { x: 2000, w: 80, h: 270, c: '#71717a', windows: true },
    { x: 2120, w: 130, h: 180, c: '#64748b', windows: true },
    { x: 2290, w: 100, h: 310, c: '#525252', windows: true, spire: true },
    { x: 2430, w: 90, h: 220, c: '#78716c', windows: true },
    { x: 2560, w: 110, h: 250, c: '#475569', windows: true },
    { x: 2710, w: 80, h: 190, c: '#6b7280', windows: true },
    { x: 2830, w: 120, h: 280, c: '#44403c', windows: true },
    { x: 2990, w: 100, h: 340, c: '#57534e', windows: true, spire: true },
    { x: 3130, w: 90, h: 210, c: '#71717a', windows: true },
    { x: 3260, w: 110, h: 260, c: '#64748b', windows: true },
    { x: 3410, w: 80, h: 300, c: '#525252', windows: true },
    { x: 3530, w: 120, h: 180, c: '#78716c', windows: true },
    { x: 3690, w: 100, h: 320, c: '#475569', windows: true, spire: true },
    { x: 3830, w: 90, h: 240, c: '#6b7280', windows: true },
    { x: 3960, w: 130, h: 200, c: '#44403c', windows: true },
    { x: 4130, w: 80, h: 280, c: '#57534e', windows: true },
    { x: 4250, w: 110, h: 350, c: '#525252', windows: true, spire: true },
    { x: 4400, w: 100, h: 220, c: '#71717a', windows: true },
  ],
  scenes: [
    // NYC-themed scenes
    { type: 'taxi', x: 300 },
    { type: 'taxi', x: 1200 },
    { type: 'taxi', x: 2400 },
    { type: 'taxi', x: 3600 },
    { type: 'hotdog_cart', x: 600 },
    { type: 'hotdog_cart', x: 2000 },
    { type: 'hotdog_cart', x: 3400 },
    { type: 'fire_hydrant', x: 180 },
    { type: 'fire_hydrant', x: 900 },
    { type: 'fire_hydrant', x: 1600 },
    { type: 'fire_hydrant', x: 2800 },
    { type: 'fire_hydrant', x: 4100 },
    { type: 'streetlamp', x: 400 },
    { type: 'streetlamp', x: 800 },
    { type: 'streetlamp', x: 1400 },
    { type: 'streetlamp', x: 1900 },
    { type: 'streetlamp', x: 2500 },
    { type: 'streetlamp', x: 3100 },
    { type: 'streetlamp', x: 3700 },
    { type: 'streetlamp', x: 4300 },
    { type: 'pizza_shop', x: 1000 },
    { type: 'central_park', x: 2200 },
    { type: 'statue_liberty', x: 4550 },
    { type: 'subway', x: 1700 },
    { type: 'hospital', x: 1800 },
    { type: 'fao_schwarz', x: 700 },
    { type: 'empire_state', x: 1500 },
    { type: 'thirty_rock', x: 2800 },
    { type: 'grand_central', x: 3200 },
    { type: 'met_museum', x: 3800 },
    { type: 'pigeon_flock', x: 500 },
    { type: 'pigeon_flock', x: 2600 },
    { type: 'pigeon_flock', x: 3800 },
  ],
};

// Init level 2 yarn balls on higher platforms
for (const p of level2.platforms) {
  if (p.y < 290) {
    level2.yarnBalls.push({
      x: p.x + p.w / 2,
      y: p.y - 14,
      color: yarnColors[level2.yarnBalls.length % yarnColors.length],
      collected: false,
      bobPhase: Math.random() * Math.PI * 2
    });
  }
}

// Level 2 NPCs
const nycNpcs = [];
const nycNpcColors = ['#fca5a5','#93c5fd','#d8b4fe','#fde68a'];
const nycNpcAccessories = ['glasses','scarf','bow','flower'];
for (let i = 0; i < 4; i++) {
  nycNpcs.push({
    x: 400 + i * 900 + Math.random() * 200,
    y: GROUND_Y,
    color: nycNpcColors[i],
    accessory: nycNpcAccessories[i],
    vx: (Math.random() - 0.5) * 1.5,
    walkFrame: 0, walkTimer: 0,
    facing: 1,
    idleTimer: Math.random() * 200
  });
}

// ── Level 3: Rome ──
const level3 = {
  worldW: 4800,
  platforms: [
    { x: 150, y: 340, w: 90 },
    { x: 350, y: 280, w: 80 },
    { x: 550, y: 220, w: 90 },
    { x: 750, y: 340, w: 100 },
    { x: 950, y: 270, w: 80 },
    { x: 1150, y: 210, w: 90 },
    { x: 1400, y: 330, w: 80 },
    { x: 1600, y: 260, w: 90 },
    { x: 1800, y: 340, w: 100 },
    { x: 2000, y: 280, w: 80 },
    { x: 2200, y: 220, w: 90 },
    { x: 2450, y: 340, w: 80 },
    { x: 2650, y: 270, w: 90 },
    { x: 2850, y: 210, w: 80 },
    { x: 3100, y: 330, w: 100 },
    { x: 3300, y: 260, w: 80 },
    { x: 3550, y: 340, w: 90 },
    { x: 3750, y: 280, w: 80 },
    { x: 3950, y: 220, w: 90 },
    { x: 4200, y: 340, w: 100 },
    { x: 4400, y: 270, w: 80 },
  ],
  yarnBalls: [],
  scenes: [
    { type: 'colosseum', x: 800 },
    { type: 'fountain', x: 1500 },
    { type: 'roman_column', x: 400 },
    { type: 'roman_column', x: 2000 },
    { type: 'roman_column', x: 3200 },
    { type: 'roman_column', x: 4000 },
    { type: 'gelato_cart', x: 1000 },
    { type: 'gelato_cart', x: 2800 },
    { type: 'vespa', x: 600 },
    { type: 'vespa', x: 1800 },
    { type: 'vespa', x: 3400 },
    { type: 'olive_tree', x: 300 },
    { type: 'olive_tree', x: 1200 },
    { type: 'olive_tree', x: 2400 },
    { type: 'olive_tree', x: 3600 },
    { type: 'olive_tree', x: 4400 },
    { type: 'pantheon', x: 2600 },
    { type: 'pasta_shop', x: 3800 },
    { type: 'leaning_tower', x: 3000 },
    { type: 'piazza', x: 4200 },
    { type: 'fiat', x: 4500 },
  ],
};

// Init level 3 yarn balls
for (const p of level3.platforms) {
  if (p.y < 280) {
    level3.yarnBalls.push({
      x: p.x + p.w / 2,
      y: p.y - 14,
      color: yarnColors[level3.yarnBalls.length % yarnColors.length],
      collected: false,
      bobPhase: Math.random() * Math.PI * 2
    });
  }
}

// Level 3 NPCs
const romeNpcs = [];
const romeNpcColors = ['#fca5a5','#bbf7d0','#ddd6fe','#fde68a'];
const romeNpcAccessories = ['bow','flower','glasses','scarf'];
for (let i = 0; i < 4; i++) {
  romeNpcs.push({
    x: 500 + i * 800 + Math.random() * 200,
    y: GROUND_Y,
    color: romeNpcColors[i],
    accessory: romeNpcAccessories[i],
    vx: (Math.random() - 0.5) * 1.2,
    walkFrame: 0, walkTimer: 0,
    facing: 1,
    idleTimer: Math.random() * 200
  });
}

// ── Level 4: Hawaii ──
const level4 = {
  worldW: 5200,
  platforms: [
    // Staircase clusters — each group has stepping stones close enough to jump between
    { x: 200, y: 360, w: 90 },
    { x: 350, y: 320, w: 70 },
    { x: 500, y: 280, w: 80 },
    { x: 650, y: 240, w: 70 },
    // Reset to ground level
    { x: 900, y: 370, w: 100 },
    { x: 1050, y: 330, w: 70 },
    { x: 1200, y: 290, w: 80 },
    { x: 1350, y: 250, w: 70 },
    // Another cluster
    { x: 1600, y: 360, w: 80 },
    { x: 1750, y: 320, w: 70 },
    { x: 1900, y: 280, w: 80 },
    { x: 2050, y: 240, w: 70 },
    // Reset
    { x: 2300, y: 370, w: 100 },
    { x: 2450, y: 330, w: 70 },
    { x: 2600, y: 290, w: 80 },
    { x: 2750, y: 250, w: 70 },
    // Another cluster
    { x: 3000, y: 360, w: 80 },
    { x: 3150, y: 320, w: 70 },
    { x: 3300, y: 280, w: 80 },
    { x: 3450, y: 240, w: 70 },
    // Final stretch
    { x: 3700, y: 370, w: 100 },
    { x: 3850, y: 330, w: 70 },
    { x: 4000, y: 290, w: 80 },
    { x: 4150, y: 250, w: 70 },
    { x: 4400, y: 360, w: 90 },
    { x: 4550, y: 320, w: 70 },
    { x: 4700, y: 280, w: 80 },
    { x: 4900, y: 370, w: 100 },
  ],
  yarnBalls: [],
  scenes: [
    { type: 'palm_tree', x: 200 },
    { type: 'palm_tree', x: 800 },
    { type: 'palm_tree', x: 1600 },
    { type: 'palm_tree', x: 2400 },
    { type: 'palm_tree', x: 3200 },
    { type: 'palm_tree', x: 4000 },
    { type: 'palm_tree', x: 4800 },
    { type: 'tiki_torch', x: 600 },
    { type: 'tiki_torch', x: 1400 },
    { type: 'tiki_torch', x: 2200 },
    { type: 'tiki_torch', x: 3000 },
    { type: 'tiki_torch', x: 3800 },
    { type: 'coconut_pile', x: 400 },
    { type: 'coconut_pile', x: 1200 },
    { type: 'coconut_pile', x: 2000 },
    { type: 'coconut_pile', x: 2800 },
    { type: 'coconut_pile', x: 3600 },
    { type: 'coconut_pile', x: 4400 },
    { type: 'volcano', x: 4600 },
    { type: 'beach_hut', x: 1000 },
    { type: 'beach_hut', x: 3400 },
    { type: 'surfboard', x: 1800 },
    { type: 'sea_turtle', x: 500 },
    { type: 'sea_turtle', x: 2600 },
    { type: 'sea_turtle', x: 4200 },
    { type: 'flower_lei', x: 300 },
    { type: 'flower_lei', x: 1900 },
    { type: 'flower_lei', x: 3500 },
    { type: 'airport', x: 4900 },
  ],
};
const AIRPORT_POS = { x: 4900 };

// Init level 4 yarn balls
for (const p of level4.platforms) {
  if (p.y < 280) {
    level4.yarnBalls.push({
      x: p.x + p.w / 2,
      y: p.y - 14,
      color: yarnColors[level4.yarnBalls.length % yarnColors.length],
      collected: false,
      bobPhase: Math.random() * Math.PI * 2
    });
  }
}

// Level 4 NPCs
const hawaiiNpcs = [];
const hawaiiNpcColors = ['#fda4af','#86efac','#c4b5fd','#fde68a'];
const hawaiiNpcAccessories = ['flower','bow','glasses','scarf'];
for (let i = 0; i < 4; i++) {
  hawaiiNpcs.push({
    x: 500 + i * 1000 + Math.random() * 200,
    y: GROUND_Y,
    color: hawaiiNpcColors[i],
    accessory: hawaiiNpcAccessories[i],
    vx: (Math.random() - 0.5) * 1.2,
    walkFrame: 0, walkTimer: 0,
    facing: 1,
    idleTimer: Math.random() * 200
  });
}

// ── Level 6: Oriental NC ──
const levelOriental = {
  worldW: ORIENTAL_WORLD_W,
  platforms: [
    // Dock area platforms
    { x: 150, y: 360, w: 90 },
    { x: 350, y: 320, w: 80 },
    { x: 550, y: 280, w: 70 },
    { x: 750, y: 240, w: 80 },
    // Marina section
    { x: 1000, y: 370, w: 100 },
    { x: 1200, y: 330, w: 70 },
    { x: 1400, y: 290, w: 80 },
    { x: 1600, y: 250, w: 70 },
    // Waterfront
    { x: 1850, y: 360, w: 80 },
    { x: 2050, y: 320, w: 70 },
    { x: 2250, y: 280, w: 80 },
    { x: 2450, y: 240, w: 70 },
    // Harbor
    { x: 2700, y: 370, w: 100 },
    { x: 2900, y: 330, w: 70 },
    { x: 3100, y: 290, w: 80 },
    { x: 3300, y: 250, w: 70 },
    // Pier area
    { x: 3550, y: 360, w: 80 },
    { x: 3750, y: 320, w: 70 },
    { x: 3950, y: 280, w: 80 },
    // Sailboat & dive area
    { x: 4150, y: 370, w: 100 },
    { x: 4400, y: 330, w: 80 },
    { x: 4600, y: 290, w: 70 },
    { x: 4800, y: 360, w: 90 },
    { x: 5000, y: 320, w: 80 },
  ],
  yarnBalls: [],
  scenes: [
    // Sailboats in harbor
    { type: 'sailboat_docked', x: 300 },
    { type: 'sailboat_docked', x: 900 },
    { type: 'sailboat_docked', x: 1800 },
    { type: 'sailboat_docked', x: 2600 },
    { type: 'sailboat_docked', x: 3400 },
    // Shrimp boats
    { type: 'shrimp_boat', x: 1500 },
    { type: 'shrimp_boat', x: 3000 },
    // Pine trees along shore
    { type: 'pine_tree', x: 200 },
    { type: 'pine_tree', x: 700 },
    { type: 'pine_tree', x: 1300 },
    { type: 'pine_tree', x: 2100 },
    { type: 'pine_tree', x: 2800 },
    { type: 'pine_tree', x: 3600 },
    { type: 'pine_tree', x: 4500 },
    // Wooden docks
    { type: 'dock', x: 500 },
    { type: 'dock', x: 1700 },
    { type: 'dock', x: 3200 },
    // Pelicans
    { type: 'pelican', x: 600 },
    { type: 'pelican', x: 2300 },
    { type: 'pelican', x: 4000 },
    // Shells to collect
    { type: 'shell', x: 400, collected: false },
    { type: 'shell', x: 1100, collected: false },
    { type: 'shell', x: 2000, collected: false },
    { type: 'shell', x: 3100, collected: false },
    { type: 'shell', x: 3800, collected: false },
    // Sailboat you can board
    { type: 'sailboat_ride', x: 4200 },
    // Dive spot marker
    { type: 'dive_buoy', x: 4800 },
    // Transition to Alps
    { type: 'oriental_dock_end', x: 5050 },
  ],
};

// Init Oriental yarn balls
for (const p of levelOriental.platforms) {
  if (p.y < 300) {
    levelOriental.yarnBalls.push({
      x: p.x + p.w / 2,
      y: p.y - 14,
      color: yarnColors[levelOriental.yarnBalls.length % yarnColors.length],
      collected: false,
      bobPhase: Math.random() * Math.PI * 2
    });
  }
}

// Oriental NPCs
const orientalNpcs = [];
const orientalNpcColors = ['#67e8f9','#fda4af','#d9f99d','#c4b5fd'];
const orientalNpcAccessories = ['scarf','flower','glasses','bow'];
for (let i = 0; i < 4; i++) {
  orientalNpcs.push({
    x: 500 + i * 1100 + Math.random() * 200,
    y: GROUND_Y,
    color: orientalNpcColors[i],
    accessory: orientalNpcAccessories[i],
    vx: (Math.random() - 0.5) * 1.0,
    walkFrame: 0, walkTimer: 0,
    facing: 1,
    idleTimer: Math.random() * 200
  });
}

const level5 = {
  worldW: 960, // FP view — no world scrolling
  // Cornices — jump ramps at specific z-distances down the mountain
  cornices: [
    { z: 400 },
    { z: 900 },
    { z: 1400 },
    { z: 2000 },
    { z: 2500 },
  ],
  // Trees to dodge (z = depth, lane = horizontal position -200 to 200)
  trees: [],
  // Diamonds to collect (z = depth, lane = horizontal, airOnly = only when jumping)
  diamonds: [],
};

// Generate trees — scattered down the mountain
for (let tz = 100; tz < 3000; tz += 40 + Math.random() * 60) {
  // Don't place trees near cornices
  let onCornice = false;
  for (const c of level5.cornices) {
    if (Math.abs(tz - c.z) < 60) { onCornice = true; break; }
  }
  if (!onCornice) {
    level5.trees.push({
      z: tz,
      lane: (Math.random() - 0.5) * 350, // -175 to 175
      size: 0.7 + Math.random() * 0.6,
      hit: false
    });
  }
}

// Generate diamonds — arcs above cornices (collected while airborne)
for (const c of level5.cornices) {
  for (let i = 0; i < 5; i++) {
    level5.diamonds.push({
      z: c.z + 20 + i * 15,
      lane: (i - 2) * 40, // spread across lanes
      collected: false,
      bobPhase: Math.random() * Math.PI * 2
    });
  }
}
// Ground-level diamonds between cornices
for (let dz = 200; dz < 2800; dz += 80 + Math.random() * 100) {
  let onCornice = false;
  for (const c of level5.cornices) {
    if (Math.abs(dz - c.z) < 80) { onCornice = true; break; }
  }
  if (!onCornice) {
    level5.diamonds.push({
      z: dz,
      lane: (Math.random() - 0.5) * 300,
      collected: false,
      bobPhase: Math.random() * Math.PI * 2
    });
  }
}

// Platforms array needed for test compatibility (reachability tests)
level5.platforms = [{ x: 100, y: 380, w: 100 }];
level5.yarnBalls = [];

// Level 5 NPCs (ski-themed kitties standing around)
const alpsNpcs = [];
const alpsNpcColors = ['#bae6fd','#fda4af','#d9f99d','#e9d5ff'];
const alpsNpcAccessories = ['scarf','bow','glasses','flower'];
for (let i = 0; i < 4; i++) {
  alpsNpcs.push({
    x: 500 + i * 1200 + Math.random() * 200,
    y: GROUND_Y,
    color: alpsNpcColors[i],
    accessory: alpsNpcAccessories[i],
    vx: (Math.random() - 0.5) * 0.8,
    walkFrame: 0, walkTimer: 0,
    facing: 1,
    idleTimer: Math.random() * 200
  });
}

const level6 = {
  worldW: CAMP_WORLD_W,
  platforms: [
    { x: 200, y: 340, w: 90 },
    { x: 450, y: 280, w: 80 },
    { x: 700, y: 220, w: 90 },
    { x: 950, y: 340, w: 100 },
    { x: 1250, y: 270, w: 80 },
    { x: 1500, y: 210, w: 90 },
    { x: 1750, y: 330, w: 80 },
    { x: 2050, y: 260, w: 90 },
    { x: 2300, y: 340, w: 100 },
    { x: 2550, y: 280, w: 80 },
    { x: 2800, y: 220, w: 90 },
    { x: 3100, y: 340, w: 80 },
    { x: 3350, y: 270, w: 90 },
    { x: 3600, y: 210, w: 80 },
    { x: 3900, y: 330, w: 100 },
    { x: 4150, y: 260, w: 80 },
    { x: 4400, y: 340, w: 90 },
    { x: 4700, y: 280, w: 80 },
  ],
  yarnBalls: [],
  sticksCollected: [], // track which stick piles have been collected
};

// Init campground yarn balls on higher platforms
for (const p of level6.platforms) {
  if (p.y < 300) {
    level6.yarnBalls.push({
      x: p.x + p.w / 2,
      y: p.y - 14,
      color: yarnColors[level6.yarnBalls.length % yarnColors.length],
      collected: false,
      bobPhase: Math.random() * Math.PI * 2
    });
  }
}

// Init stick collection tracking
for (let i = 0; i < STICK_POSITIONS.length; i++) {
  level6.sticksCollected.push(false);
}

// Campground NPCs
const campNpcs = [];
const campNpcColors = ['#86efac','#fda4af','#c4b5fd','#fde68a'];
const campNpcAccessories = ['scarf','bow','flower','glasses'];
for (let i = 0; i < 4; i++) {
  campNpcs.push({
    x: 600 + i * 1000 + Math.random() * 200,
    y: GROUND_Y,
    color: campNpcColors[i],
    accessory: campNpcAccessories[i],
    vx: (Math.random() - 0.5) * 1.0,
    walkFrame: 0, walkTimer: 0,
    facing: 1,
    idleTimer: Math.random() * 200
  });
}

// ── Level 8: Africa Safari ──
const SAFARI_WORLD_W = 5500;
const SAFARI_JEEP_POS = { x: 5200 };
const WATERING_HOLE_POS = { x: 2400, w: 300, depth: 60 };
const BAOBAB_POSITIONS = [500, 1600, 2900, 4200];
const CHEETAH_POS = { x: 3400 };
const ELEPHANT_POSITIONS = [800, 3800];
const RHINO_POSITIONS = [1200, 4600];
const ANTELOPE_POSITIONS = [600, 1800, 3000, 4400];
const GIRAFFE_POSITIONS = [1000, 2200, 3600];

// Cheetah dialogue when giving yarn
const CHEETAH_DIALOGUES = [
  "Hmm, yarn? I need more than that...",
  "Getting closer... but I need MORE yarn!",
  "Almost enough! Keep the yarn coming!",
  "One more ball of yarn and we have a deal!",
  "PURRRR! That's enough! Hop on, let's GO!"
];

const level7 = {
  worldW: SAFARI_WORLD_W,
  platforms: [
    // Scattered rock formations and ledges
    { x: 200, y: 360, w: 80 },
    { x: 400, y: 310, w: 70 },
    { x: 600, y: 260, w: 80 },
    { x: 850, y: 340, w: 90 },
    { x: 1050, y: 280, w: 70 },
    { x: 1250, y: 220, w: 80 },
    { x: 1500, y: 350, w: 90 },
    { x: 1700, y: 290, w: 70 },
    { x: 1900, y: 230, w: 80 },
    // Around watering hole
    { x: 2150, y: 340, w: 80 },
    { x: 2350, y: 270, w: 70 },
    { x: 2700, y: 340, w: 80 },
    { x: 2900, y: 280, w: 70 },
    // Cheetah area — some only reachable at cheetah speed
    { x: 3100, y: 350, w: 90 },
    { x: 3300, y: 290, w: 70 },
    { x: 3500, y: 230, w: 80 },
    { x: 3750, y: 340, w: 80 },
    { x: 3950, y: 270, w: 70 },
    // Speed-jump gaps (cheetah-only areas)
    { x: 4200, y: 310, w: 60 },
    { x: 4450, y: 260, w: 60 },
    { x: 4700, y: 210, w: 60 },
    // Final approach
    { x: 4900, y: 350, w: 90 },
    { x: 5100, y: 280, w: 80 },
  ],
  yarnBalls: [],
  scenes: [
    // Acacia trees (iconic silhouettes)
    { type: 'acacia_tree', x: 150 },
    { type: 'acacia_tree', x: 700 },
    { type: 'acacia_tree', x: 1300 },
    { type: 'acacia_tree', x: 1900 },
    { type: 'acacia_tree', x: 2800 },
    { type: 'acacia_tree', x: 3500 },
    { type: 'acacia_tree', x: 4100 },
    { type: 'acacia_tree', x: 4800 },
    // Baobab trees (fruit collection)
    { type: 'baobab_tree', x: 500 },
    { type: 'baobab_tree', x: 1600 },
    { type: 'baobab_tree', x: 2900 },
    { type: 'baobab_tree', x: 4200 },
    // Tall grass zones
    { type: 'tall_grass', x: 300, w: 150 },
    { type: 'tall_grass', x: 1400, w: 200 },
    { type: 'tall_grass', x: 2100, w: 150 },
    { type: 'tall_grass', x: 3200, w: 200 },
    { type: 'tall_grass', x: 4500, w: 150 },
    // Animals
    { type: 'elephant', x: 800 },
    { type: 'elephant', x: 3800 },
    { type: 'rhino', x: 1200 },
    { type: 'rhino', x: 4600 },
    { type: 'giraffe', x: 1000 },
    { type: 'giraffe', x: 2200 },
    { type: 'giraffe', x: 3600 },
    // Watering hole
    { type: 'watering_hole', x: 2400 },
    // Cheetah
    { type: 'cheetah', x: 3400 },
    // Safari jeep (exit)
    { type: 'safari_jeep', x: 5200 },
    // Rocks and boulders
    { type: 'safari_rock', x: 400 },
    { type: 'safari_rock', x: 1100 },
    { type: 'safari_rock', x: 2000 },
    { type: 'safari_rock', x: 3000 },
    { type: 'safari_rock', x: 4300 },
    // Animal tracks (lead to hidden yarn)
    { type: 'animal_tracks', x: 900 },
    { type: 'animal_tracks', x: 2600 },
    { type: 'animal_tracks', x: 4000 },
  ],
  // Antelope herds — run across screen periodically
  antelopes: [],
  // Rhino charge obstacles
  rhinos: [],
};

// Init antelope herd members
for (let i = 0; i < ANTELOPE_POSITIONS.length; i++) {
  level7.antelopes.push({
    x: ANTELOPE_POSITIONS[i],
    y: GROUND_Y,
    vx: 2 + Math.random() * 1.5,
    running: false,
    runTimer: 0,
    size: 0.8 + Math.random() * 0.4
  });
}

// Init rhino obstacles
for (let i = 0; i < RHINO_POSITIONS.length; i++) {
  level7.rhinos.push({
    x: RHINO_POSITIONS[i],
    y: GROUND_Y,
    charging: false,
    chargeVx: 0,
    chargeTimer: 0,
    cooldown: 0,
    hit: false
  });
}

// Init safari yarn balls on higher platforms
for (const p of level7.platforms) {
  if (p.y < 300) {
    level7.yarnBalls.push({
      x: p.x + p.w / 2,
      y: p.y - 14,
      color: yarnColors[level7.yarnBalls.length % yarnColors.length],
      collected: false,
      bobPhase: Math.random() * Math.PI * 2
    });
  }
}

// Safari NPCs (guide unicorn cats)
const safariNpcs = [];
const safariNpcColors = ['#fbbf24','#f97316','#a3e635','#fb923c'];
const safariNpcAccessories = ['glasses','scarf','bow','flower'];
for (let i = 0; i < 4; i++) {
  safariNpcs.push({
    x: 500 + i * 1200 + Math.random() * 200,
    y: GROUND_Y,
    color: safariNpcColors[i],
    accessory: safariNpcAccessories[i],
    vx: (Math.random() - 0.5) * 1.0,
    walkFrame: 0, walkTimer: 0,
    facing: 1,
    idleTimer: Math.random() * 200
  });
}

// ── Level 10: Transatlantic Flight ──
const FLIGHT_WORLD_W = 6000;
const FLIGHT_SPEED = 3.5; // auto-scroll speed

const level10Flight = {
  worldW: FLIGHT_WORLD_W,
  platforms: [], // empty — this is a flying level, no platforms needed
  yarnBalls: [], // will hold rubies (reusing yarnBalls system)
  seagulls: [], // obstacles
  storms: [], // thunderstorm obstacles
  hurricanes: [], // hurricane obstacles
  clouds: [], // translucent visual clouds
};

// Rubies (using yarnBalls array for compatibility) — at least 6
// Place them at interesting positions requiring skillful flying
// y values between 100-350 (screen space, player bounded)
const rubyPositions = [
  { x: 800, y: 200 }, { x: 1500, y: 300 }, { x: 2200, y: 150 },
  { x: 3000, y: 280 }, { x: 3800, y: 180 }, { x: 4500, y: 250 },
  { x: 5200, y: 160 },
];
for (const rp of rubyPositions) {
  level10Flight.yarnBalls.push({
    x: rp.x, y: rp.y,
    color: '#ef4444', // ruby red
    collected: false,
    bobPhase: Math.random() * Math.PI * 2
  });
}

// Seagulls — scattered obstacles
const seagullXPositions = [600, 1100, 1700, 2400, 2900, 3500, 4100, 4700, 5400];
for (const sx of seagullXPositions) {
  level10Flight.seagulls.push({
    x: sx,
    y: 150 + Math.random() * 200,
    wingPhase: Math.random() * Math.PI * 2,
    hit: false
  });
}

// Thunderstorms — larger, dangerous
const stormXPositions = [1300, 2600, 3900, 5000];
for (const sx of stormXPositions) {
  level10Flight.storms.push({
    x: sx, y: 100 + Math.random() * 150,
    w: 120, h: 80,
    flashTimer: Math.random() * 1000,
    hit: false
  });
}

// Hurricanes — swirling, dangerous
const hurricaneXPositions = [2000, 3300, 4600];
for (const hx of hurricaneXPositions) {
  level10Flight.hurricanes.push({
    x: hx, y: 180 + Math.random() * 120,
    radius: 50,
    rotation: Math.random() * Math.PI * 2,
    hit: false
  });
}

// Clouds — translucent, visual only
for (let i = 0; i < 15; i++) {
  level10Flight.clouds.push({
    x: 200 + Math.random() * (FLIGHT_WORLD_W - 400),
    y: 80 + Math.random() * 280,
    w: 80 + Math.random() * 60,
    speed: 0.3 + Math.random() * 0.5,
    alpha: 0.2 + Math.random() * 0.2
  });
}

// Flight NPCs (decorative — positioned within world bounds)
const flightNpcs = [];
const flightNpcColors = ['#93c5fd', '#c4b5fd', '#fcd34d', '#86efac'];
const flightNpcAccessories = ['bow', 'glasses', 'scarf', 'flower'];
for (let i = 0; i < 4; i++) {
  flightNpcs.push({
    x: 200 + i * 1400 + Math.random() * 200,
    y: GROUND_Y,
    color: flightNpcColors[i],
    accessory: flightNpcAccessories[i],
    vx: 0,
    walkFrame: 0, walkTimer: 0,
    facing: 1,
    idleTimer: Math.random() * 200
  });
}
level10Flight.npcs = flightNpcs;

npcDialogs[10] = [
  "Welcome aboard the transatlantic flight!",
  "Please fasten your seatbelts and enjoy the ride!",
  "The view from up here is absolutely magical!",
  "Did you know cats always land on their feet? Even at 30,000 feet!",
  "The in-flight snacks are fish-flavored. Of course!",
  "I can see the ocean from here! So many fish down there!",
  "First class has yarn ball pillows. So fancy!",
  "We'll be landing at Cape Canaveral soon!",
  "The clouds look like giant cotton balls. Must. Not. Pounce.",
  "Turbulence? That's just the plane purring!",
  "The pilot is a unicorn cat too. Best airline ever!",
  "I've been flying for hours and I still love it!",
  "Look! You can see the curvature of the Earth from here!",
  "The sunset at this altitude is breathtaking!",
  "Fun fact: this plane runs on rainbow fuel!",
  "We're serving complimentary glitter confetti in first class!",
  "I tried to open a window for fresh air. They said no.",
  "Next stop: SPACE! Well, almost. Cape Canaveral first!",
];

// ── Level 11: Cape Canaveral ──
const CAPE_WORLD_W = 5200;

// Rocket position (centerpiece of the level)
const ROCKET_POS = { x: 3800, y: GROUND_Y };
// Space suit area
const SPACE_SUIT_POS = { x: 2000 };
// NASA buildings
const NASA_BUILDING_POS = { x: 1200, w: 180 };

const level11Cape = {
  worldW: CAPE_WORLD_W,
  platforms: [
    { x: 300, y: 360, w: 90 },
    { x: 550, y: 310, w: 80 },
    { x: 900, y: 350, w: 100 },
    { x: 1400, y: 290, w: 85 },
    { x: 1700, y: 340, w: 95 },
    { x: 2300, y: 300, w: 80 },
    { x: 2700, y: 360, w: 90 },
    { x: 3100, y: 320, w: 85 },
    { x: 3500, y: 280, w: 90 },
    { x: 4200, y: 350, w: 100 },
    { x: 4600, y: 300, w: 80 },
  ],
  yarnBalls: [],
  npcs: [],
  scenes: [
    { type: 'palm_tree', x: 100 },
    { type: 'palm_tree', x: 500 },
    { type: 'palm_tree', x: 1800 },
    { type: 'palm_tree', x: 4400 },
    { type: 'nasa_building', x: NASA_BUILDING_POS.x },
    { type: 'rocket', x: ROCKET_POS.x },
    { type: 'space_suit', x: SPACE_SUIT_POS.x },
  ],
};

// Yarn balls on elevated platforms
for (const p of level11Cape.platforms) {
  if (p.y < 360) {
    level11Cape.yarnBalls.push({
      x: p.x + p.w / 2,
      y: p.y - 14,
      color: yarnColors[level11Cape.yarnBalls.length % yarnColors.length],
      collected: false,
      bobPhase: Math.random() * Math.PI * 2
    });
  }
}

// Cape NPCs
const capeNpcs = [];
const capeNpcColors = ['#f8fafc', '#93c5fd', '#fcd34d', '#a5b4fc'];
const capeNpcAccessories = ['glasses', 'scarf', 'bow', 'flower'];
for (let i = 0; i < 4; i++) {
  capeNpcs.push({
    x: 400 + i * 1100 + Math.random() * 200,
    y: GROUND_Y,
    color: capeNpcColors[i],
    accessory: capeNpcAccessories[i],
    vx: (Math.random() - 0.5) * 1.0,
    walkFrame: 0, walkTimer: 0,
    facing: 1,
    idleTimer: Math.random() * 200
  });
}
level11Cape.npcs = capeNpcs;

// ── Level 12: Space Flight ──
const SPACE_WORLD_W = 7000;
const SPACE_SPEED = 3.0; // slightly slower than flight for difficulty

const level12Space = {
  worldW: SPACE_WORLD_W,
  platforms: [], // flying level — no platforms
  yarnBalls: [], // will hold alien collectibles for data integrity
  aliens: [], // the actual alien data
  asteroids: [], // obstacles
};

// Aliens — collectible friendly creatures (at least 8)
const alienColors = ['#a78bfa', '#34d399', '#f472b6', '#60a5fa', '#fbbf24', '#f87171', '#2dd4bf', '#c084fc'];
const alienEmojis = ['\u{1F60A}', '\u{1F917}', '\u{1F44B}', '\u2728', '\u{1F31F}', '\u{1F4AB}', '\u{1F389}', '\u{1FA90}'];
for (let i = 0; i < 8; i++) {
  const ax = 600 + i * 750 + (((i * 137 + 42) % 200));
  const ay = 100 + (((i * 83 + 17) % 250));
  level12Space.aliens.push({
    x: ax, y: ay,
    color: alienColors[i],
    collected: false,
    bobPhase: ((i * 197 + 31) % 628) / 100,
    size: 10 + ((i * 53 + 7) % 5),
    emoji: alienEmojis[i]
  });
  // Also add to yarnBalls for test compatibility
  level12Space.yarnBalls.push({
    x: ax, y: ay,
    color: alienColors[i],
    collected: false,
    bobPhase: ((i * 197 + 31) % 628) / 100
  });
}

// Asteroids — various sizes
const asteroidData = [];
for (let i = 0; i < 25; i++) {
  asteroidData.push({
    x: 400 + i * 260 + ((i * 137 + 42) % 100),
    y: 60 + ((i * 83 + 17) % 320),
    radius: 10 + ((i * 53 + 7) % 25), // small to large
    rotation: ((i * 197 + 31) % 628) / 100,
    rotSpeed: ((i * 41 + 13) % 80 - 40) / 1000,
    hit: false,
    vertices: [] // for rocky appearance
  });
}
// Generate rocky vertices for each asteroid
for (const ast of asteroidData) {
  const numVerts = 7 + (Math.floor((ast.x * 3 + ast.y) % 4));
  for (let v = 0; v < numVerts; v++) {
    const angle = (v / numVerts) * Math.PI * 2;
    const r = ast.radius * (0.7 + ((v * 31 + ast.radius) % 30) / 100);
    ast.vertices.push({ angle, r });
  }
}
level12Space.asteroids = asteroidData;

// NPCs (decorative — for test compatibility)
const spaceNpcs = [];
const spaceNpcColors = ['#a78bfa', '#34d399', '#f472b6', '#60a5fa'];
const spaceNpcAccessories = ['bow', 'glasses', 'scarf', 'flower'];
for (let i = 0; i < 4; i++) {
  spaceNpcs.push({
    x: 300 + i * 1600 + ((i * 137 + 42) % 200),
    y: GROUND_Y,
    color: spaceNpcColors[i],
    accessory: spaceNpcAccessories[i],
    vx: 0,
    walkFrame: 0, walkTimer: 0,
    facing: 1,
    idleTimer: ((i * 197 + 31) % 200)
  });
}

npcDialogs[11] = [
  "Welcome to Cape Canaveral! Home of rockets and dreams!",
  "That rocket over there? She's going to the MOON, baby!",
  "I've been an engineer here for 20 years. Still get chills every launch!",
  "Did you know unicorn cats have natural space resistance? Probably!",
  "The space suit fitting room is over there. You'll look adorable in it!",
  "T-minus whenever we feel like it! That's how countdowns work, right?",
  "I saw a shooting star last night. Turned out it was a glitter trail!",
  "First time at the space center? Don't forget to fuel the rocket!",
  "The palm trees here have seen more launches than I can count!",
  "Houston, we have a problem... I can't decide which rocket is prettiest!",
  "Fun fact: the first cat in space was French! Félicette, 1963!",
  "Make sure to put on your space suit before boarding! Safety first!",
  "The countdown is the best part. 10... 9... 8... I get so excited!",
  "I once tried to ride a rocket. They said cats can't be astronauts. WRONG!",
  "The fuel smells like... adventure. And maybe a little like fish. Coincidence?",
  "If you see aliens up there, tell them we said meow!",
  "The launchpad was just repainted. Please don't scratch it. ...I know, it's tempting.",
  "Space: the final frontier. Also the best place to chase laser pointers!",
];

npcDialogs[12] = [
  "Wow, space is HUGE! And sparkly! Just like me!",
  "That asteroid almost hit us! This is better than a roller coaster!",
  "I can see my house from here! ...No I can't, we're in space.",
  "These friendly aliens are SO cute! We should take them to the Moon!",
  "Is it just me or is Earth getting smaller? Don't worry, it'll be fine!",
  "Zero gravity is AMAZING for my fur! So fluffy!",
  "I wonder if there's a yarn ball floating around in space somewhere...",
  "Space fact: there are more stars than grains of sand on all Earth's beaches!",
  "The Moon is getting bigger! Or are we getting smaller? Science is confusing!",
  "I just saw a shooting star! Oh wait, that was an asteroid. DODGE!",
  "Houston, we have a PURR-fect mission so far!",
  "That nebula looks like a giant ball of yarn! *dreamy sigh*",
  "Alien friends collected! They're coming to the Moon with us!",
  "My space helmet keeps fogging up from all my excited meowing!",
  "Earth looks like a blue marble from here. I want to bat it around!",
  "Space is like the world's biggest cat tree — infinite climbing room!",
];

// ── Level 13: Moon ──
const MOON_WORLD_W = 5500;

const level13Moon = {
  worldW: MOON_WORLD_W,
  platforms: [
    { x: 250, y: 360, w: 90 },
    { x: 550, y: 310, w: 85 },
    { x: 850, y: 350, w: 80 },
    { x: 1200, y: 280, w: 90 },
    { x: 1600, y: 340, w: 85 },
    { x: 2000, y: 300, w: 80 },
    { x: 2500, y: 360, w: 95 },
    { x: 3000, y: 290, w: 85 },
    { x: 3400, y: 340, w: 80 },
    { x: 3900, y: 310, w: 90 },
    { x: 4400, y: 350, w: 85 },
    { x: 4900, y: 280, w: 80 },
  ],
  yarnBalls: [],
  npcs: [],
  scenes: [
    { type: 'crater', x: 400, r: 30 },
    { type: 'crater', x: 1000, r: 45 },
    { type: 'crater', x: 1800, r: 25 },
    { type: 'crater', x: 2800, r: 50 },
    { type: 'crater', x: 3600, r: 35 },
    { type: 'crater', x: 4500, r: 40 },
    { type: 'rock', x: 300 },
    { type: 'rock', x: 1500 },
    { type: 'rock', x: 2300 },
    { type: 'rock', x: 3800 },
    { type: 'rock', x: 5000 },
    { type: 'smoothie_shop', x: 1400 },
    { type: 'topgolf', x: 3200 },
  ],
};

// Smoothie Shop position
const SMOOTHIE_SHOP_POS = { x: 1400, w: 120 };
// TopGolf position
const TOPGOLF_POS = { x: 3200, w: 140 };
// Apollo Landing Site — near end of Moon level, before the completion zone
const APOLLO_SITE_POS = { x: 4700, w: 100 };

// Moon yarn balls on elevated platforms
for (const p of level13Moon.platforms) {
  if (p.y < 350) {
    level13Moon.yarnBalls.push({
      x: p.x + p.w / 2,
      y: p.y - 14,
      color: yarnColors[level13Moon.yarnBalls.length % yarnColors.length],
      collected: false,
      bobPhase: Math.random() * Math.PI * 2
    });
  }
}

// Moon NPCs — mix of aliens and moon characters
const moonNpcs = [];
const moonNpcColors = ['#a78bfa', '#34d399', '#f472b6', '#e2e8f0', '#fbbf24'];
const moonNpcAccessories = ['bow', 'glasses', 'scarf', 'flower', 'bow'];
for (let i = 0; i < 5; i++) {
  moonNpcs.push({
    x: 300 + i * 1000 + Math.random() * 200,
    y: GROUND_Y,
    color: moonNpcColors[i],
    accessory: moonNpcAccessories[i],
    vx: (Math.random() - 0.5) * 0.8,
    walkFrame: 0, walkTimer: 0,
    facing: 1,
    idleTimer: Math.random() * 200
  });
}
level13Moon.npcs = moonNpcs;

npcDialogs[13] = [
  "Welcome to the Moon! The gravity here is out of this world!",
  "I've been living here for eons. The Earth-watching is spectacular!",
  "Try the smoothie shop! The dried space fruit is surprisingly delicious!",
  "TopGolf on the Moon is AMAZING! Balls fly so far in low gravity!",
  "We aliens have been waiting for you! Your cat friend is famous in space!",
  "The craters make great hot tubs. Don't tell anyone I said that.",
  "I came here for the cheese. Turns out the Moon isn't made of cheese. Disappointing!",
  "Low gravity is purr-fect for high jumps! Try bouncing around!",
  "The smoothies here are 75 points of pure deliciousness!",
  "That golf dome over there? Best views in the solar system while you putt!",
  "I miss Earth sometimes. Then I remember: no gravity, no rules!",
  "My alien friends and I have a book club. Currently reading 'The Cat in the Spacesuit'.",
  "Fun fact: you can jump 6 times higher on the Moon! Math is fun!",
  "The dust here gets EVERYWHERE. My fur will never be the same.",
  "Have you seen the Earth from here at night? It's like a giant nightlight!",
  "This is the final frontier! Well, this level anyway. You made it!",
  "I heard there's a secret smoothie recipe: moon dust + stardust + yarn fuzz!",
  "TopGolf pro tip: the far target is worth 50 points but REALLY hard to hit!",
  "The smoothie shop owner is an alien. Best barista in the galaxy!",
  "Congratulations on making it to the Moon! You're officially an astro-cat!",
];

// ── NPC Quiz Questions ──
// Triggered randomly (~33%) after dismissing an NPC speech bubble.
// Questions test comprehension of facts from npcDialogs above.
const npcQuizzes = {
  1: [ // Meadow
    { question: "How many wildflower species are in the meadow?", answers: ["5", "12", "30"], correct: 1 },
    { question: "What did the pond fish count come out to?", answers: ["12 fish", "100 fish", "47 fish"], correct: 2 },
    { question: "What does clover come in that was found here?", answers: ["Four leaf varieties", "Three colors", "Two sizes"], correct: 0 },
    { question: "What bird lives in the windmill?", answers: ["A robin", "A barn owl", "A blue jay"], correct: 1 },
    { question: "What do the bees' waggle dance mean?", answers: ["Danger is near", "They found good flowers", "It's going to rain"], correct: 1 },
  ],
  2: [ // Sledding
    { question: "What is fresh snow mostly made of?", answers: ["Ice crystals", "90% air", "Frozen rain"], correct: 1 },
    { question: "What treat is waiting at the bottom of the hill?", answers: ["Hot chocolate", "Warm cookies", "Soup"], correct: 0 },
    { question: "What frozen treat was packed as an emergency snack?", answers: ["Ice cream sandwich", "Fish popsicle", "Frozen yogurt"], correct: 1 },
    { question: "What did the snow angel come out as?", answers: ["A snow unicorn", "A snow cat", "A snow dog"], correct: 1 },
    { question: "How many snowflakes were caught on the tongue?", answers: ["Ten", "Twenty-three", "Forty-seven"], correct: 2 },
  ],
  3: [ // NYC
    { question: "How many acres is Central Park?", answers: ["200 acres", "843 acres", "1,500 acres"], correct: 1 },
    { question: "How many yellow taxis are there in NYC?", answers: ["5,000", "13,000", "25,000"], correct: 1 },
    { question: "Why is NYC pizza famous?", answers: ["The cheese", "The water in the dough", "The oven type"], correct: 1 },
    { question: "How many languages are spoken in NYC?", answers: ["Over 200", "Over 800", "Over 50"], correct: 1 },
    { question: "What was NYC before Washington DC?", answers: ["A small village", "The first US capital", "A Dutch colony"], correct: 1 },
  ],
  4: [ // Rome
    { question: "How old is Rome?", answers: ["500 years", "1,200 years", "2,700 years"], correct: 2 },
    { question: "How many spectators could the Colosseum hold?", answers: ["10,000", "50,000", "100,000"], correct: 1 },
    { question: "How many fountains are there in Rome?", answers: ["Over 500", "Over 2,000", "Over 5,000"], correct: 1 },
    { question: "How many steps do the Spanish Steps have?", answers: ["135", "200", "88"], correct: 0 },
    { question: "What did the Romans invent for building?", answers: ["Steel beams", "Glass windows", "Concrete"], correct: 2 },
  ],
  5: [ // Hawaii
    { question: "How many letters are in the Hawaiian alphabet?", answers: ["26", "18", "12"], correct: 2 },
    { question: "What is the Hawaiian state fish?", answers: ["Clownfish", "Humuhumunukunukuapua'a", "Mahi-mahi"], correct: 1 },
    { question: "Where was surfing invented?", answers: ["California", "Australia", "Hawaii"], correct: 2 },
    { question: "What does 'aloha' mean?", answers: ["Only hello", "Hello AND goodbye", "Thank you"], correct: 1 },
    { question: "Are there snakes in Hawaii?", answers: ["Yes, many", "Just a few", "Zero!"], correct: 2 },
  ],
  6: [ // Oriental NC
    { question: "What is Oriental called in North Carolina?", answers: ["Fishing Capital", "Sailing Capital", "Surfing Capital"], correct: 1 },
    { question: "How wide is the Neuse River at its mouth?", answers: ["1 mile", "6 miles", "12 miles"], correct: 1 },
    { question: "How did the town of Oriental get its name?", answers: ["Asian settlers", "A wrecked ship called USS Oriental", "A compass pointing east"], correct: 1 },
    { question: "What is the Pamlico Sound?", answers: ["A musical note", "Largest lagoon on US East Coast", "A type of whale call"], correct: 1 },
    { question: "What are horseshoe crabs actually related to?", answers: ["Lobsters", "Spiders", "Turtles"], correct: 1 },
  ],
};
