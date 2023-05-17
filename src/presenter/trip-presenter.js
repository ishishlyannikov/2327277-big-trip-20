import EditEventView from '../view/edit-event-view.js';
import TripEventsListView from '../view/trip-events-list-view.js';
import UserEventsView from '../view/user-events-view.js';
import { render } from '../render.js';

export default class TripPresenter {
  tripEventsListComponent = new TripEventsListView();

  constructor({
    tripEventsListContainer,
    pointsModel,
    destinationsModel,
    offersModel }) {
    this.tripEventsListContainer = tripEventsListContainer;
    this.pointsModel = pointsModel;
    this.destinationsModel = destinationsModel;
    this.offersModel = offersModel;
  }

  init() {
    this.tripPoints = [...this.pointsModel.getTripPoints()];
    this.destinations = [...this.destinationsModel.getDestinations()];

    render(this.tripEventsListComponent, this.tripEventsListContainer);

    render(
      new EditEventView({
        destination: this.destinationsModel.getById(this.tripPoints[0]),
        point: this.tripPoints[0],
        offers: this.offersModel.getByType(this.tripPoints[0]),
      }),
      this.tripEventsListComponent.getElement()
    );

    this.tripPoints.forEach((point) => {
      render(new UserEventsView({
        point,
        destination:this.destinationsModel.getById(point.destination),
        offers: this.offersModel.getByType(point.type)
      }),
      this.eventListComponent.getElement()
      );
    });
  }
}


