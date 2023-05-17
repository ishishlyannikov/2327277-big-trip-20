import {mockTripPoints} from '../mock/mock-data.js';


export default class PointsModel {
  tripPoints = mockTripPoints;

  getTripPoints() {
    return this.tripPoints;
  }

}
