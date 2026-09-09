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
  url: string
  images: string[]
  guests: number
  bedrooms: number
  beds: number
  bathrooms: number
}

export const listing: Listing = {
  title: 'Yellowstone Paradise Valley Home',
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

export interface ItineraryItem {
  id: string
  time: string
  title: string
  detail: string
  tag?: string
  tagTone?: 'water' | 'trail' | 'booking' | 'meal'
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
    note: 'Everyone on the ground by 1:30. Nobody plans anything ambitious.',
    items: [
      {
        id: 'thu-land-1230',
        time: '12:30 pm',
        title: 'Nat Fam and Liv & Joe land',
        detail:
          'Both parties touch down at BZN at 12:30. Han and Mal are already in from the previous weekend, so they are the ones holding coffee.',
      },
      {
        id: 'thu-land-120',
        time: '1:20 pm',
        title: 'Jord Fam lands',
        detail: 'Last flight in. Everyone is on the ground by 1:30, which is the whole point of the early start.',
      },
      {
        id: 'thu-van',
        time: '1:45 pm',
        title: 'Pick up the van',
        detail:
          'Nothing else fits four families and the kids. Still a question mark on the sheet, so somebody has to actually book it.',
        tag: 'not booked yet',
        tagTone: 'booking',
      },
      {
        id: 'thu-shop',
        time: '2:00 pm',
        title: 'The big shop',
        detail:
          'Last real store before the valley. Walmart or Costco pickup order so it is bagged and waiting, or have it delivered. Open question on the sheet: whether we can route the order to Jared\u2019s when Nat grabs his car.',
        tag: 'someone order ahead',
        tagTone: 'booking',
      },
      {
        id: 'thu-checkin',
        time: '4:00 pm',
        title: 'Check in at the house',
        detail:
          'Bedroom draw happens on the porch, not over text. Four bedrooms, seven beds, four baths. Hot tub on immediately.',
      },
      {
        id: 'thu-fire',
        time: '6:00 pm',
        title: 'Bonfire and hot tub',
        detail: 'Everyone has been travelling with kids since dawn. Sit outside and do nothing.',
      },
      {
        id: 'thu-dinner',
        time: '7:00 pm',
        title: 'Dinner, in or out',
        detail:
          'Still undecided on the sheet. If we go out, everything is under fifteen minutes: the Old Saloon, Follow Yer Nose, or Sage if we feel like the nice one. Takeout counts.',
        tag: 'undecided',
        tagTone: 'booking',
      },
    ],
  },
  {
    id: 2,
    dow: 'FRI',
    num: '16',
    title: 'Hike, soak, stay in',
    note: 'All three meals at the house. Nothing further out than 24 minutes.',
    items: [
      {
        id: 'fri-breakfast',
        time: '8:00 am',
        title: 'Breakfast at the house',
        detail: 'Slow start. The hike is short and the falls do not get busy.',
        tag: 'meal: in',
        tagTone: 'meal',
      },
      {
        id: 'fri-pine-creek',
        time: '9:30 am',
        title: 'Pine Creek Falls',
        detail:
          '24 minutes out. 1.2 miles to the falls and back if the kids are done, up to ten if anyone has the legs for it.',
        tag: 'easy \u00b7 family',
        tagTone: 'trail',
      },
      {
        id: 'fri-lunch',
        time: '12:30 pm',
        title: 'Lunch and snacks at the house',
        detail: 'Back for lunch, then Nino naps. The afternoon does not start until he is up.',
        tag: 'meal: in',
        tagTone: 'meal',
      },
      {
        id: 'fri-chico',
        time: '2:30 pm',
        title: 'Chico Hot Springs',
        detail:
          'Twelve minutes down the valley. $14 a soak. Pools first, and the bar and dining room are right there if anyone wants to stay on.',
        tag: '$14 a head',
        tagTone: 'booking',
      },
      {
        id: 'fri-dinner',
        time: '6:30 pm',
        title: 'Dinner at the house',
        detail: 'Cook in. Nobody wants a second drive after the springs.',
        tag: 'meal: in',
        tagTone: 'meal',
      },
      {
        id: 'fri-fire',
        time: '8:00 pm',
        title: 'Bonfire and hot tub',
        detail: 'Same as every night. The sun is behind the ridge before 7, so bring the puffy out with you.',
      },
    ],
  },
  {
    id: 3,
    dow: 'SAT',
    num: '17',
    title: 'River, then Oktoberfest',
    note: 'The one day with something actually scheduled.',
    items: [
      {
        id: 'sat-breakfast',
        time: '9:00 am',
        title: 'Easy morning, breakfast in',
        detail: 'No alarm. The river is a mile away and it is not going anywhere.',
        tag: 'meal: in',
        tagTone: 'meal',
      },
      {
        id: 'sat-river',
        time: '11:00 am',
        title: 'Fly fish, rock hunt, river access',
        detail:
          'Chicory access is a mile from the front door. Temporary Montana licences online the night before. Rock hunting for anyone not holding a rod, and Nino naps through the middle of it.',
        tag: 'licence needed',
        tagTone: 'water',
      },
      {
        id: 'sat-oktoberfest',
        time: '4:00 pm',
        title: '2nd Street Oktoberfest, Livingston',
        detail:
          'Runs 4 to 7 in downtown Livingston, 25 minutes from the house. Dinner downtown after. Open question from the group chat: do we secretly sign the men up for the stein competition?',
        tag: '4\u20137 pm \u00b7 dinner out',
        tagTone: 'booking',
      },
      {
        id: 'sat-fire',
        time: '8:30 pm',
        title: 'Bonfire and hot tub',
        detail: 'Last real night. Make it count or go to bed, no judgement either way.',
      },
      {
        id: 'sat-trash',
        time: '9:30 pm',
        title: 'Trash out and a sweep',
        detail: 'Do the bins and the tidy tonight so Sunday is only bags and doors.',
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
        id: 'sun-breakfast',
        time: '8:00 am',
        title: 'Breakfast in, last soak',
        detail: 'Strip beds, run the dishwasher, sweep the mud room. Twenty minutes if everyone helps.',
        tag: 'meal: in',
        tagTone: 'meal',
      },
      {
        id: 'sun-checkout',
        time: '10:00 am',
        title: 'Checkout',
        detail: 'Worth asking the host for a late one. Nobody has asked yet.',
        tag: 'someone ask',
        tagTone: 'booking',
      },
      {
        id: 'sun-lunch',
        time: '12:00 pm',
        title: 'Lunch out on the way north',
        detail:
          'The only meal the sheet has down as out. Livingston or Bozeman, depending on how the flights stack up.',
        tag: 'meal: out',
        tagTone: 'meal',
      },
      {
        id: 'sun-flights',
        time: '2:00 pm',
        title: 'Flights out',
        detail:
          'Liv & Joe at 2:00, Jord at 3:30. Han and Mal are flexible, Sunday morning or afternoon. Gas up in Belgrade, it is cheaper.',
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

export interface Member {
  name: string
  party: string
}

export const members: Member[] = [
  { name: 'Natalie', party: 'Nat Fam' },
  { name: 'Gordy', party: 'Nat Fam' },
  { name: 'Hannah', party: 'Han & Mal' },
  { name: 'Mallory', party: 'Han & Mal' },
  { name: 'Liv', party: 'Liv & Joe' },
  { name: 'Joe', party: 'Liv & Joe' },
  { name: 'Jordan', party: 'Jord Fam' },
  { name: 'Tim', party: 'Jord Fam' },
]

export const partyFor = (name: string) =>
  members.find((member) => member.name === name)?.party ?? roster[0].name

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

export interface DriveTime {
  label: string
  value: string
}

export interface SeedPin {
  id: string
  name: string
  category: PinCategory
  lat: number
  lng: number
  note: string
}

export interface Place {
  id: string
  name: string
  category: PinCategory
  note: string
  /** Omitted for somewhere that only earns a line in the drive list, like the town itself. */
  lat?: number
  lng?: number
  /** Set to put it on the House tab's drive list. `minutes` only orders that list. */
  drive?: { label: string; value: string; minutes: number }
}

/**
 * Every known spot, once. The map pins and the drive-time list are both derived from this,
 * so a place is added, edited or dropped in exactly one edit rather than three.
 */
export const places: Place[] = [
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
    drive: { label: 'Bozeman airport', value: '1 hr', minutes: 60 },
  },
  {
    id: 'chicory',
    name: 'Chicory fishing access',
    category: 'fishing',
    lat: 45.3975972,
    lng: -110.7021588,
    note: 'A mile from the house. Temporary Montana licence required, buy it online.',
    drive: { label: 'Chicory fishing access', value: '1 mile', minutes: 2 },
  },
  {
    id: 'chico',
    name: 'Chico Hot Springs',
    category: 'springs',
    lat: 45.337714,
    lng: -110.692156,
    note: 'Twelve minutes out. $14 a soak. Pools first, dining room after.',
    drive: { label: 'Chico Hot Springs', value: '12 min', minutes: 12 },
  },
  {
    id: 'pine-creek',
    name: 'Pine Creek Falls',
    category: 'hiking',
    lat: 45.4885737,
    lng: -110.5007518,
    note: '1.2 miles to the falls, up to ten if anyone wants the full day. Family friendly.',
    drive: { label: 'Pine Creek Falls', value: '24 min', minutes: 24 },
  },
  {
    id: 'old-saloon',
    name: 'The Old Saloon',
    category: 'food',
    lat: 45.369276,
    lng: -110.734104,
    note: 'Emigrant, twelve minutes off. $, open for lunch and dinner.',
  },
  {
    id: 'follow-yer-nose',
    name: 'Follow Yer Nose BBQ',
    category: 'food',
    lat: 45.369501,
    lng: -110.73492,
    note:
      '$, live music and outdoor seating, twelve minutes off. Takes big pickup orders for under 30 people. Their second spot is a food wagon at the Yellowstone entrance.',
  },
  {
    id: 'sage',
    name: 'Sage Lodge',
    category: 'food',
    lat: 45.355057,
    lng: -110.727003,
    note: '$$$, the nice one. Dining room, bar and a patio, twelve minutes away.',
  },
  {
    id: 'emigrant-store',
    name: 'Emigrant General Store',
    category: 'other',
    lat: 45.3687301,
    lng: -110.7321775,
    note: 'Closest gas and milk. Anything bigger means driving to Livingston.',
    drive: { label: 'Emigrant general store', value: '15 min', minutes: 15 },
  },
  {
    // No pin: a marker for the town would land on top of the Oktoberfest one downtown.
    id: 'livingston',
    name: 'Livingston',
    category: 'other',
    note: 'The nearest real town. Groceries, gas and the Saturday Oktoberfest.',
    drive: { label: 'Livingston', value: '25 min', minutes: 25 },
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
    drive: { label: 'Mammoth Hot Springs', value: '1 hr', minutes: 60 },
  },
  {
    id: 'midway-geyser',
    name: 'Midway Geyser Basin',
    category: 'other',
    lat: 44.525918,
    lng: -110.837603,
    note: 'Grand Prismatic. Ten minutes back up the road from Old Faithful.',
    drive: { label: 'Midway Geyser Basin', value: '2 hr 20', minutes: 140 },
  },
  {
    id: 'old-faithful',
    name: 'Old Faithful',
    category: 'other',
    lat: 44.459626,
    lng: -110.831287,
    note: 'Farthest point in, 2 hr 30 each way. Do it first or not at all.',
    drive: { label: 'Old Faithful', value: '2 hr 30', minutes: 150 },
  },
]

const hasCoords = (place: Place): place is Place & { lat: number; lng: number } =>
  place.lat !== undefined && place.lng !== undefined

export const seedPins: SeedPin[] = places
  .filter(hasCoords)
  .map(({ id, name, category, lat, lng, note }) => ({ id, name, category, lat, lng, note }))

export const driveTimes: DriveTime[] = places
  .flatMap((place) => (place.drive ? [place.drive] : []))
  .sort((a, b) => a.minutes - b.minutes)
  .map(({ label, value }) => ({ label, value }))
