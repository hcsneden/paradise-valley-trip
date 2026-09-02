export const trip = {
  eyebrow: 'Paradise Valley, MT',
  title: 'Big sky, small plans.',
  subline: 'Oct 15–18 · 3 nights · 4 families · a house on the Yellowstone',
  startsOn: '2026-10-15',
  address: '17 Appaloosa Circle, Livingston, MT 59047',
  guidebook: 'https://www.airbnb.com/s/guidebooks?refinement_paths[]=/guidebooks/6234225',
  hostNote:
    'The valley is rural. Do the real shop in Bozeman or Livingston before you head out. The house already has coffee, tea, oil, flour, sugar and spices. Closest gas and milk is the general store in Emigrant, fifteen minutes off.',
  weatherNote:
    'Mid-October in the valley runs 55°F in the afternoon and drops near freezing after dark. The sun goes behind the ridge before 7. Bring a puffy, a hat, and boots you do not mind soaking.',
}

export interface Listing {
  title: string
  location: string
  url: string
  images: string[]
  guests: number
  bedrooms: number
  beds: number
  bathrooms: number
}

export const listing: Listing = {
  title: 'Yellowstone Paradise Valley Home',
  location: 'Entire home in Livingston, Montana',
  url: 'https://www.airbnb.com/rooms/968919791124925451',
  images: [
    'https://a0.muscache.com/im/pictures/prohost-api/Hosting-968919791124925451/original/cc8ccc9c-b0e1-45ee-9c5d-6cd836d2f528.jpeg?im_w=1200',
    'https://a0.muscache.com/im/pictures/prohost-api/Hosting-968919791124925451/original/721c03b5-a485-43c3-9420-af1b6ab71a7a.jpeg?im_w=1200',
    'https://a0.muscache.com/im/pictures/prohost-api/Hosting-968919791124925451/original/20337019-5ccf-40d0-9d1b-27af2095402a.jpeg?im_w=1200',
    'https://a0.muscache.com/im/pictures/prohost-api/Hosting-968919791124925451/original/8345eba0-44e3-4773-8051-00f20c0c0f2c.jpeg?im_w=1200',
    'https://a0.muscache.com/im/pictures/miso/Hosting-968919791124925451/original/3068dd63-5027-424b-83c4-f77eab7eb652.jpeg?im_w=1200',
    'https://a0.muscache.com/im/pictures/prohost-api/Hosting-968919791124925451/original/03648d88-5622-480d-9964-fed0887ea57e.jpeg?im_w=1200',
    'https://a0.muscache.com/im/pictures/prohost-api/Hosting-968919791124925451/original/f600d14b-cb0c-468c-9210-8615d4b24966.jpeg?im_w=1200',
    'https://a0.muscache.com/im/pictures/prohost-api/Hosting-968919791124925451/original/725b5919-f000-4df2-bc4a-8c6c4505dec5.jpeg?im_w=1200',
  ],
  guests: 12,
  bedrooms: 4,
  beds: 7,
  bathrooms: 4,
}

export const stay = {
  checkIn: 'Thu, after 4:00 pm',
  checkOut: 'Sun, by 10:00 am',
}

export interface DriveTime {
  label: string
  value: string
}

export const driveTimes: DriveTime[] = [
  { label: 'Chicory fishing access', value: '1 mile' },
  { label: 'Chico Hot Springs', value: '12 min' },
  { label: 'Emigrant general store', value: '15 min' },
  { label: 'Pine Creek Falls', value: '24 min' },
  { label: 'Livingston', value: '25 min' },
  { label: 'Grizzly Encounter', value: '35 min' },
  { label: 'Bozeman airport', value: '1 hr' },
  { label: 'Mammoth Hot Springs', value: '1 hr' },
  { label: 'Old Faithful', value: '2 hr 30' },
]

export interface ItineraryItem {
  time: string
  title: string
  detail: string
  tag?: string
  tagTone?: 'water' | 'trail' | 'booking'
}

export interface Day {
  id: number
  dow: string
  num: string
  title: string
  note: string
  items: ItineraryItem[]
}

export const days: Day[] = [
  {
    id: 1,
    dow: 'THU',
    num: '15',
    title: 'Land, provision, soak',
    note: 'Nobody plans anything ambitious today.',
    items: [
      {
        time: '12:30 pm',
        title: 'Wheels down at BZN',
        detail:
          'Nat and Liv & Joe land at 12:30, Jord at 1:20. Han and Mal are already in from the weekend. First ones down grab coffee and wait it out.',
      },
      {
        time: '2:00 pm',
        title: 'The big shop',
        detail:
          'Last real store before the valley. Four days of food, firewood, unreasonable breakfast meat. Worth doing a Walmart or Costco pickup order so it is bagged and waiting.',
        tag: 'someone order ahead',
        tagTone: 'booking',
      },
      {
        time: '3:00 pm',
        title: 'Grizzly Encounter on the way',
        detail:
          'Sits between Bozeman and Livingston, so it costs you nothing but the stop. $13.50 a head and the kids are free.',
      },
      {
        time: '4:00 pm',
        title: 'Check in at the house',
        detail:
          'Bedroom draw happens on the porch, not over text. Four bedrooms, seven beds, four baths. Hot tub on immediately.',
      },
      {
        time: '7:00 pm',
        title: 'Fire pit and an early night',
        detail:
          'Everyone has been travelling with kids since dawn. Cook in, sit outside, go to bed.',
      },
    ],
  },
  {
    id: 2,
    dow: 'FRI',
    num: '16',
    title: 'Park day, or valley day',
    note: 'The one real decision of the trip. Vote below.',
    items: [
      {
        time: '6:30 am',
        title: 'If we commit: roll out early',
        detail:
          'Old Faithful is 2 hr 30 each way, so it goes first. Midway Geyser Basin is ten minutes back up the road, then Mammoth on the way home. Thermoses, not a sit-down breakfast.',
        tag: '5–6 hrs driving',
        tagTone: 'booking',
      },
      {
        time: '9:00 am',
        title: 'If we do not: fish the Yellowstone',
        detail:
          'Chicory access is a mile from the front door. Temporary licences online the night before. Rock hunting for anyone not holding a rod.',
        tag: 'licence needed',
        tagTone: 'water',
      },
      {
        time: '11:00 am',
        title: 'Or split the difference at Mammoth',
        detail:
          'North end of the park, an hour out. You get Yellowstone without losing the whole day to the car.',
        tag: 'easy compromise',
        tagTone: 'trail',
      },
      {
        time: '6:30 pm',
        title: 'Dinner wherever we land',
        detail:
          'Cook at the house if it was a long day. The Old Saloon is twelve minutes off if nobody has the energy.',
      },
    ],
  },
  {
    id: 3,
    dow: 'SAT',
    num: '17',
    title: 'Hike, fish, Oktoberfest',
    note: 'The one day with something actually scheduled.',
    items: [
      {
        time: '9:00 am',
        title: 'Pine Creek Falls',
        detail:
          '24 minutes out. 1.2 miles to the falls and back if the kids are done, up to ten if anyone has the legs for it.',
        tag: 'easy · family',
        tagTone: 'trail',
      },
      {
        time: '1:00 pm',
        title: 'Fish the home water',
        detail: 'Chicory access again over lunch or after naps. It is a mile away, so it costs nothing to try.',
        tag: 'licence needed',
        tagTone: 'water',
      },
      {
        time: '4:00 pm',
        title: '2nd Street Oktoberfest, Livingston',
        detail:
          'Runs 4 to 7 in downtown Livingston, 25 minutes from the house. Open question from the group chat: do we secretly sign the men up for the stein competition?',
        tag: '4–7 pm sharp',
        tagTone: 'booking',
      },
      {
        time: '8:00 pm',
        title: 'Trash out, then the fire',
        detail: 'Do the bins and the sweep tonight so Sunday is only bags and doors. Bonfire and hot tub after.',
      },
    ],
  },
  {
    id: 4,
    dow: 'SUN',
    num: '18',
    title: 'Out slow',
    note: 'Checkout is 10:00 am, unless someone asks nicely.',
    items: [
      {
        time: '8:00 am',
        title: 'Leftovers, coffee, last soak',
        detail: 'Strip beds, run the dishwasher, sweep the mud room. Twenty minutes if everyone helps.',
      },
      {
        time: '10:00 am',
        title: 'Checkout',
        detail: 'Worth asking the host for a late one. Nobody has asked yet.',
        tag: 'someone ask',
        tagTone: 'booking',
      },
      {
        time: '2:00 pm',
        title: 'Flights out',
        detail:
          'Liv & Joe at 2:00, Jord at 3:30. Nat is not out until Monday at 2. Gas up in Belgrade, it is cheaper.',
      },
    ],
  },
]

export interface Party {
  name: string
  arrive: string
  depart: string
}

export const roster: Party[] = [
  { name: 'Nat Fam', arrive: 'Thu 12:30 pm', depart: 'Mon 2:00 pm' },
  { name: 'Han & Mal', arrive: 'Previous weekend', depart: 'Sun, flexible' },
  { name: 'Liv & Joe', arrive: 'Thu 12:30 pm', depart: 'Sun 2:00 pm' },
  { name: 'Jord Fam', arrive: 'Thu 1:20 pm', depart: 'Sun 3:30 pm' },
]

export const seedExpenses = [
  { id: 'e1', what: 'Airbnb · share', by: 'Nat Fam', amount: 902.61 },
  { id: 'e2', what: 'Airbnb · share', by: 'Han & Mal', amount: 902.61 },
  { id: 'e3', what: 'Airbnb · share', by: 'Liv & Joe', amount: 902.61 },
  { id: 'e4', what: 'Airbnb · share', by: 'Jord Fam', amount: 902.61 },
]

export type PinCategory = 'hiking' | 'fishing' | 'springs' | 'basecamp' | 'food' | 'other'

export const categories: Record<PinCategory, { label: string; color: string }> = {
  hiking: { label: 'Hiking', color: '#3C7D2F' },
  fishing: { label: 'Fishing', color: '#2C6B7A' },
  springs: { label: 'Hot springs', color: '#9A6B14' },
  basecamp: { label: 'Base camp', color: '#103606' },
  food: { label: 'Food & drink', color: '#A8432B' },
  other: { label: 'Other', color: '#5E6750' },
}

export interface SeedPin {
  id: string
  name: string
  category: PinCategory
  lat: number
  lng: number
  note: string
}

export const seedPins: SeedPin[] = [
  {
    id: 'house',
    name: 'The house',
    category: 'basecamp',
    lat: 45.4067679,
    lng: -110.691467,
    note: '17 Appaloosa Circle. Four bedrooms, seven beds, hot tub, fire pit.',
  },
  {
    id: 'bzn',
    name: 'Bozeman airport (BZN)',
    category: 'other',
    lat: 45.783499,
    lng: -111.156982,
    note: 'Everyone flies in and out of here. About an hour from the front door.',
  },
  {
    id: 'chicory',
    name: 'REAL Chicory fishing access',
    category: 'fishing',
    lat: 45.3975972,
    lng: -110.7021588,
    note: 'A mile from the house. Temporary Montana licence required, buy it online.',
  },
  {
    id: 'chico',
    name: 'Chico Hot Springs',
    category: 'springs',
    lat: 45.337714,
    lng: -110.692156,
    note: 'Twelve minutes out. $14 a soak. Pools first, dining room after.',
  },
  {
    id: 'pine-creek',
    name: 'Pine Creek Falls',
    category: 'hiking',
    lat: 45.4885737,
    lng: -110.5007518,
    note: '1.2 miles to the falls, or push on to the lake. Family friendly.',
  },
  {
    id: 'old-saloon',
    name: 'The Old Saloon',
    category: 'food',
    lat: 45.369276,
    lng: -110.734104,
    note: 'Emigrant. Cheap, twelve minutes off, open for lunch and dinner.',
  },
  {
    id: 'follow-yer-nose',
    name: 'Follow Yer Nose BBQ',
    category: 'food',
    lat: 45.369501,
    lng: -110.73492,
    note: 'Live music, outdoor seating, takes big pickup orders for under 30 people.',
  },
  {
    id: 'sage',
    name: 'Sage Lodge',
    category: 'food',
    lat: 45.355057,
    lng: -110.727003,
    note: 'The nice one. Dining room, bar and a patio, twelve minutes away.',
  },
  {
    id: 'emigrant-store',
    name: 'Emigrant General Store',
    category: 'other',
    lat: 45.3687301,
    lng: -110.7321775,
    note: 'Closest gas and milk. Anything bigger means driving to Livingston.',
  },
  {
    id: 'grizzly',
    name: 'Montana Grizzly Encounter',
    category: 'other',
    lat: 45.663969,
    lng: -110.834041,
    note: '$13.50, kids free. Between Bozeman and Livingston, so it is a free stop on the drive in.',
  },
  {
    id: 'oktoberfest',
    name: '2nd Street Oktoberfest',
    category: 'food',
    lat: 45.662387,
    lng: -110.56159,
    note: 'Downtown Livingston, Saturday 4 to 7. Twenty-five minutes from the house.',
  },
  {
    id: 'mammoth',
    name: 'Mammoth Hot Springs',
    category: 'springs',
    lat: 44.962395,
    lng: -110.714357,
    note: 'North end of Yellowstone and the closest park stop. An hour out.',
  },
  {
    id: 'midway-geyser',
    name: 'Midway Geyser Basin',
    category: 'other',
    lat: 44.525918,
    lng: -110.837603,
    note: 'Grand Prismatic. Ten minutes back up the road from Old Faithful.',
  },
  {
    id: 'old-faithful',
    name: 'Old Faithful',
    category: 'other',
    lat: 44.459626,
    lng: -110.831287,
    note: 'Farthest point in, 2 hr 30 each way. Do it first or not at all.',
  },
]
