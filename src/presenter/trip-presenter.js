import TripEventsListView from '../view/trip-events-list-view.js';
import SortsView from '../view/trip-sort-view.js';
import EmptyView from '../view/empty-view.js';
import LoadingView from '../view/loading-view.js';
import PointPresenter from './point-presenter.js';
import AddNewPointPresenter from './add-new-point-presenter.js';
import { sortByDay, sortByPrice, sortByTime, filter } from '../utils.js';
import { render, remove, RenderPosition } from '../framework/render.js';
import { SortType, UpdateType, UserAction, FilterType, TimeLimit } from '../const.js';
import TripInfoView from '../view/trip-info-view.js';
import ErrorView from '../view/error-view.js';
import UiBlocker from '../framework/ui-blocker/ui-blocker.js';

export default class TripPresenter {
  #headerContainer = null;
  #waypointListComponent = new TripEventsListView();
  #loadingComponent = new LoadingView();
  #sortComponent = null;
  #emptyPointComponent = null;

  #waypointListContainer = null;
  #destinationsModel = null;
  #offersModel = null;
  #pointsModel = null;
  #filtersModel = null;

  #pointPresenters = new Map();
  #newPointPresenter = null;

  #currentSortType = SortType.DAY;
  #filterType = FilterType.EVERYTHING;
  #isLoading = true;

  #tripInfoComponent = null;

  #errorComponent = new ErrorView();
  #isError = false;
  #addPointButtonStatus = null;

  #uiBlocker = new UiBlocker({
    lowerLimit: TimeLimit.LOWER_LIMIT,
    upperLimit: TimeLimit.UPPER_LIMIT
  });

  constructor ({
    headerContainer,
    waypointListContainer,
    destinationsModel,
    offersModel,
    pointsModel,
    filtersModel,
    onNewPointDestroy,
    addPointButtonStatus
  }) {
    this.#headerContainer = headerContainer;
    this.#waypointListContainer = waypointListContainer;
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;
    this.#pointsModel = pointsModel;
    this.#filtersModel = filtersModel;

    this.#newPointPresenter = new AddNewPointPresenter({
      pointListContainer: this.#waypointListComponent.element,
      destinations: this.#destinationsModel.destinations,
      offers: this.#offersModel.offers,
      onDataChange: this.#handleViewAction,
      onDestroy: onNewPointDestroy,
    });

    this.#addPointButtonStatus = addPointButtonStatus;
    this.#filtersModel.addObserver(this.#handleModelEvent);
    this.#pointsModel.addObserver(this.#handleModelEvent);
  }

  get points() {
    this.#filterType = this.#filtersModel.filter;
    const points = this.#pointsModel.points;
    const filteredPoints = filter[this.#filterType](points);
    switch (this.#currentSortType) {
      case SortType.TIME:
        return filteredPoints.sort(sortByTime);
      case SortType.PRICE:
        return filteredPoints.sort(sortByPrice);
    }
    return filteredPoints.sort(sortByDay) ;
  }

  init() {
    this.#renderForm();
  }

  createWaypoint() {
    this.#currentSortType = SortType.DAY;
    this.#filtersModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);

    if (this.points.length === 0) {
      remove(this.#emptyPointComponent);
      render(this.#waypointListComponent, this.#waypointListContainer);
    }

    this.#newPointPresenter.init(this.#destinationsModel.destinations, this.#offersModel.offers);
  }

  #renderPoint = (point) => {
    const pointPresenter = new PointPresenter({
      waypointListContainer: this.#waypointListComponent.element,
      destinationsModel: this.#destinationsModel,
      offersModel: this.#offersModel,
      onDataChange: this.#handleViewAction,
      onModeChange: this.#handleModeChange
    });
    pointPresenter.init(point);
    this.#pointPresenters.set(point?.id, pointPresenter);
  };

  #renderLoading = () => {
    render(this.#loadingComponent, this.#waypointListContainer);
  };

  #clearPointList = ({resetSortType = false} = {}) => {
    this.#pointPresenters.forEach((presenter) => presenter.destroy());
    this.#pointPresenters.clear();
    this.#newPointPresenter.destroy();
    remove(this.#sortComponent);
    remove(this.#tripInfoComponent);
    remove(this.#loadingComponent);
    if (this.#emptyPointComponent) {
      remove(this.#emptyPointComponent);
    }

    if(resetSortType){
      this.#currentSortType = SortType.DAY;
    }
  };

  #renderSort = () => {
    if(this.#isError){
      return;
    }
    this.#sortComponent = new SortsView({
      currentSortType: this.#currentSortType,
      onSortTypeChange: this.#handleSortTypeChange
    });
    render(this.#sortComponent, this.#waypointListContainer, RenderPosition.AFTERBEGIN);
  };

  #renderEmptyPoint = () => {
    this.#emptyPointComponent = new EmptyView({filterType: this.#filterType});
    render(this.#emptyPointComponent, this.#waypointListContainer);
  };

  #renderPoints = (points) => {
    points.forEach((point) => this.#renderPoint(point));
  };

  #renderForm = () => {
    if (this.#isLoading) {
      this.#renderLoading();
      this.#addPointButtonStatus(true);
      return;
    }

    if(this.#isError || !this.#destinationsModel.destinations || !this.#destinationsModel.destinations.length || !this.#offersModel.offers){
      this.#renderError();
      remove(this.#sortComponent);
      this.#addPointButtonStatus(true);
      return;
    }

    this.#addPointButtonStatus(false);
    const points = this.points;
    const pointCount = points.length;

    if (pointCount === 0) {
      this.#renderEmptyPoint();
    } else {
      this.#renderTripInfo();
    }
    render(this.#waypointListComponent, this.#waypointListContainer);
    this.#renderSort();
    this.#renderPoints(points);
  };

  #renderTripInfo = () => {
    const allPoints = [...this.#pointsModel.points].sort(sortByDay);
    if(!allPoints.length){
      return '';
    }
    this.#tripInfoComponent = new TripInfoView(allPoints, this.#destinationsModel.destinations, this.#offersModel.offers);
    render(this.#tripInfoComponent, this.#headerContainer, RenderPosition.AFTERBEGIN);
  };

  #renderError = () => {
    render(this.#errorComponent, this.#waypointListContainer);
  };

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }
    this.#currentSortType = sortType;
    this.#clearPointList();
    this.#renderForm();
  };

  #handleViewAction = async (actionType, updateType, update) => {
    this.#uiBlocker.block();

    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this.#pointPresenters.get(update.id).setSaving();
        try {
          await this.#pointsModel.updatePoint(updateType, update);
        } catch(err) {
          this.#pointPresenters.get(update.id).setAborting();
        }
        break;
      case UserAction.ADD_POINT:
        this.#newPointPresenter.setSaving();
        try {
          await this.#pointsModel.addPoint(updateType, update);
        } catch(err) {
          this.#newPointPresenter.setAborting();
        }
        break;
      case UserAction.DELETE_POINT:
        this.#pointPresenters.get(update.id).setDeleting();
        try {
          await this.#pointsModel.deletePoint(updateType, update);
        } catch(err) {
          this.#pointPresenters.get(update.id).setAborting();
        }
        break;
    }

    this.#uiBlocker.unblock();
  };

  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#pointPresenters.get(data.id).init(data);
        remove(this.#tripInfoComponent);
        this.#renderTripInfo();
        break;
      case UpdateType.MINOR:
        this.#clearPointList();
        this.#renderForm();
        break;
      case UpdateType.MAJOR:
        this.#clearPointList({resetSortType: true});
        this.#renderForm();
        break;
      case UpdateType.INIT:
        this.#isLoading = false;
        remove(this.#loadingComponent);
        this.#renderForm();
        break;
      case UpdateType.INIT_ERROR:{
        this.#isLoading = false;
        this.#isError = true;
        remove(this.#loadingComponent);
        this.#clearPointList();
        this.#renderForm();
        break;
      }
    }
  };

  #handleModeChange = () => {
    this.#newPointPresenter.destroy();
    this.#pointPresenters.forEach((presenter) => presenter.resetView());
  };
}
