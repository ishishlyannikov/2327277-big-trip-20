import Observable from '../framework/observable.js';

export default class OffersModel extends Observable{
  #pointsApiService = null;
  #offers = [];

  constructor ({pointsApiService}) {
    super();
    this.#pointsApiService = pointsApiService;
  }

  async init() {
    this.#offers = await this.#pointsApiService.offers;
    return this.#offers;
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

  getByIds(offersByType, ids){
    return [...offersByType.filter((offer) => ids.find((id) => offer.id === id))];
  }
}


