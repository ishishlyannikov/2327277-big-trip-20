import { filter } from '../utils.js';

export function generateFilter(points) {
  return Object.entries(filter).map(
    ([filterType, filterPoints]) => ({
      type: filterType,
      hasPoints: filterPoints(points).length > 0,
    }),
  );
}

