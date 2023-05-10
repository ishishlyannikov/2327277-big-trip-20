import { getPoint, getOffer, getDestination } from '../mock/mock-data.js';
import { POINTS_COUNT } from '../const.js';

export default class PointsModel {
  point = Array.from({length: POINTS_COUNT},getPoint);
  offer = Array.from({length: POINTS_COUNT},getOffer);
  destination = getDestination();

  getPoints(){
    return this.point;
  }

  getOffers(){
    return this.offer;
  }

  getDestinations(){
    return this.destination;
  }
}
