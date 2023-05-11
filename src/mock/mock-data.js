import { DESCRIPTIONS, DESTINATIONS, TRIP_OFFERS } from '../const.js';
import { getRandomArrayElement } from '../utils.js';

export const mockDestinations = [
  {
    id: '1',
    description: getRandomArrayElement(DESCRIPTIONS),
    name: getRandomArrayElement(DESTINATIONS),
    pictures: [
      {
        src: 'https://loremflickr.com/248/152?random=35',
        description: getRandomArrayElement(DESCRIPTIONS)
      },
      {
        src: 'https://loremflickr.com/248/152?random=45',
        description: getRandomArrayElement(DESCRIPTIONS)
      }
    ]
  },
  {
    id: '2',
    description: getRandomArrayElement(DESCRIPTIONS),
    name: getRandomArrayElement(DESTINATIONS),
    pictures: [
      {
        src: 'https://loremflickr.com/248/152?random=45',
        description: getRandomArrayElement(DESCRIPTIONS)
      },
      {
        src: 'https://loremflickr.com/248/152?random=12',
        description: getRandomArrayElement(DESCRIPTIONS)
      }
    ]
  },
  {
    id: '3',
    description: getRandomArrayElement(DESCRIPTIONS),
    name: getRandomArrayElement(DESTINATIONS),
    pictures: [
      {
        src: 'https://loremflickr.com/248/152?random=11',
        description: getRandomArrayElement(DESCRIPTIONS)
      },
      {
        src: 'https://loremflickr.com/248/152?random=1',
        description: getRandomArrayElement(DESCRIPTIONS)
      }
    ]
  },
];

export const mockOffers = [
  {
    type: 'taxi',
    offers: [
      {
        id: '1',
        title: getRandomArrayElement(TRIP_OFFERS),
        price: 350
      },
      {
        id: '2',
        title: getRandomArrayElement(TRIP_OFFERS),
        price: 45
      }
    ]
  },
  {
    type: 'flight',
    offers: [
      {
        id: '1',
        title: getRandomArrayElement(TRIP_OFFERS),
        price: 400
      },
      {
        id: '2',
        title: getRandomArrayElement(TRIP_OFFERS),
        price: 450
      },
      {
        id: '3',
        title: getRandomArrayElement(TRIP_OFFERS),
        price: 30
      }
    ]
  },
  {
    type: 'check-in',
    offers: [
      {
        id: '1',
        title: getRandomArrayElement(TRIP_OFFERS),
        price: 100
      },
      {
        id: '2',
        title: getRandomArrayElement(TRIP_OFFERS),
        price: 45
      }
    ]
  }
];

export const mockTripPoints = [
  {
    id: '1',
    basePrice: 1100,
    dateFrom: new Date('2019-07-10T22:55:56.845Z'),
    dateTo: new Date('2019-07-11T11:22:13.375Z'),
    destination: mockDestinations[0].id,
    isFavorite: false,
    offers: ['1'],
    type: 'taxi'
  },
  {
    id: '2',
    basePrice: 1200,
    dateFrom: new Date('2019-03-10T22:55:56.845Z'),
    dateTo: new Date('2019-04-11T11:22:13.375Z'),
    destination: mockDestinations[1].id,
    isFavorite: true,
    offers: ['1','2'],
    type: 'flight'
  },
  {
    id: '3',
    basePrice: 500,
    dateFrom: new Date('2019-05-11T22:55:56.845Z'),
    dateTo: new Date('2019-05-12T11:22:13.375Z'),
    destination: mockDestinations[2].id,
    isFavorite: false,
    offers: ['2'],
    type: 'check-in'
  },

];
