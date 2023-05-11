import {mockTripPoints} from '../mock/mock-data.js';

export default class PointsModel {
  tripPoints = mockTripPoints;

  getRoutePoints() {
    return this.tripPoints;
  }

}
