import TripEventsListView from '../view/trip-events-list-view.js';
import SortsView from '../view/trip-sort-view.js';
import EmptyView from '../view/empty-view.js';
import PointPresenter from './point-presenter.js';
import { updatePoint } from '../utils.js';
import { render } from '../framework/render.js';


export default class TripPresenter {
  #tripEventsListComponent = new TripEventsListView();
  #tripEventsListContainer = null;
  #pointsModel = null;
  #destinationsModel = null;
  #offersModel = null;
  #points = [];
  #sortsView = new SortsView;
  #emptyView = new EmptyView;
  #pointPresenters = new Map();

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
    this.#renderForm();
  }

  #renderForm(){
    render(this.#tripEventsListComponent, this.#tripEventsListContainer);
    if (this.#points.length === 0) {
      this.#renderEmptyPoint();
      return;
    }
    this.#renderSorts();
    this.#renderEventList();
  }

  #pointChangeHandler = (updatedPoint) => {
    this.#points = updatePoint(this.#points, updatedPoint);
    this.#pointPresenters.get(updatedPoint.id).init(updatedPoint);
  };

  #modeChangeHandler = () => {
    this.#pointPresenters.forEach((presenter) => presenter.resetView());
  };

  #renderSorts() {
    render(this.#sortsView, this.#tripEventsListContainer);
  }

  #renderEmptyPoint() {
    render(this.#emptyView, this.#tripEventsListContainer);
  }

  #renderPoints(){
    this.#points.forEach((point) => this.#renderPoint(point));
  }

  #renderPoint = (point) => {
    const pointPresenter = new PointPresenter({
      container: this.#tripEventsListComponent.element,
      destinationsModel: this.#destinationsModel,
      offersModel: this.#offersModel,
      changeData: this.#pointChangeHandler,
      changeMode: this.#modeChangeHandler
    });
    pointPresenter.init(point);
    this.#pointPresenters.set(point.id,pointPresenter);
  };

  #renderEventList(){
    render(this.#tripEventsListComponent, this.#tripEventsListContainer);

    this.#renderPoints();
  }

}

