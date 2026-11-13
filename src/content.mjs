// Всё, что меняется чаще всего: ссылки, цены, расписание, локации и тексты.
// После правки запустите `npm run build`.

export const SITE = {
  url: 'https://twinspickleball.com',
  name: 'Twins Pickleball Club',
  phone: '+77470412150',
  phoneLabel: '+7 747 041 21 50',
  whatsapp: 'https://wa.me/77470412150',
  // Онлайн-запись Altegio (форма «Company form», id 1426996)
  booking: 'https://n1426996.alteg.io/',
  // Мини-приложение Pickle KZ в Telegram: регистрация на открытые игры
  telegram: 'https://t.me/pickle_kz_bot',
  telegramLabel: '@pickle_kz_bot',
  instagram: 'https://www.instagram.com/twins_pickleball/',
  instagramLabel: '@twins_pickleball',
  founder: 'https://maximmaltsev.com/',
};

// Цены в тенге
export const PRICES = {
  court: { almau: 6000, bright: 8000 },      // аренда корта, за час
  openplay: { almau: 1500, bright: 2000 },   // вход на открытую игру, за час
  coach12: 15000,                            // тренировка 1–2 человека, за час
  coach34: 20000,                            // тренировка 3–4 человека, за час
  paddle: 1500,                              // аренда ракетки, за час
  balls: 1000,                               // аренда мячей, за час
};

export const LOCATIONS = [
  {
    id: 'almau',
    name: 'AlmaU',
    lat: 43.206938, lon: 76.892939,
    gis: 'https://go.2gis.com/8W7XP',
    street: { ru: 'ул. Розыбакиева, 227/1', en: '227/1 Rozybakiev St' },
    hint: { ru: 'Кампус Almaty Management University', en: 'Almaty Management University campus' },
    courts: 3,
  },
  {
    id: 'bright',
    name: 'Bright Hills',
    lat: 43.170023, lon: 76.899697,
    gis: 'https://go.2gis.com/Nmhco',
    street: { ru: 'ул. Розы Жамановой, 46', en: '46 Roza Zhamanova St' },
    hint: { ru: 'ЖК Bright Hills', en: 'Bright Hills residential complex' },
    courts: 4,
  },
  {
    // Летняя площадка: работает с мая до конца сентября, расписания и цен на сайте пока нет
    id: 'abay',
    name: 'Abay',
    seasonal: true,
    photo: 'tournament.webp',
    gis: 'https://2gis.kz/almaty/search/' + encodeURIComponent('проспект Абая, 159'),
    gmapsQuery: 'проспект Абая 159, Алматы',
    street: { ru: 'пр. Абая, 159', en: '159 Abay Ave' },
    hint: { ru: 'Открытые корты, летний сезон', en: 'Outdoor courts, summer season' },
    courts: 4,
  },
];

// day: 1 = понедельник … 7 = воскресенье. type: 'rent' | 'open'
export const SCHEDULE = [
  { day: 1, from: '19:30', to: '21:00', loc: 'bright', type: 'rent' },
  { day: 3, from: '19:00', to: '21:00', loc: 'bright', type: 'open' },
  { day: 4, from: '12:00', to: '17:00', loc: 'almau', type: 'rent' },
  { day: 5, from: '19:30', to: '21:00', loc: 'bright', type: 'rent' },
  { day: 7, from: '15:00', to: '18:00', loc: 'almau', type: 'open' },
];

export const PHOTOS = [
  { src: 'tournament.webp', w: 1512, h: 846,
    alt: { ru: 'Участники турнира Twins Pickleball Club с дипломами и медалями на кортах', en: 'Twins Pickleball Club tournament players with medals and diplomas on court' },
    tag: { ru: ['Турнир', 'Алматы, корты клуба'], en: ['Tournament', 'Almaty, club courts'] } },
  { src: 'action.webp', w: 1200, h: 1500,
    alt: { ru: 'Игрок клуба принимает низкий мяч у линии кухни', en: 'A club player digging a low ball at the kitchen line' },
    tag: { ru: ['Кухня', 'Игра у сетки'], en: ['Kitchen', 'Play at the net'] } },
  { src: 'wc-court.webp', w: 1125, h: 1500,
    alt: { ru: 'Игроки клуба на корте чемпионата мира в форме сборной Казахстана', en: 'Club players on a World Cup court in Team Kazakhstan shirts' },
    tag: { ru: ['KAZ', 'Чемпионат мира, Дананг'], en: ['KAZ', 'World Cup, Da Nang'] } },
  { src: 'wc-team.webp', w: 1125, h: 1500,
    alt: { ru: 'Основатели клуба у пресс-волла чемпионата мира по пиклболу 2026', en: 'Club founders at the 2026 Pickleball World Cup press wall' },
    tag: { ru: ['2026', 'Сборная Казахстана'], en: ['2026', 'Team Kazakhstan'] } },
];

export const T = {
  ru: {
    lang: 'ru', locale: 'ru_RU', path: '/', other: { code: 'EN', path: '/en/', label: 'English version' },
    title: 'Twins Pickleball Club — пиклбол в Алматы: корты, тренировки, открытые игры',
    desc: 'Первый пиклбол-клуб Казахстана. Три площадки в Алматы: аренда кортов от 6 000 ₸ в час, тренировки с тренером и открытые игры Open Play. Онлайн-бронирование, расписание, цены и адреса.',
    nav: { play: 'Форматы', schedule: 'Расписание', prices: 'Цены', locations: 'Локации', faq: 'Новичкам', contact: 'Контакты', cta: 'Записаться' },
    navLabel: 'Разделы', home: 'Twins Pickleball Club, в начало страницы',
    hero: {
      label: 'Главный экран',
      lede: 'Первый пиклбол-клуб Казахстана. Три площадки в Алматы: корты, тренировки и открытые игры для любого уровня.',
      book: 'Забронировать корт', schedule: 'Расписание',
      hintFine: 'Кликните по корту, чтобы ударить сильнее', hintCoarse: 'Коснитесь корта',
      hud: 'Удары', hudLong: ' в розыгрыше',
    },
    play: {
      h: 'Выберите формат',
      lede: 'Приходите с друзьями, с тренером или в одиночку. Ракетки и мячи можно взять на месте.',
      per: 'час', from: 'от',
      cards: [
        { k: 'court', no: '01', h: 'Аренда корта', p: 'Корт в вашем распоряжении: игра с друзьями, спарринг или самостоятельная тренировка. До четырёх игроков на корте.', cta: 'Забронировать корт', unit: '₸ / час' },
        { k: 'coach', no: '02', h: 'Тренировка с тренером', p: 'Техника, тактика и игровые упражнения под ваш уровень. Один на один или своей компанией до четырёх человек. Корт оплачивается отдельно.', cta: 'Записаться на тренировку', unit: '₸ / час' },
        { k: 'open', no: '03', h: 'Open Play', p: 'Открытая игра без фиксированных пар. Партнёры и соперники меняются, поэтому за вечер вы сыграете с половиной клуба.', cta: 'Открыть в Telegram', unit: '₸ / час' },
      ],
      openNote: 'Регистрация на открытые игры идёт в мини-приложении Pickle KZ в Telegram.',
    },
    ticker: ['PICKLEBALL', 'ALMATY', 'OPEN PLAY', 'KAZAKHSTAN', 'TWINS', 'SINCE 2024', 'DINK'],
    board: {
      h: 'Счёт', sub: 'Клуб в цифрах',
      cells: [
        { d: '1', small: '-й', l: 'специализированный пиклбол-клуб в Казахстане' },
        { d: '11', l: 'кортов на трёх площадках в Алматы' },
        { d: '100+', l: 'открытых игр Open Play для комьюнити' },
        { d: '2026', l: 'игроки клуба выступили за Казахстан на чемпионате мира' },
      ],
    },
    schedule: {
      h: 'Расписание',
      lede: 'Постоянные слоты клуба на неделю. Свободные корты видны при онлайн-бронировании, открытые игры публикуем в Telegram.',
      all: 'Все локации', filter: 'Фильтр по локации',
      days: ['Понедельник', 'Среда', 'Четверг', 'Пятница', 'Воскресенье'],
      dayNames: { 1: 'Понедельник', 2: 'Вторник', 3: 'Среда', 4: 'Четверг', 5: 'Пятница', 6: 'Суббота', 7: 'Воскресенье' },
      dayShort: { 1: 'Пн', 2: 'Вт', 3: 'Ср', 4: 'Чт', 5: 'Пт', 6: 'Сб', 7: 'Вс' },
      type: { rent: 'Аренда кортов и тренировки', open: 'Открытая игра' },
      cta: { rent: 'Забронировать', open: 'Записаться' },
      today: 'Сегодня',
      note: 'Нужно другое время? Напишите нам, подберём корт.',
      noteCta: 'Написать в WhatsApp',
    },
    prices: {
      h: 'Цены', sub: 'В тенге, за один час',
      colService: 'Услуга', both: 'Обе локации',
      rows: {
        court: ['Аренда корта', 'Самостоятельная игра, до 4 человек'],
        openplay: ['Open Play', 'Вход на открытую игру, с человека'],
        coach12: ['Тренировка, 1–2 человека', 'Работа тренера, корт оплачивается отдельно'],
        coach34: ['Тренировка, 3–4 человека', 'За всю группу, корт оплачивается отдельно'],
        paddle: ['Аренда ракетки', 'Если нет своей'],
        balls: ['Аренда мячей', 'Если нет своих'],
      },
      notes: [
        'Тренировка с тренером складывается из работы тренера и аренды корта: например, час на 1–2 человек в AlmaU стоит 15 000 + 6 000 ₸.',
        'Бронь подтверждается после предоплаты: администратор пришлёт реквизиты в WhatsApp.',
      ],
      cta: 'Забронировать онлайн',
    },
    locations: {
      h: 'Локации', lede: 'Зимой играем в AlmaU и Bright Hills, с мая по сентябрь открываем корты на Абая. Перед визитом загляните в расписание: у каждой локации свои дни.',
      city: 'Алматы', when: 'Когда играем', court: 'Корт', open: 'Open Play',
      gis: 'Открыть в 2ГИС', gmaps: 'Google Maps', book: 'Забронировать',
      courts: 'Корты', courtsOut: 'открытых', rooms: 'Раздевалки', yes: 'есть', season: 'Сезон', seasonVal: 'май — конец сентября', summer: 'Летняя площадка', groups: 'Группы', groupsVal: 'взрослые и детские', photoAlt: 'Открытые корты клуба на проспекте Абая',
    },
    faq: {
      h: 'Новичкам',
      lede: 'Пиклбол — это смесь тенниса, бадминтона и настольного тенниса. Корт маленький, правила простые, поэтому играть получается с первого занятия.',
      facts: [
        ['13,4 × 6,1 м', 'размер корта, как у бадминтонной площадки'],
        ['2,13 м', 'глубина «кухни» — зоны у сетки, где нельзя бить с лёта'],
        ['11', 'очков в гейме, побеждает разница в два'],
        ['2 × 2', 'самый популярный формат, пара на пару'],
      ],
      qh: 'Частые вопросы',
      items: [
        ['Я никогда не играл. С чего начать?', 'Запишитесь на тренировку с тренером: за час разберёте правила, подачу и основные удары и сыграете первые розыгрыши. Опыт в теннисе не нужен. После одной-двух тренировок приходите на Open Play.'],
        ['Что взять с собой?', 'Сменную спортивную обувь с нескользящей подошвой, удобную форму и воду. Ракетки и мячи можно арендовать на месте.'],
        ['Как забронировать корт или тренировку?', 'Онлайн, по кнопке «Забронировать»: выберите услугу, корт или тренера и время. После бронирования напишите администратору в WhatsApp и внесите предоплату, после этого бронь подтверждена.'],
        ['Как попасть на открытую игру?', 'Открытые игры публикуются в мини-приложении Pickle KZ в Telegram. Откройте его, выберите игру и зарегистрируйтесь. Там же можно найти напарника и следить за своим рейтингом.'],
        ['Можно ли прийти одному?', 'Да. На Open Play пары меняются после каждого матча, напарник найдётся на месте.'],
        ['Есть ли групповые тренировки?', 'Группы для взрослых и детей работают в летнем сезоне, с мая по сентябрь, на открытых кортах на Абая. В остальное время тренируйтесь с тренером индивидуально или своей компанией до четырёх человек.'],
        ['Есть ли раздевалки?', 'Да, раздевалки есть на всех площадках.'],
        ['Вы говорите по-английски?', 'Да. Пишите в WhatsApp на русском или английском, поможем с записью и расскажем, как добраться.'],
        ['Проводите ли вы турниры и мероприятия?', 'Да, проводим клубные турниры и мастер-классы для новичков. Если хотите сыграть компанией или провести своё мероприятие, напишите нам, обсудим формат и дату.'],
      ],
    },
    about: {
      h: 'Клуб',
      p1: 'Twins Pickleball Club открыли в августе 2024 года братья-близнецы Максим и Вадим Мальцевы. Отсюда и название. Это первый специализированный пиклбол-клуб в Казахстане.',
      p2: 'Мы строим комьюнити: открытые игры, турниры, выездные кемпы. В 2026 году игроки клуба впервые представили Казахстан на чемпионате мира по пиклболу во Вьетнаме.',
      founder: 'О сооснователе клуба',
      logoAlt: 'Логотип Twins Pickleball Club',
      photos: 'Фотографии клуба',
    },
    contact: {
      h1: 'Давайте', h2: 'сыграем',
      lede: 'Напишите, если хотите записаться, задать вопрос или обсудить мероприятие, турнир или партнёрство.',
      rows: { wa: 'WhatsApp', tg: 'Открытые игры в Telegram', ig: 'Instagram', tel: 'Телефон' },
      copy: 'Скопировать', copied: 'Номер скопирован', copyFail: 'Номер выделен, скопируйте его',
      form: {
        h: 'Написать клубу', name: 'Имя', namePh: 'Как к вам обращаться',
        topic: 'Что вас интересует',
        topics: ['Аренда корта', 'Тренировка с тренером', 'Открытая игра', 'Мероприятие или турнир', 'Другое'],
        msg: 'Сообщение', msgPh: 'Удобные дни и время, сколько вас человек',
        send: 'Отправить в WhatsApp',
        hint: 'Откроется WhatsApp с готовым сообщением.',
        hello: 'Здравствуйте! Пишу с сайта Twins Pickleball Club.', lName: 'Имя', lTopic: 'Интересует',
      },
    },
    foot: { rights: '© 2026 Twins Pickleball Club, Алматы', top: 'Наверх' },
    dock: { book: 'Забронировать', wa: 'WhatsApp' },
    unitH: '₸ / час',
  },

  en: {
    lang: 'en', locale: 'en_US', path: '/en/', other: { code: 'RU', path: '/', label: 'Русская версия' },
    title: 'Twins Pickleball Club — pickleball in Almaty, Kazakhstan: courts, coaching, open play',
    desc: 'The first pickleball club in Kazakhstan. Three venues in Almaty: court rental from 6,000 ₸ per hour, coaching and Open Play sessions. Online booking, schedule, prices and addresses. English spoken.',
    nav: { play: 'Play', schedule: 'Schedule', prices: 'Prices', locations: 'Locations', faq: 'New here', contact: 'Contact', cta: 'Book now' },
    navLabel: 'Sections', home: 'Twins Pickleball Club, back to top',
    hero: {
      label: 'Intro',
      lede: 'The first pickleball club in Kazakhstan. Three venues in Almaty: courts, coaching and open play for every level.',
      book: 'Book a court', schedule: 'Schedule',
      hintFine: 'Click the court to hit harder', hintCoarse: 'Tap the court',
      hud: 'Shots', hudLong: ' this rally',
    },
    play: {
      h: 'Pick your game',
      lede: 'Come with friends, with a coach or on your own. Paddles and balls are available on site.',
      per: 'hour', from: 'from',
      cards: [
        { k: 'court', no: '01', h: 'Court rental', p: 'The court is yours: a game with friends, sparring or solo drilling. Up to four players per court.', cta: 'Book a court', unit: '₸ / hour' },
        { k: 'coach', no: '02', h: 'Coaching', p: 'Technique, tactics and game drills matched to your level. One on one or with your own group of up to four. Court rental is paid separately.', cta: 'Book a lesson', unit: '₸ / hour' },
        { k: 'open', no: '03', h: 'Open Play', p: 'Drop-in games with no fixed pairs. Partners and opponents rotate, so in one evening you play half the club.', cta: 'Open in Telegram', unit: '₸ / hour' },
      ],
      openNote: 'Open Play sign-up runs in the Pickle KZ mini app on Telegram.',
    },
    ticker: ['PICKLEBALL', 'ALMATY', 'OPEN PLAY', 'KAZAKHSTAN', 'TWINS', 'SINCE 2024', 'DINK'],
    board: {
      h: 'Score', sub: 'The club in numbers',
      cells: [
        { d: '1', small: 'st', l: 'dedicated pickleball club in Kazakhstan' },
        { d: '11', l: 'courts across three venues in Almaty' },
        { d: '100+', l: 'Open Play sessions for the community' },
        { d: '2026', l: 'club players represented Kazakhstan at the World Cup' },
      ],
    },
    schedule: {
      h: 'Schedule',
      lede: 'The club’s regular weekly slots, Almaty time. Free courts show up in online booking, open games are posted on Telegram.',
      all: 'All locations', filter: 'Filter by location',
      dayNames: { 1: 'Monday', 2: 'Tuesday', 3: 'Wednesday', 4: 'Thursday', 5: 'Friday', 6: 'Saturday', 7: 'Sunday' },
      dayShort: { 1: 'Mon', 2: 'Tue', 3: 'Wed', 4: 'Thu', 5: 'Fri', 6: 'Sat', 7: 'Sun' },
      type: { rent: 'Court rental and coaching', open: 'Open Play' },
      cta: { rent: 'Book', open: 'Join' },
      today: 'Today',
      note: 'Need a different time? Message us and we will find you a court.',
      noteCta: 'Message on WhatsApp',
    },
    prices: {
      h: 'Prices', sub: 'In Kazakhstani tenge, per hour',
      colService: 'Service', both: 'Both locations',
      rows: {
        court: ['Court rental', 'Play on your own, up to 4 players'],
        openplay: ['Open Play', 'Drop-in fee, per person'],
        coach12: ['Coaching, 1–2 players', 'Coach fee, court rental is paid separately'],
        coach34: ['Coaching, 3–4 players', 'For the whole group, court rental is paid separately'],
        paddle: ['Paddle rental', 'If you don’t have your own'],
        balls: ['Ball rental', 'If you don’t have your own'],
      },
      notes: [
        'A coaching session costs the coach fee plus court rental: for example, one hour for 1–2 players at AlmaU is 15,000 + 6,000 ₸.',
        'A booking is confirmed after prepayment: our admin sends payment details on WhatsApp.',
      ],
      cta: 'Book online',
    },
    locations: {
      h: 'Locations', lede: 'In winter we play at AlmaU and Bright Hills; from May to September we open the outdoor courts on Abay Avenue. Check the schedule before you come: each location has its own days.',
      city: 'Almaty', when: 'When we play', court: 'Court', open: 'Open Play',
      gis: 'Open in 2GIS', gmaps: 'Google Maps', book: 'Book',
      courts: 'Courts', courtsOut: 'outdoor', rooms: 'Changing rooms', yes: 'yes', season: 'Season', seasonVal: 'May to end of September', summer: 'Summer venue', groups: 'Group classes', groupsVal: 'adults and kids', photoAlt: 'The club’s outdoor courts on Abay Avenue',
    },
    faq: {
      h: 'New here',
      lede: 'Pickleball is a mix of tennis, badminton and table tennis. The court is small and the rules are simple, so you are rallying in your first session.',
      facts: [
        ['13.4 × 6.1 m', 'court size, same as a badminton court'],
        ['2.13 m', 'depth of the kitchen, the no-volley zone at the net'],
        ['11', 'points in a game, win by two'],
        ['2 × 2', 'the most popular format, doubles'],
      ],
      qh: 'Common questions',
      items: [
        ['I have never played. Where do I start?', 'Book a lesson with a coach: in one hour you cover the rules, the serve and the basic shots, and play your first points. No tennis background needed. After a lesson or two, join Open Play.'],
        ['What should I bring?', 'Clean indoor sports shoes with non-slip soles, comfortable sportswear and water. Paddles and balls can be rented on site.'],
        ['How do I book a court or a lesson?', 'Online, via the “Book” button: pick a service, a court or a coach, and a time. Then message our admin on WhatsApp and make the prepayment, which confirms your booking.'],
        ['How do I join Open Play?', 'Open games are posted in the Pickle KZ mini app on Telegram. Open it, choose a game and sign up. You can also find a partner there and track your rating.'],
        ['Can I come alone?', 'Yes. At Open Play pairs rotate after every match, so you will find a partner on the spot.'],
        ['Do you run group classes?', 'Group classes for adults and kids run in the summer season, May to September, on the outdoor courts on Abay Avenue. The rest of the year, train with a coach one on one or with your own group of up to four.'],
        ['Are there changing rooms?', 'Yes, every venue has changing rooms.'],
        ['Do you speak English?', 'Yes. Message us on WhatsApp in English or Russian. We will help you book and explain how to get there.'],
        ['How do I pay as a visitor?', 'Prices are in Kazakhstani tenge (₸). Our admin will send payment options on WhatsApp when you book.'],
        ['Do you host tournaments and events?', 'Yes, we run club tournaments and beginner clinics. If you want to play as a group or host your own event, message us to discuss the format and the date.'],
      ],
    },
    about: {
      h: 'The club',
      p1: 'Twins Pickleball Club was opened in August 2024 by twin brothers Maxim and Vadim Maltsev, hence the name. It is the first dedicated pickleball club in Kazakhstan.',
      p2: 'We are building a community: open play, tournaments and pickleball camps. In 2026 club players represented Kazakhstan at the Pickleball World Cup in Vietnam for the first time.',
      founder: 'About the co-founder',
      logoAlt: 'Twins Pickleball Club logo',
      photos: 'Club photos',
    },
    contact: {
      h1: 'Let’s', h2: 'play',
      lede: 'Message us to book, ask a question, or talk about an event, a tournament or a partnership.',
      rows: { wa: 'WhatsApp', tg: 'Open Play on Telegram', ig: 'Instagram', tel: 'Phone' },
      copy: 'Copy', copied: 'Number copied', copyFail: 'Number selected, copy it',
      form: {
        h: 'Message the club', name: 'Name', namePh: 'What should we call you',
        topic: 'What are you interested in',
        topics: ['Court rental', 'Coaching', 'Open Play', 'Event or tournament', 'Something else'],
        msg: 'Message', msgPh: 'Preferred days and times, how many players',
        send: 'Send on WhatsApp',
        hint: 'WhatsApp opens with your message ready to send.',
        hello: 'Hello! I am writing from the Twins Pickleball Club website.', lName: 'Name', lTopic: 'Interested in',
      },
    },
    foot: { rights: '© 2026 Twins Pickleball Club, Almaty', top: 'Back to top' },
    dock: { book: 'Book', wa: 'WhatsApp' },
    unitH: '₸ / hour',
  },
};
