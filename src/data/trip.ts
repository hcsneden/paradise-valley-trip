export type PlaceKind = 'lodging' | 'food' | 'activity' | 'supplies' | 'travel'

export interface Place {
  id: string
  name: string
  kind: PlaceKind
  lat: number
  lng: number
  driveFromHouse?: string
  price?: string
  link?: string
  mapsLink?: string
  meals?: string
  inPark?: boolean
  notes?: string
}

export const trip = {
  name: 'Paradise Valley',
  subtitle: 'Livingston, Montana',
  arrive: 'Thursday, October 15, 2026',
  depart: 'Sunday, October 18, 2026',
  checkIn: 'Check-in after 4:00 PM Thursday',
  checkOut: 'Checkout by 10:00 AM Sunday',
  address: '17 Appaloosa Circle, Livingston, MT 59047',
  guidebook: 'https://www.airbnb.com/s/guidebooks?refinement_paths[]=/guidebooks/6234225',
  hostNote:
    'The area is very rural. Stop for supplies in Bozeman or Livingston before heading out to the house. Basic essentials are already there: coffee, tea, oil, flour, sugar and spices. A small grocery store and gas station is about 15 minutes away in Emigrant.',
}

export interface Listing {
  title: string
  location: string
  url: string
  images: string[]
  guests: number | null
  bedrooms: number | null
  beds: number | null
  bathrooms: number | string | null
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
    'https://a0.muscache.com/im/pictures/prohost-api/Hosting-968919791124925451/original/d2171f26-f89d-4a78-9550-6cc73ca1745e.jpeg?im_w=1200',
    'https://a0.muscache.com/im/pictures/prohost-api/Hosting-968919791124925451/original/9de17bac-7817-41b7-8e19-c4153964f38c.jpeg?im_w=1200',
    'https://a0.muscache.com/im/pictures/prohost-api/Hosting-968919791124925451/original/ae37d1de-109e-4ed9-9766-c4fa69937faf.jpeg?im_w=1200',
    'https://a0.muscache.com/im/pictures/prohost-api/Hosting-968919791124925451/original/4bf21660-7041-4461-983d-e7e289a76489.jpeg?im_w=1200',
  ],
  guests: 12,
  bedrooms: 4,
  beds: 7,
  bathrooms: 4,
}

export const places: Place[] = [
  {
    id: 'house',
    name: 'The House',
    kind: 'lodging',
    lat: 45.4067679,
    lng: -110.691467,
    notes: '17 Appaloosa Circle, Livingston, MT 59047',
  },
  {
    id: 'bzn',
    name: 'Bozeman Yellowstone Airport (BZN)',
    kind: 'travel',
    lat: 45.783499,
    lng: -111.156982,
    driveFromHouse: '~1 hr',
    notes: 'Everyone flies in and out of here.',
  },
  {
    id: 'sage',
    name: 'Sage Lodge',
    kind: 'food',
    meals: 'Dinner',
    price: '$$$',
    lat: 45.355057,
    lng: -110.727003,
    driveFromHouse: '12 min',
    link: 'https://www.airbnb.com/things-to-do/places/t-g-ChIJKbf1uMPtT1MRpVZyNe9zpWo',
    notes: 'Indoor dining room, a bar area and an outdoor patio.',
  },
  {
    id: 'old-saloon',
    name: 'The Old Saloon',
    kind: 'food',
    meals: 'Lunch / Dinner',
    price: '$',
    lat: 45.369276,
    lng: -110.734104,
    driveFromHouse: '12 min',
    link: 'https://www.google.com/search?q=the+old+saloon+emigrant+montana',
  },
  {
    id: 'follow-yer-nose',
    name: 'Follow Yer Nose BBQ',
    kind: 'food',
    meals: 'Lunch / Dinner',
    price: '$',
    lat: 45.369501,
    lng: -110.73492,
    driveFromHouse: '12 min',
    link: 'https://www.google.com/search?q=follow+your+nose+bbq+gardiner+mt',
    notes:
      'Live music and outdoor seating. Takes large pickup orders for under 30 people. They also run a food wagon at the entrance to Yellowstone.',
  },
  {
    id: 'emigrant-store',
    name: 'Emigrant General Store & Sinclair',
    kind: 'supplies',
    lat: 45.3687301,
    lng: -110.7321775,
    driveFromHouse: '15 min',
    mapsLink: 'https://www.google.com/maps/place/Emigrant+General+Store/@45.36873,-110.7326369,20z',
    notes: 'Closest gas and general store. Anything bigger means driving to Livingston.',
  },
  {
    id: 'chicory',
    name: 'REAL Chicory Fishing Access',
    kind: 'activity',
    lat: 45.3975972,
    lng: -110.7021588,
    driveFromHouse: '1 mile',
    price: 'Temporary fishing license required',
    link: 'https://myfwp.mt.gov/fishMT/fas/39753510',
    notes: 'Fly fishing access on the Yellowstone, essentially walking distance from the house.',
  },
  {
    id: 'chico',
    name: 'Chico Hot Springs',
    kind: 'activity',
    lat: 45.337714,
    lng: -110.692156,
    driveFromHouse: '12 min',
    price: '$14 per person',
    link: 'https://www.chicohotsprings.com/soak',
    mapsLink: 'https://maps.app.goo.gl/qGobDnFmCKme8xpt5',
  },
  {
    id: 'pine-creek',
    name: 'Pine Creek Falls',
    kind: 'activity',
    lat: 45.4885737,
    lng: -110.5007518,
    driveFromHouse: '24 min',
    link: 'https://www.google.com/search?q=pine+creek+waterfall+montana',
    notes: 'Family friendly hike to a waterfall. 1.2 miles up to 10 miles depending on preference.',
  },
  {
    id: 'grizzly',
    name: 'Montana Grizzly Encounter',
    kind: 'activity',
    lat: 45.663969,
    lng: -110.834041,
    driveFromHouse: '35 min',
    price: '$13.50, kids free',
    link: 'https://www.grizzlyencounter.org/',
    mapsLink: 'https://maps.app.goo.gl/BN3CQiY6x1ezduZcA',
    notes: 'Between Bozeman and Livingston, so it works as a stop on the drive in from the airport.',
  },
  {
    id: 'oktoberfest',
    name: '2nd Street Oktoberfest, Livingston',
    kind: 'activity',
    lat: 45.662387,
    lng: -110.56159,
    driveFromHouse: '25 min',
    price: 'Saturday Oct 17, 4-7 PM',
    link: 'https://www.explorelivingstonmt.com/oktoberfest',
    notes: 'Open question from the sheet: do we secretly sign the men up for the stein competition?',
  },
  {
    id: 'old-faithful',
    inPark: true,
    name: 'Old Faithful',
    kind: 'activity',
    lat: 44.459626,
    lng: -110.831287,
    driveFromHouse: '2 hr 30 min',
    notes: 'The farthest point into the park. Do this first if you go.',
  },
  {
    id: 'midway-geyser',
    inPark: true,
    name: 'Midway Geyser Basin',
    kind: 'activity',
    lat: 44.525918,
    lng: -110.837603,
    driveFromHouse: '2 hr 20 min',
    notes: 'About 10 minutes before Old Faithful on the way in.',
  },
  {
    id: 'mammoth',
    inPark: true,
    name: 'Mammoth Hot Springs',
    kind: 'activity',
    lat: 44.962395,
    lng: -110.714357,
    driveFromHouse: '1 hr',
    notes: 'North end of the park and the closest Yellowstone stop to the house.',
  },
]

export interface ItineraryDay {
  day: string
  date: string
  anchor?: string
  items: string[]
  openQuestions?: string[]
}

export const itinerary: ItineraryDay[] = [
  {
    day: 'Thursday',
    date: 'October 15',
    anchor: 'Check-in after 4:00 PM',
    items: [
      'Everyone flies into Bozeman, arrivals between 12:30 and 1:20 PM',
      'Grab pickup grocery orders or arrange delivery',
      'Montana Grizzly Encounter on the way to the house',
      'Settle in at the house. Bonfire and hot tub.',
    ],
  },
  {
    day: 'Friday',
    date: 'October 16',
    anchor: 'Yellowstone day, or a local day',
    items: [
      'Up early to get into the park',
      'Old Faithful first since it is farthest, then Midway Geyser Basin, then Mammoth Hot Springs on the way back',
      'Dinner on the drive back or cook at the house',
    ],
    openQuestions: [
      'Five to six hours in the car is a lot for a short trip, especially with the kids. The alternative is a local day: fly fishing, rock hunting and exploring close to the house.',
    ],
  },
  {
    day: 'Saturday',
    date: 'October 17',
    anchor: 'Oktoberfest in Livingston, 4-7 PM',
    items: [
      'Quick hike in the morning',
      'Fly fishing near the house over lunch or after naps',
      '2nd Street Oktoberfest in downtown Livingston, 4-7 PM',
      'Clean up and take out trash',
      'Bonfire and hot tub',
    ],
    openQuestions: ['Big night out for dinner, or keep it chill at the house?'],
  },
  {
    day: 'Sunday',
    date: 'October 18',
    anchor: 'Checkout by 10:00 AM',
    items: ['Pack up and clear out', 'Departures from Bozeman through the afternoon'],
    openQuestions: ['Can we ask the host for a late checkout?'],
  },
]

export interface Party {
  name: string
  arrive: string
  depart: string
}

export const parties: Party[] = [
  { name: 'Nat Fam', arrive: 'Thursday, 12:30 PM', depart: 'Monday, 2:00 PM' },
  { name: 'Han & Mal', arrive: 'Previous weekend', depart: 'Sunday morning or afternoon (flexible)' },
  { name: 'Liv & Joe', arrive: 'Thursday, 12:30 PM', depart: 'Sunday, 2:00 PM' },
  { name: 'Jord Fam', arrive: 'Thursday, 1:20 PM', depart: 'Sunday, 3:30 PM' },
]

export interface Expense {
  label: string
  perParty: number | null
  total: number | null
}

export const expenses: Expense[] = [
  { label: 'Airbnb', perParty: 902.61, total: 3610.44 },
  { label: 'Sprinter van', perParty: null, total: null },
  { label: 'Groceries', perParty: null, total: null },
  { label: 'Booze', perParty: null, total: null },
]

export const openThreads = [
  'Do a Walmart or Costco online order for pickup so it is ready when we land?',
  'How far is Jared from a grocery store? Could we ship an order to his house when we pick up his car?',
  'Friday: full Yellowstone day, or stay local and fish?',
  'Ask the host about a late checkout on Sunday.',
]
