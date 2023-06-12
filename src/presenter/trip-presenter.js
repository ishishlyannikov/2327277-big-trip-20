import TripEventsListView from '../view/trip-events-list-view.js';
import SortsView from '../view/trip-sort-view.js';
import EmptyView from '../view/empty-view.js';
import PointPresenter from './point-presenter.js';
import { sortByDay, sortByPrice, sortByTime, filter } from '../utils.js';
import { render, remove, replace } from '../framework/render.js';
import { SortType, UpdateType, UserAction, FilterType } from '../const.js';
import AddNewPointPresenter from './add-new-point-presenter.js';
import NewPointButtonView from '../view/new-point-button-view.js';


export default class TripPresenter {
  #tripEventsListComponent = new TripEventsListView();
  #tripEventsListContainer = null;
  #pointsModel = null;
  #destinationsModel = null;
  #offersModel = null;
  #filterModel = null;
  #sortsView = null;
  #emptyView = null;
  #pointPresenters = new Map();
  #currentSortType = SortType.DAY;
  #filterType = FilterType.EVERYTHING;
  #addNewPointPresenter = null;
  #newPointButtonComponent = null;
  #newPointButtonContainer = null;
  #isCreating = false;

  constructor({
    tripEventsListContainer,
    pointsModel,
    destinationsModel,
    offersModel,
    filterModel,
    newPointButtonContainer
  }) {
    this.#tripEventsListContainer = tripEventsListContainer;
    this.#pointsModel = pointsModel;
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;
    this.#filterModel = filterModel;
    this.#newPointButtonContainer = newPointButtonContainer;


    this.#addNewPointPresenter = new AddNewPointPresenter({
      tripEventsListContainer:this.#tripEventsListComponent.element,
      destinationsModel:this.#destinationsModel,
      offersModel:this.#offersModel,
      onDataChange:this.#viewActionHandler,
      onDestroy:this.#newPointDestroyHandler
    });
    this.#pointsModel.addObserver(this.#modelEventHandler);
    this.#filterModel.addObserver(this.#modelEventHandler);
  }

  get points() {
    this.#filterType = this.#filterModel.filter;
    const points = this.#pointsModel.points;
    const filteredPoints = filter[this.#filterType](points);

    switch (this.#currentSortType) {
      case SortType.DAY:
        return [...sortByDay(filteredPoints)];
      case SortType.TIME:
        return [...sortByTime(filteredPoints)];
      case SortType.PRICE:
        return [...sortByPrice(filteredPoints)];
    }
    return filteredPoints;
  }


  init() {
    this.#newPointButtonComponent = new NewPointButtonView({
      onClick: this.#newPointButtonClickHandler
    });
    render(this.#newPointButtonComponent, this.#newPointButtonContainer);

    this.#renderForm();
  }

  #renderForm(){
    render(this.#tripEventsListComponent, this.#tripEventsListContainer);
    if (this.points.length === 0) {
      this.#renderEmptyPoint();
      return;
    }
    this.#renderSorts();
    this.#renderEventList();
    this.#renderPoints();
  }

  #sortTypeChangeHandler = (sortType) => {
    this.#currentSortType = sortType;

    this.#clearTripForm();
    this.#renderForm();
  };

  #renderSorts = () => {
    const prevSortComponent = this.#sortsView;
    this.#sortsView = new SortsView({
      currentSortType: this.#currentSortType,
      onSortTypeChange: this.#sortTypeChangeHandler
    });
    if (prevSortComponent) {
      replace(this.#sortsView, prevSortComponent);
      remove(prevSortComponent);
    } else {
      render(this.#sortsView, this.#tripEventsListContainer);
    }
  };

  #modeChangeHandler = () => {
    this.#pointPresenters.forEach((presenter) => presenter.resetView());
    this.#addNewPointPresenter.destroy();
  };

  #clearTripForm({resetSortType = false} = {}) {
    this.#pointPresenters.forEach((presenter) => presenter.destroy());
    this.#pointPresenters.clear();
    this.#addNewPointPresenter.destroy();
    remove(this.#sortsView);

    if (this.#emptyView) {
      remove(this.#emptyView);
    }
    if (resetSortType) {
      this.#currentSortType = SortType.DAY;
    }
  }

  #renderEmptyPoint() {
    this.#emptyView = new EmptyView({
      filterType:this.#filterType
    });
    render(this.#emptyView, this.#tripEventsListContainer);
  }

  #renderPoints(){
    this.points.forEach((point) => this.#renderPoint(point));
  }

  #renderPoint = (point) => {
    const pointPresenter = new PointPresenter({
      tripEventsListContainer: this.#tripEventsListComponent.element,
      destinationsModel: this.#destinationsModel,
      offersModel: this.#offersModel,
      changeData: this.#viewActionHandler,
      changeMode: this.#modeChangeHandler
    });
    pointPresenter.init(point);
    this.#pointPresenters.set(point.id,pointPresenter);
  };

  #renderEventList(){
    render(this.#tripEventsListComponent, this.#tripEventsListContainer);
  }

  #viewActionHandler = (actionType, updateType, update) => {
    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this.#pointsModel(updateType, update);
        break;
      case UserAction.DELETE_POINT:
        this.#pointsModel.delete(updateType, update);
        break;
      case UserAction.ADD_POINT:
        this.#pointsModel.add(updateType,update);
        break;
    }
  };

  #modelEventHandler = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#pointPresenters.get(data.id).init(data);
        break;
      case UpdateType.MINOR:
        this.#clearTripForm();
        this.#renderForm();
        break;
      case UpdateType.MAJOR:
        this.#clearTripForm({resetSortType:true});
        this.#renderForm();
        break;

    }
  };

  #newPointButtonClickHandler = () => {
    this.#isCreating = true;
    this.#currentSortType = SortType.DAY;
    this.#filterModel.set(UpdateType.MAJOR, FilterType.EVERYTHING);
    this.#newPointButtonComponent.setDisabled(true);
    this.#addNewPointPresenter.init();
  };

  #newPointDestroyHandler = (isCanceled) => {
    this.#isCreating = false;
    this.#newPointButtonComponent.setDisabled(false);
    if (isCanceled && this.points.length === 0) {
      remove(this.#sortsView);
      this.#sortsView = null;
    }
  };
}

