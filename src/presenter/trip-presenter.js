import EditEventView from '../view/edit-event-view.js';
import TripEventsListView from '../view/trip-events-list-view.js';
import PointView from '../view/point-view.js';
import SortsView from '../view/trip-sort-view.js';
import EmptyView from '../view/empty-view.js';
import { render, replace, remove } from '../framework/render.js';

export default class TripPresenter {
  #tripEventsListComponent = new TripEventsListView();
  #tripEventsListContainer = null;
  #pointsModel = null;
  #destinationsModel = null;
  #offersModel = null;
  #points = [];

  constructor({
    tripEventsListContainer,
    pointsModel,
    destinationsModel,
    offersModel
  }) {
    this.#tripEventsListContainer = tripEventsListContainer;
    this.#pointsModel = pointsModel;
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;
    this.#points = [...this.#pointsModel.points];
  }

  init() {
    const sortsView = new SortsView();

    render(sortsView, this.#tripEventsListContainer);

    if (!this.#points.length) {
      remove(sortsView);
      render(new EmptyView(), this.#tripEventsListContainer);

      return;
    }

    render(this.#tripEventsListComponent, this.#tripEventsListContainer);

    this.#points.forEach((point) => {
      this.#renderPoint({
        point,
        pointDestinations: this.#destinationsModel.getById(point.destination),
        pointOffers: this.#offersModel.getByType(point.type)
      });
    });
  }

  #renderPoint({point, pointDestinations, pointOffers}) {
    const escKeyDownHandler = (evt) => {
      if (evt.key === 'Escape') {
        evt.preventDefault();
        closeForm();
      }
    };

    const pointComponent = new PointView({
      point,
      pointDestinations,
      pointOffers,
      onEditClick: () => {
        replacePointToEditForm();
        document.addEventListener('keydown', escKeyDownHandler);
      }
    });

    const editPointComponent = new EditEventView({
      point,
      pointDestinations,
      pointOffers,
      onFormSubmit: () => {
        closeForm();
      },
      onCloseEditClick: () => {
        closeForm();
      }
    });

    function replacePointToEditForm() {
      replace(editPointComponent, pointComponent);
    }

    function replaceEditFormToPoint() {
      replace(pointComponent, editPointComponent);
    }

    function closeForm() {
      replaceEditFormToPoint();
      document.removeEventListener('keydown', escKeyDownHandler);
    }

    render(pointComponent, this.#tripEventsListComponent.element);
  }
}
