import EditEventView from '../view/edit-event-view.js';
import TripEventsListView from '../view/trip-events-list-view.js';
import UserEventsView from '../view/user-events-view.js';
import { render } from '../render.js';


export default class TripPresenter {
  tripEventsListComponent = new TripEventsListView();

  constructor({tripEventsListContainer, pointsModel }) {
    this.tripEventsListContainer = tripEventsListContainer;
    this.pointsModel = pointsModel;
  }

  init() {
    this.tripPoints = [...this.pointsModel.getPoints()];
    this.pointsOffers = [...this.pointsModel.getOffers()];
    this.pointsDestinations = [...this.pointsModel.getDestinations()];
    render(this.tripEventsListComponent, this.tripEventsListContainer);
    render(new EditEventView({point: this.tripPoints[0], offer: this.pointsOffers,
      destination:this.pointsDestinations}),this.tripEventsListComponent.getElement());

    for(let i = 0; i < this.tripPoints.length; i++){
      render(new UserEventsView({point: this.tripPoints[i],offer: this.pointsOffers,
        destination:this.pointsDestinations}),this.tripEventsListComponent.getElement());
    }
  }
}
