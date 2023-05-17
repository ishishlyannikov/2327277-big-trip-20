import { getRandomArrayElement } from '../utils.js';
import { TRIP_OFFERS } from '../const.js';

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
