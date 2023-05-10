import { DESTINATIONS, DESCRIPTIONS, TRIP_OFFERS } from '../const.js';
import { getRandomArrayElement } from '../utils.js';

const point = [ {
  'basePrice': 1100,
  'dateFrom': '2019-07-10T22:55:56.845Z',
  'dateTo': '2019-07-11T11:22:13.375Z',
  'destination': '1',
  'isFavorite': false,
  'offers': ['2'],
  'type': 'Taxi',
},
{
  'basePrice': 1300,
  'dateFrom': '2019-07-10T22:55:56.845Z',
  'dateTo': '2019-07-11T11:22:13.375Z',
  'destination': '2',
  'isFavorite': true,
  'offers': ['1'],
  'type': 'Flight',
},
{
  'basePrice': 1200,
  'dateFrom': '2019-07-10T22:55:56.845Z',
  'dateTo': '2019-07-11T11:22:13.375Z',
  'destination': '3',
  'isFavorite': true,
  'offers': ['1'],
  'type': 'Train',
},
{
  'basePrice': 1800,
  'dateFrom': '2019-07-10T22:55:56.845Z',
  'dateTo': '2019-07-11T11:22:13.375Z',
  'destination': '4',
  'isFavorite': true,
  'offers': ['1'],
  'type': 'Ship',
},
];

const extraOffers = [
  {
    type: 'Taxi',
    offers: [
      {
        id: '11',
        title: getRandomArrayElement(TRIP_OFFERS),
        price: 350
      },
      {
        id: '12',
        title: getRandomArrayElement(TRIP_OFFERS),
        price: 45
      }
    ]
  },
  {
    type: 'Flight',
    offers: [
      {
        id: '13',
        title: getRandomArrayElement(TRIP_OFFERS),
        price: 400
      },
      {
        id: '14',
        title: getRandomArrayElement(TRIP_OFFERS),
        price: 450
      },
      {
        id: '15',
        title: getRandomArrayElement(TRIP_OFFERS),
        price: 30
      }
    ]
  },
  {
    type: 'Check-in',
    offers: [
      {
        id: '16',
        title: getRandomArrayElement(TRIP_OFFERS),
        price: 100
      },
      {
        id: '17',
        title: getRandomArrayElement(TRIP_OFFERS),
        price: 45
      }
    ]
  },
];

const destinations = [
  {
    id: '21',
    description:getRandomArrayElement(DESCRIPTIONS),
    name: getRandomArrayElement(DESTINATIONS),
    pictures: [
      {
        srс: 'https://loremflickr.com/248/152?random=2',
        description: 'Event photo'
      },
      {
        srс: 'https://loremflickr.com/248/152?random=3',
        description: 'Event photo'
      }
    ]
  },
  {
    id: '22',
    description: getRandomArrayElement(DESCRIPTIONS),
    name: getRandomArrayElement(DESTINATIONS),
    pictures: [
      {
        srс: 'https://loremflickr.com/248/152?random=1',
        description: 'Event photo'
      },
      {
        srс: 'https://loremflickr.com/248/152?random=5',
        description: 'Event photo'
      }
    ]
  },
  {
    id: '23',
    description: getRandomArrayElement(DESCRIPTIONS),
    name: getRandomArrayElement(DESTINATIONS),
    pictures: [
      {
        srс: 'https://loremflickr.com/248/152?random=1',
        description: 'Event photo'
      },
      {
        srс: 'https://loremflickr.com/248/152?random=5',
        description: 'Event photo'
      }
    ]
  },
  {
    id: '24',
    description: getRandomArrayElement(DESCRIPTIONS),
    name: getRandomArrayElement(DESTINATIONS),
    pictures: [
      {
        srс: 'https://loremflickr.com/248/152?random=1',
        description: 'Event photo'
      },
      {
        srс: 'https://loremflickr.com/248/152?random=5',
        description: 'Event photo'
      }
    ]
  }
];


export function getPoint(){
  return getRandomArrayElement(point);
}

export function getOffer() {
  return getRandomArrayElement(extraOffers);
}

export function getDestination() {
  return destinations;
}
