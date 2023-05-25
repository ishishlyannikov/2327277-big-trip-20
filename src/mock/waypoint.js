import { getRandomInteger} from '../utils.js';
import { Price } from '../const.js';
import { getDate } from './time.js';

export function generatePoint (type, destinationId, offerIds) {
  return {
    id: crypto.randomUUID(),
    basePrice: getRandomInteger(Price.MIN, Price.MAX),
    dateFrom: getDate({next: false}),
    dateTo: getDate({next: true}),
    destination: destinationId,
    isFavourite: !!getRandomInteger(0,1),
    offers: offerIds,
    type
  };
}
