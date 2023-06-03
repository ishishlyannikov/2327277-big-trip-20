import TripEventsListView from '../view/trip-events-list-view.js';
import SortsView from '../view/trip-sort-view.js';
import EmptyView from '../view/empty-view.js';
import PointPresenter from './point-presenter.js';
import { updatePoint, sortByDay, sortByPrice, sortByTime } from '../utils.js';
import { render, remove } from '../framework/render.js';
import { SortType } from '../const.js';


export default class TripPresenter {
  #tripEventsListComponent = new TripEventsListView();
  #tripEventsListContainer = null;
  #pointsModel = null;
  #destinationsModel = null;
  #offersModel = null;
  #points = [];
  #sortsView = null;
  #emptyView = new EmptyView;
  #pointPresenters = new Map();
  #currentSortType = SortType.DAY;
  #sourcedListPoints = [];

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
    this.#sourcedListPoints = [...this.#pointsModel.points];
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
    this.#sourcedListPoints = updatePoint(this.#sourcedListPoints, updatedPoint);
    this.#pointPresenters.get(updatedPoint.id).init(updatedPoint);
  };

  #sortTypeChangeHandler = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }
    this.#sortPoints(sortType);
    this.#clearPointList();
    this.#renderPoints();
    this.#renderSorts();
  };

  #sortPoints(sortType) {
    switch (sortType) {
      case SortType.DAY:
        this.#points.sort(sortByDay);
        break;
      case SortType.TIME:
        this.#points.sort(sortByTime);
        break;
      case SortType.PRICE:
        this.#points.sort(sortByPrice);
        break;
      default:
        this.#points = [...this.#sourcedListPoints];
    }

    this.#currentSortType = sortType;
  }

  #renderSorts = () => {
    this.#sortsView = new SortsView({
      currentSortType: this.#currentSortType,
      onSortTypeChange: this.#sortTypeChangeHandler
    });

    render(this.#sortsView, this.#tripEventsListContainer);
  };

  #modeChangeHandler = () => {
    this.#pointPresenters.forEach((presenter) => presenter.resetView());
  };

  #clearPointList() {
    this.#pointPresenters.forEach((presenter) => presenter.destroy());
    this.#pointPresenters.clear();
    remove(this.#sortsView);
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
    this.#renderSorts();
    this.#renderPoints();
  }

}

