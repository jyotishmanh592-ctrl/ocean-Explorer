/* ============================================================
   DEPTHS UNKNOWN — script.js
   Shared JavaScript for all pages
   ============================================================ */

/* ──────────────────────────────────────────
   1. BUBBLE CANVAS ANIMATION
   Draws animated rising bubbles on a canvas
   that is fixed behind the whole page.
────────────────────────────────────────── */
(function initBubbles() {
  const canvas = document.getElementById('bubbleCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  // Resize canvas to full window
  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  // Bubble objects
  const bubbles = [];
  const COUNT = 55; // number of bubbles

  function randomBetween(a, b) { return a + Math.random() * (b - a); }

  // Create a single bubble with random properties
  function createBubble() {
    return {
      x:        randomBetween(0, canvas.width),
      y:        randomBetween(canvas.height, canvas.height * 1.5), // start below visible
      r:        randomBetween(2, 9),
      speed:    randomBetween(0.4, 1.4),
      opacity:  randomBetween(0.06, 0.28),
      wobble:   randomBetween(0, Math.PI * 2),       // phase offset for horizontal sway
      wobbleSpeed: randomBetween(0.008, 0.022),
      wobbleAmp:   randomBetween(0.5, 2.5),
    };
  }

  // Populate bubble array
  for (let i = 0; i < COUNT; i++) {
    const b = createBubble();
    b.y = randomBetween(0, canvas.height); // start spread out on first load
    bubbles.push(b);
  }

  // Main draw loop
  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    bubbles.forEach(b => {
      // Move bubble upward
      b.y -= b.speed;
      b.wobble += b.wobbleSpeed;
      const xOffset = Math.sin(b.wobble) * b.wobbleAmp;

      // Reset when bubble exits top
      if (b.y + b.r < 0) {
        Object.assign(b, createBubble());
        b.y = canvas.height + b.r;
      }

      // Draw circle outline (bubble style)
      ctx.beginPath();
      ctx.arc(b.x + xOffset, b.y, b.r, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(0, 220, 255, ${b.opacity})`;
      ctx.lineWidth = 1;
      ctx.stroke();

      // Inner highlight — tiny white glint
      ctx.beginPath();
      ctx.arc(b.x + xOffset - b.r * 0.3, b.y - b.r * 0.3, b.r * 0.22, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,255,255,${b.opacity * 0.7})`;
      ctx.fill();
    });

    requestAnimationFrame(draw);
  }

  draw();
})();


/* ──────────────────────────────────────────
   2. NAVBAR — shrink on scroll + mobile toggle
────────────────────────────────────────── */
(function initNavbar() {
  const navbar = document.querySelector('.navbar-du');
  if (!navbar) return;

  // Shrink navbar when user scrolls down
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });

  // Mobile hamburger toggle
  const toggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');
  if (toggle && navLinks) {
    toggle.addEventListener('click', () => {
      navLinks.classList.toggle('open');
    });

    // Close menu when a link is clicked
    navLinks.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => navLinks.classList.remove('open'));
    });
  }

  // Highlight active nav link based on current page
  const page = window.location.pathname.split('/').pop() || 'index.html';
  navbar.querySelectorAll('.nav-links a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === page || (page === '' && href === 'index.html')) {
      a.classList.add('active');
    }
  });
})();


/* ──────────────────────────────────────────
   3. SCROLL REVEAL
   Elements with class "reveal" fade in when
   they enter the viewport.
────────────────────────────────────────── */
(function initReveal() {
  const elements = document.querySelectorAll('.reveal');
  if (!elements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target); // only animate once
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  elements.forEach(el => observer.observe(el));
})();


/* ──────────────────────────────────────────
   4. CREATURE DATA
   Central data store for all creatures.
   Used on both Home and Animals pages.
────────────────────────────────────────── */
const CREATURES = [
  {
    id: 'giant-squid',
    name: 'Giant Squid',
    sci:  'Architeuthis dux',
    depth: '300 – 1,000 m',
    zone: 'Midnight Zone',
    img:  './giant-squid.jpeg',
    stats: { size: 'Up to 13 m', weight: 'Up to 275 kg', speed: 'Unknown' },
    diet: ['Deep-sea Fish','Other Squid','Crustaceans','Lanternfish'],
    about: 'The giant squid is one of the largest invertebrates on Earth. For centuries it existed only as legend — inspiring the mythical Kraken. It was not photographed alive in its natural habitat until 2004 and remains one of the ocean\'s most elusive animals.',
    fact: '<strong>Did you know?</strong> The giant squid has the largest eyes of any living animal — up to 30 cm in diameter — to detect the faint silhouettes of predators in near-total darkness.',
  },
  {
    id: 'anglerfish',
    name: 'Anglerfish',
    sci:  'Melanocetus johnsonii',
    depth: '200 – 2,000 m',
    zone: 'Midnight Zone',
    img:  './angler-fish.jpeg',
    stats: { size: 'Up to 20 cm (♀)', weight: 'Up to 110 g', speed: 'Slow ambush' },
    diet: ['Small Fish','Crustaceans','Squid','Worms'],
    about: 'The anglerfish is the deep ocean\'s most extraordinary ambush predator. Females carry a modified dorsal spine tipped with a bioluminescent lure that dangles in front of enormous jaws to attract prey in absolute darkness.',
    fact: '<strong>Did you know?</strong> Male anglerfish are 10× smaller than females. When a male finds a female, he permanently fuses to her body — their bloodstreams merge and he becomes a sperm-producing appendage for life.',
  },
  {
    id: 'goblin-shark',
    name: 'Goblin Shark',
    sci:  'Mitsukurina owstoni',
    depth: '270 – 1,300 m',
    zone: 'Twilight Zone',
    img:  './goblin-shark.jpeg',
    stats: { size: 'Up to 6 m', weight: 'Up to 210 kg', speed: '3 km/h' },
    diet: ['Fish','Squid','Crabs','Shrimp'],
    about: 'The goblin shark is a rare deep-sea shark and the only living representative of the ancient family Mitsukurinidae — a lineage 125 million years old. Its most distinctive feature is the long, flat snout packed with electroreceptors.',
    fact: '<strong>Did you know?</strong> The goblin shark\'s jaws can project outward to snap up prey — extending up to 9 cm beyond the snout in a slingshot motion too fast for the human eye to follow.',
  },
  {
    id: 'dumbo-octopus',
    name: 'Dumbo Octopus',
    sci:  'Grimpoteuthis spp.',
    depth: '3,000 – 4,000 m',
    zone: 'Abyssal Zone',
    img:  './dumbo.jpeg',
    stats: { size: 'Up to 1.8 m', weight: 'Up to 5.9 kg', speed: 'Slow glider' },
    diet: ['Worms','Bivalves','Copepods','Amphipods'],
    about: 'Named for the large ear-like fins that resemble Disney\'s Dumbo elephant, this umbrella octopus lives deeper than any other octopus species. It flaps its fins to manoeuvre and uses its webbed arms to pounce on prey.',
    fact: '<strong>Did you know?</strong> Dumbo octopuses swallow prey whole, unlike most octopuses that use their beak to tear food. Their digestive system is specially adapted for whole-prey consumption at crushing depths.',
  },
  {
    id: 'vampire-squid',
    name: 'Vampire Squid',
    sci:  'Vampyroteuthis infernalis',
    depth: '600 – 900 m',
    zone: 'Oxygen Minimum Zone',
    img:  './vempire.jpeg',
    stats: { size: 'Up to 30 cm', weight: '~200 g', speed: '2 body lengths/s' },
    diet: ['Marine Snow','Dead Zooplankton','Detritus','Faecal Pellets'],
    about: 'The vampire squid is a living fossil — the sole surviving member of its ancient order Vampyromorphida. Despite the terrifying name, it is a gentle filter feeder living in the oxygen minimum zone where few predators can survive.',
    fact: '<strong>Did you know?</strong> Unlike all other cephalopods, the vampire squid does not hunt live prey. It uses two long retractile filaments to collect drifting "marine snow" — dead organic matter falling from above.',
  },
  {
    id: 'colossal-squid',
    name: 'Colossal Squid',
    sci:  'Mesonychoteuthis hamiltoni',
    depth: '1,000 – 2,200 m',
    zone: 'Midnight Zone',
    img:  './colossol.jpeg',
    stats: { size: 'Up to 14 m', weight: 'Up to 750 kg', speed: 'Unknown' },
    diet: ['Patagonian Toothfish','Deep-sea Fish','Squid'],
    about: 'The colossal squid is the world\'s largest invertebrate by mass, surpassing even the giant squid in weight. Only a handful of specimens have ever been caught, and almost nothing is known about its behaviour in the wild.',
    fact: '<strong>Did you know?</strong> The colossal squid has rotating hooks on its tentacles instead of suckers — serrated, swivelling blades that can slash and tear prey, leaving distinctive circular wounds on sperm whales.',
  },
  {
    id: 'barreleye',
    name: 'Barreleye Fish',
    sci:  'Macropinna microstoma',
    depth: '400 – 800 m',
    zone: 'Twilight Zone',
    img:  './barreleye.jpeg',
    stats: { size: 'Up to 15 cm', weight: '~50 g', speed: 'Slow drifter' },
    diet: ['Siphonophores','Jellyfish tentacles','Small invertebrates'],
    about: 'The barreleye fish is one of the most bizarre animals in the ocean. Its transparent dome-shaped head is filled with fluid, giving it an extraordinary view of the water column above while the two green cylindrical organs inside are its actual eyes.',
    fact: '<strong>Did you know?</strong> The barreleye\'s tubular eyes can rotate inside its fluid-filled transparent head — pointing upward to spot prey silhouetted against faint surface light, then rotating forward to track and eat it.',
  },
  {
    id: 'fangtooth',
    name: 'Fangtooth Fish',
    sci:  'Anoplogaster cornuta',
    depth: '200 – 2,000 m',
    zone: 'Midnight Zone',
    img:  './fangtooth.jpeg',
    stats: { size: 'Up to 16 cm', weight: '~120 g', speed: 'Unknown' },
    diet: ['Small Fish','Squid','Shrimp','Crustaceans'],
    about: 'The fangtooth fish has the largest teeth of any ocean fish relative to its body size. Despite its terrifying appearance, it is only 16 cm long. Its enormous fangs are so large that it has evolved special sockets in its brain to accommodate them when its mouth closes.',
    fact: '<strong>Did you know?</strong> Juvenile fangtooth fish look completely different from adults — they have long head spines, a different colour, and were once classified as a separate species before scientists realised they were the same fish at different life stages.',
  },
];

/* ──────────────────────────────────────────
   5. CREATURE CARD RENDERER
   Builds HTML for a creature card.
   Used on both Home and Animals pages.
────────────────────────────────────────── */
function buildCreatureCard(c, showBtn) {
  return `
    <div class="creature-card h-100" data-id="${c.id}" role="button" tabindex="0" aria-label="Learn about ${c.name}">
      <div class="cc-img-wrap">
        <img class="cc-img" src="${c.img}" alt="${c.name}" loading="lazy"/>
      </div>
      <div class="cc-body">
        <div class="cc-depth">${c.depth}</div>
        <div class="cc-name">${c.name}</div>
        <div class="cc-sci">${c.sci}</div>
        ${showBtn ? `<span class="btn-cc">View Details →</span>` : ''}
      </div>
    </div>`;
}

/* ──────────────────────────────────────────
   6. MODAL — open with creature data
────────────────────────────────────────── */
function openCreatureModal(id) {
  const c = CREATURES.find(x => x.id === id);
  if (!c) return;

  // Populate modal fields
  document.getElementById('modalImg').src   = c.img;
  document.getElementById('modalImg').alt   = c.name;
  document.getElementById('modalName').textContent = c.name;
  document.getElementById('modalSci').textContent  = c.sci;
  document.getElementById('modalSize').textContent   = c.stats.size;
  document.getElementById('modalWeight').textContent = c.stats.weight;
  document.getElementById('modalDepth').textContent  = c.depth;
  document.getElementById('modalSpeed').textContent  = c.stats.speed;
  document.getElementById('modalAbout').innerHTML  = c.about;
  document.getElementById('modalFact').innerHTML   = c.fact;

  // Diet tags
  document.getElementById('modalDiet').innerHTML =
    c.diet.map(d => `<span class="dtag">${d}</span>`).join('');

  // Open Bootstrap modal
  const el = document.getElementById('creatureModal');
  if (el) {
    const m = bootstrap.Modal.getOrCreateInstance(el);
    m.show();
  }
}

/* ──────────────────────────────────────────
   7. CLOSE MODAL button
────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  const closeBtn = document.getElementById('modalClose');
  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      const el = document.getElementById('creatureModal');
      if (el) bootstrap.Modal.getOrCreateInstance(el).hide();
    });
  }
});

/* ──────────────────────────────────────────
   8. ANIMALS PAGE — render grid + search
────────────────────────────────────────── */
function initAnimalsPage() {
  const grid = document.getElementById('creaturesGrid');
  if (!grid) return;

  // Render all cards
  CREATURES.forEach(c => {
    const col = document.createElement('div');
    col.className = 'col animal-col';
    col.setAttribute('data-name', c.name.toLowerCase());
    col.setAttribute('data-zone', c.zone.toLowerCase());
    col.innerHTML = buildCreatureCard(c, true);
    grid.appendChild(col);
  });

  // Card click → modal
  grid.addEventListener('click', e => {
    const card = e.target.closest('.creature-card');
    if (card) openCreatureModal(card.dataset.id);
  });

  grid.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') {
      const card = e.target.closest('.creature-card');
      if (card) openCreatureModal(card.dataset.id);
    }
  });

  // Search filter
  const searchInput = document.getElementById('searchInput');
  const noResults   = document.getElementById('noResults');
  if (!searchInput) return;

  searchInput.addEventListener('input', () => {
    const q = searchInput.value.toLowerCase().trim();
    let visible = 0;

    document.querySelectorAll('.animal-col').forEach(col => {
      const name = col.dataset.name;
      const zone = col.dataset.zone;
      const match = name.includes(q) || zone.includes(q) || q === '';
      col.style.display = match ? '' : 'none';
      if (match) visible++;
    });

    if (noResults) noResults.style.display = visible === 0 ? 'block' : 'none';
  });
}

/* ──────────────────────────────────────────
   9. HOME PAGE — featured creature cards
────────────────────────────────────────── */
function initHomePage() {
  const grid = document.getElementById('featuredCreatures');
  if (!grid) return;

  // Show only first 6 creatures on home
  CREATURES.slice(0, 6).forEach(c => {
    const col = document.createElement('div');
    col.className = 'col reveal';
    col.innerHTML = buildCreatureCard(c, true);
    grid.appendChild(col);
  });

  // Re-trigger reveal observer for dynamically added elements
  const newEls = grid.querySelectorAll('.reveal');
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); } });
  }, { threshold: 0.1 });
  newEls.forEach(el => obs.observe(el));

  // Card click → modal
  grid.addEventListener('click', e => {
    const card = e.target.closest('.creature-card');
    if (card) openCreatureModal(card.dataset.id);
  });
}

/* ──────────────────────────────────────────
   10. RUN ON PAGE LOAD
────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initHomePage();
  initAnimalsPage();
});
