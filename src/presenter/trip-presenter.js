import EditEventView from '../view/edit-event-view.js';
import TripEventsListView from '../view/trip-events-list-view.js';
import UserEventsView from '../view/user-events-view.js';
import { render } from '../render.js';

export default class TripPresenter {
  tripEventsListComponent = new TripEventsListView();

  constructor({tripEventsListContainer}) {
    this.tripEventsListContainer = tripEventsListContainer;
  }

  init() {
    render(this.tripEventsListComponent, this.tripEventsListContainer);
    render(new EditEventView(), this.tripEventsListComponent.getElement());

    for (let i = 0; i < 3; i++) {
      render(new UserEventsView(), this.tripEventsListComponent.getElement());
    }
  }
}
