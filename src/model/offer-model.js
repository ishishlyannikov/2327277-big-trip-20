import {mockOffers} from '../mock/mock-data.js';

export default class OffersModel {
  offers = mockOffers;

  getOffers() {
    return this.offers;
  }

  getByType(tripPoint) {
    return this.offers.find((offer) => offer.type === tripPoint.type).offers;
  }


}

