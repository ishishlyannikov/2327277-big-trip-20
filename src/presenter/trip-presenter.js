import EditEventView from '../view/edit-event-view.js';
import TripEventsListView from '../view/trip-events-list-view.js';
import UserEventsView from '../view/user-events-view.js';
import { render } from '../render.js';


export default class TripPresenter {
  tripEventsListComponent = new TripEventsListView();

  constructor({tripEventsListContainer, pointsModel,destinationsModel, offersModel }) {
    this.tripEventsListContainer = tripEventsListContainer;
    this.pointsModel = pointsModel;
    this.destinationsModel = destinationsModel;
    this.offersModel = offersModel;

  }

  init() {
    this.tripPoints = [...this.pointsModel.getPoints()];
    this.destinations = [...this.destinationsModel.getDestinations()];

    render(this.tripEventsListComponent, this.tripEventsListContainer);

    render(new EditEventView({
      destination: this.destinationsModel.getById(this.tripPoints[0]),
      tripPoint: this.tripPoints[0],
      offers: this.offersModel.getByType(this.tripPoints[0]),
    }), this.tripEventsListComponent.getElement());

    for (let i = 1; i < this.tripPoints.length; i++) {
      const destination = this.destinationsModel.getById(this.tripPoints[i]);
      const offers = this.offersModel.getById(this.tripPoints[i]);
      render(new UserEventsView({
        point: this.tripPoints[i],
        destination: destination,
        offers: offers
      }), this.routePointListComponent.getElement());
    }

  }
}
