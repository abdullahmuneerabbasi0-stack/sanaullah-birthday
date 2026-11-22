/* ------------------------------------------------------------------
 *  ALL personal content for the site lives in this one file.
 *  Edit anything here; you never need to touch the components.
 *
 *  Anything marked  ✏️ PLACEHOLDER  is waiting for the real thing.
 *
 *  Photos: drop files into /public/photos/ and set `photo` to the
 *  file name, e.g. photo: 'photos/beach-2019.jpg'.
 *  Leave `photo` empty ('') to show a soft gradient box instead.
 * ------------------------------------------------------------------ */

export const content = {
  friendName: 'Sanaullah',
  /** ✏️ PLACEHOLDER: your name, used in the letter signature and footer */
  yourName: 'Your Name',

  /** Birthday moment, in Asia/Karachi time (UTC+5). */
  birthdayISO: '2026-11-23T00:00:00+05:00',

  gate: {
    teaser: "Something's waiting for you…",
    readyLine: "It's your day. Go on, it's all for you.",
    button: 'Tap to open your gift 🎁',
  },

  reveal: {
    subtitle: 'Another year of you, and the world is better for it.',
    scrollHint: 'Scroll down, there’s more ↓',
  },

  /** Optional background music. Put an mp3 in /public/music/ and set the
   *  path, e.g. 'music/song.mp3'. Leave '' to hide the music button. */
  music: '',

  timeline: {
    title: 'Our story',
    subtitle: 'A few chapters so far (more coming, obviously).',
    memories: [
      {
        date: '2015', // ✏️ PLACEHOLDER
        title: 'The day we met',
        caption: 'Neither of us knew this was the start of something legendary.',
        photo: '',
      },
      {
        date: '2017', // ✏️ PLACEHOLDER
        title: 'The first road trip',
        caption: 'Wrong turns, loud music, zero regrets.',
        photo: '',
      },
      {
        date: '2019', // ✏️ PLACEHOLDER
        title: 'That 3 AM conversation',
        caption: 'Chai, big dreams, and laughing until it hurt.',
        photo: '',
      },
      {
        date: '2022', // ✏️ PLACEHOLDER
        title: 'When you had my back',
        caption: 'You showed up without being asked. I never forgot.',
        photo: '',
      },
      {
        date: '2026',
        title: 'Today',
        caption: 'Still here, still laughing, still the best.',
        photo: '',
      },
    ],
  },

  gallery: {
    title: 'Proof we were there',
    subtitle: 'Tap any photo to look closer.',
    photos: [
      { photo: '', caption: 'iconic duo' }, // ✏️ PLACEHOLDER captions
      { photo: '', caption: 'that one wedding' },
      { photo: '', caption: 'mid-laugh, as always' },
      { photo: '', caption: 'golden hour' },
      { photo: '', caption: 'we were so young' },
      { photo: '', caption: 'chai o’clock' },
      { photo: '', caption: 'no context needed' },
      { photo: '', caption: 'best day' },
    ],
  },

  reasons: {
    title: 'Reasons you’re awesome',
    subtitle: 'Tap the card to flip it. Ten of them (I had to stop somewhere).',
    list: [
      // ✏️ PLACEHOLDER reasons: make them yours
      'You laugh at your own jokes before you finish them, and it’s contagious.',
      'You show up. Every single time.',
      'You give the best advice, even when you don’t follow it yourself.',
      'You make strangers feel like old friends in five minutes.',
      'Your loyalty is honestly unmatched.',
      'You’re calm when everyone else is panicking.',
      'You remember the small things people tell you.',
      'You can turn any boring day into a story.',
      'You’re braver than you give yourself credit for.',
      'Life is simply more fun with you around.',
    ],
  },

  quiz: {
    title: 'How well do you know yourself?',
    subtitle: 'Five questions. No pressure. (Some pressure.)',
    questions: [
      // ✏️ PLACEHOLDER questions: `answer` is the index of the right option (0-based)
      {
        q: 'What is Sanaullah’s go-to comfort food?',
        options: ['Biryani', 'Pizza', 'Nihari', 'Whatever’s on someone else’s plate'],
        answer: 0,
        right: 'Correct. A man who knows his priorities.',
        wrong: 'Wow. Do you even know yourself?',
      },
      {
        q: 'How late is Sanaullah, on average?',
        options: ['Always early', 'Right on time', '“5 minutes” (40 minutes)', 'Arrives tomorrow'],
        answer: 2,
        right: 'Honest. We respect the self-awareness.',
        wrong: 'Bold of you to lie on your own birthday.',
      },
      {
        q: 'What does Sanaullah say most often?',
        options: ['“Chill, yaar”', '“I’m on my way”', '“Let’s eat first”', '“Trust me”'],
        answer: 0,
        right: 'Exactly. Chill, yaar.',
        wrong: 'Hmm, everyone who knows you is shaking their head.',
      },
      {
        q: 'Sanaullah’s dream holiday is…',
        options: ['Northern Pakistan mountains', 'A beach somewhere', 'A big city trip', 'Sleeping in, at home'],
        answer: 0,
        right: 'Yes! Pack the bags.',
        wrong: 'Close, but your heart says mountains.',
      },
      {
        q: 'Who is Sanaullah’s best friend?',
        options: ['Obviously me', 'Me, again', 'Still me', 'All of the above'],
        answer: 3,
        right: 'Correct. There was never another answer.',
        wrong: 'Trick question, they were all right. But you picked the weakest one.',
      },
    ],
    results: [
      // picked by score: first entry whose `min` is <= score, checked top to bottom
      { min: 5, title: 'Certified Sanaullah expert 🏆', text: 'Perfect score. You know yourself as well as we do.' },
      { min: 3, title: 'Mostly self-aware 😎', text: 'Not bad! A little more reflection over chai and you’ll get there.' },
      { min: 1, title: 'Who even are you? 🤔', text: 'Lucky you have friends who know you better than you do.' },
      { min: 0, title: 'Stranger danger 🚨', text: 'Zero. Impressive, honestly. Happy birthday anyway!' },
    ],
  },

  messages: {
    title: 'Notes from your people',
    subtitle: 'Some people who wanted to say something.',
    list: [
      // ✏️ PLACEHOLDER messages from friends
      { name: 'Ali', message: 'Happy birthday bro! Here’s to more late nights and bad decisions. 🎉' },
      { name: 'Hamza', message: 'You’re one of the realest people I know. Have the best year.' },
      { name: 'Ayesha', message: 'Wishing you all the happiness in the world, you deserve every bit.' },
      { name: 'Usman', message: 'Still waiting for you to return my charger. Happy birthday though ❤️' },
      { name: 'Fatima', message: 'May this year bring you everything you’ve been praying for.' },
      { name: 'Bilal', message: 'Older, wiser… well, older at least. Love you man!' },
    ],
  },

  finale: {
    title: 'One last thing…',
    envelopeHint: 'Tap the envelope',
    // ✏️ PLACEHOLDER letter: blank lines start new paragraphs
    letter: `Dear Sanaullah,

Happy birthday! I wanted to make you something a little different this year, something you could keep.

Thank you for every laugh, every late night, every time you picked up the phone. You make the good days better and the hard days lighter, and I don’t say that enough.

I hope this year is kind to you, and full of the things that make you happiest. Whatever comes next, I’ll be right here, probably laughing at your jokes before you finish them.`,
    /** ✏️ PLACEHOLDER ending line, shown after the letter */
    ending: 'Check your door 👀',
    /** Optional YouTube video id (the part after v=). Leave '' for none. */
    youtubeId: '',
    signOff: 'With love,',
  },

  footer: {
    madeWith: 'Made with ❤️ by',
    replay: 'Replay the surprise',
  },
}

export type Content = typeof content

/** Turns 'photos/x.jpg' into a URL that works under any hosting path. */
export const asset = (path: string) => (path ? `${import.meta.env.BASE_URL}${path}` : '')
