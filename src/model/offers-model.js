import Observable from '../framework/observable.js';

export default class OffersModel extends Observable{
  #pointsApiService = null;
  #offers = [];

  constructor ({pointsApiService}) {
    super();
    this.#pointsApiService = pointsApiService;
  }

  get offers() {
    return this.#offers;
  }

  getByType(type) {
    const offersByType = this.#offers.find((offer) => offer.type === type);
    if (offersByType) {
      return offersByType.offers;
    }
  }

  async init() {
    try {
      this.#offers = await this.#pointsApiService.offers;
    } catch(err) {
      this.#offers = [];
    }
  }
}

