import { mockDestinations } from '../mock/mock-data.js';

export default class DestinationsModel {
  destinations = mockDestinations;

  getDestinations() {
    return this.destinations;
  }

  getById(tripPoint) {
    return this.destinations.find((destination) => destination.id === tripPoint.id);
  }

}

