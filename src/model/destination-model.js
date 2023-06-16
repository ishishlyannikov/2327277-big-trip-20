import Observable from '../framework/observable.js';

export default class DestinationsModel extends Observable{
  #pointsApiService = null;
  #destinations = [];

  constructor ({pointsApiService}) {
    super();
    this.#pointsApiService = pointsApiService;
  }

  async init(){
    this.#destinations = await this.#pointsApiService.destinations;
    return this.#destinations;
  }

  get destinations() {
    return this.#destinations;
  }

  getById(id) {
    return this.#destinations.find((destination) => destination.id === id);
  }
}
