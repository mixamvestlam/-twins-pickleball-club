// Сборка статического сайта: `npm run build` → папка dist/ (RU на /, EN на /en/).
import { mkdirSync, writeFileSync, readFileSync, cpSync, rmSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { SITE, PRICES, LOCATIONS, SCHEDULE, PHOTOS, T } from './src/content.mjs';

const OUT = 'dist';
rmSync(OUT, { recursive: true, force: true });
mkdirSync(`${OUT}/en`, { recursive: true });
cpSync('public', OUT, { recursive: true });

const css = readFileSync('src/style.css', 'utf8');
const js = readFileSync('src/app.js', 'utf8');
const ver = createHash('sha1').update(css + js).digest('hex').slice(0, 8);
mkdirSync(`${OUT}/assets`, { recursive: true });
writeFileSync(`${OUT}/assets/style.css`, css);
writeFileSync(`${OUT}/assets/app.js`, js);

const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
// Неразрывные пробелы после коротких слов, чтобы предлоги не висели в конце строки
const nb = s => esc(s).replace(/(^|[\s(«“])([а-яёА-ЯЁa-zA-Z]{1,2}) (?=\S)/g, '$1$2&nbsp;').replace(/ (—|–) /g, '&nbsp;$1 ').replace(/(\d) (₸|м|m)\b/g, '$1&nbsp;$2');
const money = (n, lang) => lang === 'ru' ? String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '\u00A0') : String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
const EXT = '<svg class="ext" viewBox="0 0 12 12" aria-hidden="true"><path d="M3 9 9 3M4.5 3H9v4.5" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>';
const out = 'target="_blank" rel="noopener"';
const locById = Object.fromEntries(LOCATIONS.map(l => [l.id, l]));
const WINTER = LOCATIONS.filter(l => !l.seasonal);

function mapSvg(seed){
  // Условная схема: корты сверху и мяч-метка. Заменяется фотографией локации, когда она появится.
  const courts = [0, 1, 2, 3].map(i => {
    const x = 40 + i * 150 + (seed ? 30 : 0), y = seed ? 46 : 62;
    return `<g transform="translate(${x} ${y}) rotate(${seed ? -8 : 6})" fill="none" stroke="#fff" stroke-width="2.4" stroke-opacity=".9"><rect width="110" height="200" fill="#4A42E8"/><rect y="68" width="110" height="64" fill="rgba(184,244,79,.2)"/><path d="M0 100h110" stroke-width="3.4"/><path d="M55 0v68M55 132v68"/></g>`;
  }).join('');
  return `<svg viewBox="0 0 680 340" preserveAspectRatio="xMidYMid slice" aria-hidden="true">${courts}<g transform="translate(${seed ? 360 : 300} 150)"><circle r="46" fill="rgba(184,244,79,.22)"/><circle r="22" fill="#B8F44F"/><g fill="#7FAA2A"><circle cx="0" cy="-10" r="3.4"/><circle cx="-10" cy="2" r="3.4"/><circle cx="10" cy="2" r="3.4"/><circle cx="0" cy="12" r="3.2"/></g></g></svg>`;
}

function page(lang){
  const t = T[lang], P = n => money(n, lang);
  const url = SITE.url + t.path;
  const gmaps = l => `https://www.google.com/maps/search/?api=1&query=${l.gmapsQuery ? encodeURIComponent(l.gmapsQuery) : `${l.lat},${l.lon}`}`;
  const slotText = s => `${t.schedule.dayShort[s.day]} ${s.from}–${s.to}`;

  const ld = [
    { '@context': 'https://schema.org', '@type': 'SportsClub', '@id': SITE.url + '/#club', name: SITE.name, url, logo: SITE.url + '/img/logo.png', image: SITE.url + '/og.png',
      description: t.desc, telephone: SITE.phone, foundingDate: '2024-08', sport: 'Pickleball', priceRange: '₸₸', currenciesAccepted: 'KZT',
      areaServed: { '@type': 'City', name: 'Almaty' }, sameAs: [SITE.instagram, SITE.telegram],
      potentialAction: { '@type': 'ReserveAction', target: SITE.booking, name: t.hero.book } },
    ...LOCATIONS.map(l => ({ '@context': 'https://schema.org', '@type': 'SportsActivityLocation', name: `${SITE.name} — ${l.name}`, parentOrganization: { '@id': SITE.url + '/#club' }, url: url + '#locations', telephone: SITE.phone, image: SITE.url + '/og.png', priceRange: '₸₸',
      address: { '@type': 'PostalAddress', streetAddress: l.street[lang], addressLocality: lang === 'ru' ? 'Алматы' : 'Almaty', addressCountry: 'KZ' },
      ...(l.seasonal ? {} : { geo: { '@type': 'GeoCoordinates', latitude: l.lat, longitude: l.lon } }), hasMap: l.gis,
      amenityFeature: [{ '@type': 'LocationFeatureSpecification', name: 'Changing rooms', value: true }, { '@type': 'LocationFeatureSpecification', name: 'Pickleball courts', value: l.courts }],
      openingHoursSpecification: SCHEDULE.filter(s => s.loc === l.id).map(s => ({ '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'][s.day - 1], opens: s.from, closes: s.to })) })),
    { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: t.faq.items.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })) },
  ];

  const cardPrice = { court: PRICES.court.almau, coach: PRICES.coach12, open: PRICES.openplay.almau };
  const cardHref = { court: SITE.booking, coach: SITE.booking, open: SITE.telegram };
  const cards = t.play.cards.map((c, i) => `
      <article class="card${i === 2 ? ' is-blue' : ''}">
        <span class="card-no">${c.no}</span>
        <h3>${nb(c.h)}</h3>
        <p>${nb(c.p)}</p>
        <div class="price"><span>${t.play.from}</span><b>${P(cardPrice[c.k])}</b><span>${c.unit}</span></div>
        <a class="btn ${i === 2 ? 'btn-lime' : 'btn-ink'}" href="${cardHref[c.k]}" ${out}>${nb(c.cta)}${EXT}</a>
      </article>`).join('');

  const tick = t.ticker.map(w => `<span>${w}</span><i></i>`).join('');
  const cells = t.board.cells.map(c => `<div class="cell"><div class="num"><span data-d="${c.d}">${c.d}</span>${c.small ? `<small>${c.small}</small>` : ''}</div><p class="lbl">${nb(c.l)}</p></div>`).join('');

  const slots = SCHEDULE.map(s => {
    const l = locById[s.loc];
    return `
        <li class="slot" data-loc="${s.loc}" data-day="${s.day}">
          <span class="day">${t.schedule.dayNames[s.day]}<span class="now">${t.schedule.today}</span></span>
          <time>${s.from}–${s.to}</time>
          <span class="what"><a class="loc-pill loc-${s.loc}" href="#loc-${s.loc}">${l.name}</a>${nb(t.schedule.type[s.type])}</span>
          <a class="btn btn-sm ${s.type === 'open' ? 'btn-blue' : 'btn-line'}" href="${s.type === 'open' ? SITE.telegram : SITE.booking}" ${out}>${t.schedule.cta[s.type]}${EXT}</a>
        </li>`;
  }).join('');

  const led = n => `<span class="led" data-d="${P(n)}">${P(n)}</span>`;
  const prow = (k, a, b) => `
          <tr><th scope="row"><b>${nb(t.prices.rows[k][0])}</b><span>${nb(t.prices.rows[k][1])}</span></th>${b === undefined ? `<td colspan="2">${led(a)}<small>${t.prices.both}</small></td>` : `<td>${led(a)}</td><td>${led(b)}</td>`}</tr>`;

  const locs = LOCATIONS.map((l, i) => {
    const mine = SCHEDULE.filter(s => s.loc === l.id).map(slotText).join(', ');
    const L = t.locations;
    const visual = l.photo
      ? `<img src="/img/${l.photo}" width="1512" height="846" alt="${esc(L.photoAlt)}" loading="lazy" decoding="async"><span class="coord">${L.summer}</span>`
      : `${mapSvg(i)}<span class="coord">${l.lat.toFixed(4)}, ${l.lon.toFixed(4)}</span>`;
    const rows = l.seasonal
      ? [[L.season, L.seasonVal], [L.courts, `${l.courts}, ${L.courtsOut}`], [L.groups, L.groupsVal], [L.rooms, L.yes]]
      : [[L.when, mine], [L.courts, l.courts], [L.court, `${P(PRICES.court[l.id])} ${t.unitH}`], [L.open, `${P(PRICES.openplay[l.id])} ${t.unitH}`], [L.rooms, L.yes]];
    return `
      <article class="loc" id="loc-${l.id}">
        <a class="loc-map" href="${l.gis}" ${out} aria-label="${esc(l.name)}: ${esc(L.gis)}">${visual}</a>
        <div class="loc-body">
          <h3>${l.name}</h3>
          <p class="loc-addr">${L.city}, ${nb(l.street[lang])}<span>${nb(l.hint[lang])}</span></p>
          <dl class="loc-dl">${rows.map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join('')}</dl>
          <div class="loc-btns">
            <a class="btn btn-sm btn-ink" href="${l.gis}" ${out}>${L.gis}${EXT}</a>
            <a class="btn btn-sm btn-line" href="${gmaps(l)}" ${out}>${L.gmaps}${EXT}</a>
          </div>
        </div>
      </article>`;
  }).join('');

  const facts = t.faq.facts.map(([b, s]) => `<div><b>${esc(b).replace(/ /g, '&nbsp;')}</b><span>${nb(s)}</span></div>`).join('');
  const faq = t.faq.items.map(([q, a], i) => `<details${i === 0 ? ' open' : ''}><summary>${nb(q)}</summary><p>${nb(a)}</p></details>`).join('\n        ');
  const photos = PHOTOS.map(p => `<figure class="ph"><img src="/img/${p.src}" width="${p.w}" height="${p.h}" alt="${esc(p.alt[lang])}" loading="lazy" decoding="async"><figcaption class="tag"><b>${p.tag[lang][0]}</b><span>${nb(p.tag[lang][1])}</span></figcaption></figure>`).join('\n      ');
  const f = t.contact.form;
  const i18n = { wa: SITE.whatsapp, hello: f.hello, lName: f.lName, lTopic: f.lTopic, copied: t.contact.copied, copyFail: t.contact.copyFail };

  return `<!doctype html>
<html lang="${t.lang}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>${esc(t.title)}</title>
<meta name="description" content="${esc(t.desc)}">
<link rel="canonical" href="${url}">
<link rel="alternate" hreflang="ru" href="${SITE.url}/">
<link rel="alternate" hreflang="en" href="${SITE.url}/en/">
<link rel="alternate" hreflang="x-default" href="${SITE.url}/en/">
<meta name="theme-color" content="#3F37DC">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<meta property="og:type" content="website">
<meta property="og:site_name" content="${SITE.name}">
<meta property="og:url" content="${url}">
<meta property="og:title" content="${esc(t.title)}">
<meta property="og:description" content="${esc(t.desc)}">
<meta property="og:image" content="${SITE.url}/og.png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:locale" content="${t.locale}">
<meta name="twitter:card" content="summary_large_image">
<meta name="geo.region" content="KZ-75">
<meta name="geo.placename" content="Almaty">
<link rel="preload" href="/fonts/unbounded-${lang === 'ru' ? 'cyrillic' : 'latin'}.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="/assets/style.css?v=${ver}">
<script type="application/ld+json">${JSON.stringify(ld).replace(/</g, '\\u003c')}</script>
</head>
<body>
<header class="bar">
  <a class="mark" href="#top" aria-label="${esc(t.home)}"><i aria-hidden="true"></i><span>Twins <span class="long">Pickleball Club</span></span></a>
  <nav class="nav" aria-label="${t.navLabel}">
    <a href="#play">${t.nav.play}</a>
    <a href="#schedule">${t.nav.schedule}</a>
    <a href="#prices">${t.nav.prices}</a>
    <a href="#locations">${t.nav.locations}</a>
    <a href="#faq">${t.nav.faq}</a>
    <a href="#contact">${t.nav.contact}</a>
    <a class="lang" href="${t.other.path}" hreflang="${t.other.code.toLowerCase()}" lang="${t.other.code.toLowerCase()}" aria-label="${t.other.label}">${t.other.code}</a>
    <a class="cta" href="${SITE.booking}" ${out}>${t.nav.cta}</a>
  </nav>
</header>

<main>
<section class="hero" id="top" aria-label="${t.hero.label}">
  <canvas id="court" aria-hidden="true"></canvas>
  <div class="wrap hero-inner">
    <h1><span>Twins</span><span>Pickleball</span><span>Club</span></h1>
    <p class="lede">${nb(t.hero.lede)}</p>
    <div class="cta-row">
      <a class="btn btn-lime" href="${SITE.booking}" ${out}>${nb(t.hero.book)}</a>
      <a class="btn btn-ghost" href="#schedule">${t.hero.schedule}</a>
    </div>
  </div>
  <p class="hero-hint" aria-hidden="true"><span class="fine">${nb(t.hero.hintFine)}</span><span class="coarse">${nb(t.hero.hintCoarse)}</span></p>
  <div class="hud" id="hud" aria-hidden="true"><span><em>${t.hero.hud}</em><em class="long">${nb(t.hero.hudLong)}</em></span><b id="hits">00</b></div>
</section>

<section class="light" id="play" aria-labelledby="play-h">
  <div class="wrap">
    <div class="sec-head">
      <h2 id="play-h">${nb(t.play.h)}</h2>
      <p>${nb(t.play.lede)}</p>
    </div>
    <div class="cards">${cards}
    </div>
    <p class="play-note">${nb(t.play.openNote)}</p>
  </div>
</section>

<section class="dark board" id="score" aria-labelledby="score-h">
  <div class="ticker" aria-hidden="true"><div class="ticker-track">${tick}${tick}</div></div>
  <div class="wrap">
    <div class="board-head">
      <h2 id="score-h">${t.board.h}</h2>
      <p>${nb(t.board.sub)}</p>
    </div>
    <div class="cells" data-flicker>${cells}</div>
  </div>
</section>

<section class="light" id="schedule" aria-labelledby="schedule-h">
  <div class="wrap">
    <div class="sec-head">
      <h2 id="schedule-h">${t.schedule.h}</h2>
      <p>${nb(t.schedule.lede)}</p>
    </div>
    <div class="chips" role="group" aria-label="${t.schedule.filter}">
      <button class="chip" type="button" data-loc="all" aria-pressed="true">${t.schedule.all}</button>
      ${WINTER.map(l => `<button class="chip" type="button" data-loc="${l.id}" aria-pressed="false">${l.name}</button>`).join('\n      ')}
    </div>
    <ul class="slots">${slots}
    </ul>
    <div class="slot-note"><p>${nb(t.schedule.note)}</p><a class="btn btn-sm btn-ink" href="${SITE.whatsapp}" ${out}>${nb(t.schedule.noteCta)}${EXT}</a></div>
  </div>
</section>

<section class="dark" id="prices" aria-labelledby="prices-h">
  <div class="wrap">
    <div class="board-head">
      <h2 id="prices-h">${t.prices.h}</h2>
      <p>${nb(t.prices.sub)}</p>
    </div>
    <table class="ptable" data-flicker>
      <thead><tr><th scope="col">${t.prices.colService}</th>${WINTER.map(l => `<th scope="col">${l.name}</th>`).join('')}</tr></thead>
      <tbody>${prow('court', PRICES.court.almau, PRICES.court.bright)}${prow('openplay', PRICES.openplay.almau, PRICES.openplay.bright)}${prow('coach12', PRICES.coach12)}${prow('coach34', PRICES.coach34)}${prow('paddle', PRICES.paddle)}${prow('balls', PRICES.balls)}
      </tbody>
    </table>
    <ul class="p-notes">${t.prices.notes.map(n => `<li>${nb(n)}</li>`).join('')}</ul>
    <div class="p-foot"><a class="btn btn-lime" href="${SITE.booking}" ${out}>${nb(t.prices.cta)}${EXT}</a></div>
  </div>
</section>

<section class="light" id="locations" aria-labelledby="locations-h">
  <div class="wrap">
    <div class="sec-head">
      <h2 id="locations-h">${t.locations.h}</h2>
      <p>${nb(t.locations.lede)}</p>
    </div>
    <div class="locs">${locs}
    </div>
  </div>
</section>

<section class="kitchen" id="faq" aria-labelledby="faq-h">
  <div class="wrap">
    <div class="sec-head">
      <h2 id="faq-h">${t.faq.h}</h2>
      <p>${nb(t.faq.lede)}</p>
    </div>
    <div class="facts">${facts}</div>
    <h3 class="faq-h">${t.faq.qh}</h3>
    <div class="faq">
        ${faq}
    </div>
  </div>
</section>

<section class="dark about" id="club" aria-labelledby="club-h">
  <div class="wrap">
    <div class="about-grid">
      <div class="about-text">
        <h2 id="club-h">${t.about.h}</h2>
        <p class="big">${nb(t.about.p1)}</p>
        <p>${nb(t.about.p2)}</p>
        <a class="more" href="${SITE.founder}" ${out}>${nb(t.about.founder)}${EXT}</a>
      </div>
      <div class="logo-card"><img src="/img/logo.webp" width="607" height="476" alt="${esc(t.about.logoAlt)}" loading="lazy" decoding="async"></div>
    </div>
  </div>
  <div class="strip" role="group" aria-label="${t.about.photos}" tabindex="0">
      ${photos}
  </div>
</section>

<section class="contact" id="contact" aria-labelledby="contact-h">
  <div class="wrap">
    <h2 class="cta-h" id="contact-h">${t.contact.h1} <span class="nw">${t.contact.h2}<canvas id="dotball" aria-hidden="true"></canvas></span></h2>
    <p class="lede">${nb(t.contact.lede)}</p>
    <div class="c-grid">
      <div class="rows">
        <div class="row"><span class="k">${t.contact.rows.wa}</span><a class="v" href="${SITE.whatsapp}" ${out}>${SITE.phoneLabel}</a>${EXT}</div>
        <div class="row"><span class="k">${nb(t.contact.rows.tg)}</span><a class="v" href="${SITE.telegram}" ${out}>${SITE.telegramLabel}</a>${EXT}</div>
        <div class="row"><span class="k">${t.contact.rows.ig}</span><a class="v" href="${SITE.instagram}" ${out}>${SITE.instagramLabel}</a>${EXT}</div>
        <div class="row"><span class="k">${t.contact.rows.tel}</span><a class="v" id="tel" href="tel:${SITE.phone}">${SITE.phoneLabel}</a><button class="btn-copy" id="copy" type="button">${t.contact.copy}</button></div>
      </div>
      <form class="form" id="msg" action="${SITE.whatsapp}" method="get" target="_blank">
        <h3>${f.h}</h3>
        <div class="field"><label for="f-name">${f.name}</label><input id="f-name" name="name" type="text" autocomplete="name" placeholder="${esc(f.namePh)}"></div>
        <div class="field"><label for="f-topic">${f.topic}</label><select id="f-topic" name="topic">${f.topics.map(o => `<option>${esc(o)}</option>`).join('')}</select></div>
        <div class="field"><label for="f-text">${f.msg}</label><textarea id="f-text" name="text" placeholder="${esc(f.msgPh)}"></textarea></div>
        <button class="btn btn-ink" type="submit">${nb(f.send)}</button>
        <p class="hint">${nb(f.hint)}</p>
      </form>
    </div>
  </div>
</section>
</main>

<footer class="foot">
  <div class="wrap">
    <span>${t.foot.rights}</span>
    <nav aria-label="${t.navLabel}">
      <a href="${SITE.instagram}" ${out}>Instagram</a>
      <a href="${SITE.telegram}" ${out}>Telegram</a>
      <a href="${SITE.whatsapp}" ${out}>WhatsApp</a>
      <a href="${t.other.path}" hreflang="${t.other.code.toLowerCase()}">${t.other.label}</a>
      <a href="#top">${t.foot.top}</a>
    </nav>
  </div>
</footer>
<div class="dock" id="dock">
  <a class="btn btn-lime" href="${SITE.booking}" ${out}>${t.dock.book}</a>
  <a class="btn btn-ghost" href="${SITE.whatsapp}" ${out}>${t.dock.wa}</a>
</div>
<div class="toast" id="toast" role="status" aria-live="polite"></div>
<script type="application/json" id="i18n">${JSON.stringify(i18n).replace(/</g, '\\u003c')}</script>
<script src="/assets/app.js?v=${ver}" defer></script>
</body>
</html>
`;
}

writeFileSync(`${OUT}/index.html`, page('ru'));
writeFileSync(`${OUT}/en/index.html`, page('en'));

const today = new Date().toISOString().slice(0, 10);
writeFileSync(`${OUT}/sitemap.xml`, `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${['/', '/en/'].map(p => `  <url><loc>${SITE.url}${p}</loc><lastmod>${today}</lastmod><xhtml:link rel="alternate" hreflang="ru" href="${SITE.url}/"/><xhtml:link rel="alternate" hreflang="en" href="${SITE.url}/en/"/></url>`).join('\n')}
</urlset>
`);
writeFileSync(`${OUT}/robots.txt`, `User-agent: *\nAllow: /\n\nSitemap: ${SITE.url}/sitemap.xml\n`);
writeFileSync(`${OUT}/_headers`, `/fonts/*\n  Cache-Control: public, max-age=31536000, immutable\n/img/*\n  Cache-Control: public, max-age=2592000\n`);
console.log('built', OUT, ver);
