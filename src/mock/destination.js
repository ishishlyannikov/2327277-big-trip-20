import { getRandomArrayElement } from '../utils.js';
import { DESTINATIONS, DESCRIPTIONS } from '../const.js';

export function generateDestination () {
  const city = getRandomArrayElement(DESTINATIONS);

  return {
    id: crypto.randomUUID(),
    name: city,
    description: DESCRIPTIONS,
    pictures: [
      {
        src: `https://loremflickr.com/248/152?random=${crypto.randomUUID()}`,
        description: `${city} description`
      }
    ]
  };
}
