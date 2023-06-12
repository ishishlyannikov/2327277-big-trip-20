import Observable from '../framework/observable.js';

export default class PointsModel extends Observable {
  #service = null;
  #points = [];

  constructor(service) {
    super();
    this.#service = service;
    this.#points = this.#service.getPoints();
  }

  get points() {
    return this.#points;
  }

  getById(id) {
    return this.#points.find((point) => point.id === id);
  }

  // update(updateType, update) {
  //   this.#points = this.#service.updatePoints(update);
  //   this._notify(updateType, update);
  // }

  // add(updateType, point) {
  //   this.#points = this.#service.addPoint(point);
  //   this._notify(updateType,point);
  // }

  // delete(updateType, point) {
  //   this.#points = this.#service.deletePoint(point);
  //   this._notify(updateType,point);
  // }

  update(updateType, update){
    const index = this.#points.findIndex((point) => point.id === update.id);
    this.#points = [
      ...this.#points.slice(0, index),
      update,
      ...this.#points.slice(index + 1)
    ];
    this._notify(updateType, update);
  }

  add(updateType, update){
    this.#points = [
      update,
      ...this.#points
    ];
    this._notify(updateType, update);
  }

  delete(updateType, update){
    const index = this.#points.findIndex((point) => point.id === update.id);
    this.#points = [
      ...this.#points.slice(0, index),
      ...this.#points.slice(index + 1)
    ];
    this._notify(updateType);
  }
}


