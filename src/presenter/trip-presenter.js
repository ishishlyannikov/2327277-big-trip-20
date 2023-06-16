import TripEventsListView from '../view/trip-events-list-view.js';
import SortsView from '../view/trip-sort-view.js';
import EmptyView from '../view/empty-view.js';
import LoadingView from '../view/loading-view.js';
import PointPresenter from './point-presenter.js';
import { sortByDay, sortByPrice, sortByTime, filter } from '../utils.js';
import { render, remove, replace, RenderPosition } from '../framework/render.js';
import { SortType, UpdateType, UserAction, FilterType } from '../const.js';
import AddNewPointPresenter from './add-new-point-presenter.js';
import NewPointButtonView from '../view/new-point-button-view.js';

export default class TripPresenter {
  #eventListComponent = new TripEventsListView();
  #loadingComponent = new LoadingView();
  #sortComponent = null;
  #emptyPointComponent = null;
  #newPointButton = null;
  #newPointButtonContainer = null;

  #container = null;
  #destinationsModel = null;
  #offersModel = null;
  #pointsModel = null;
  #filterModel = null;

  #pointPresenters = new Map();
  #newPointPresenter = null;

  #currentSortType = SortType.DAY;
  #filterType = FilterType.EVERYTHING;
  #isCreating = false;
  #isLoading = true;

  constructor({
    container,
    newPointContainer,
    destinationsModel,
    offersModel,
    pointsModel,
    filterModel,
  }){
    this.#container = container;
    this.#newPointButtonContainer = newPointContainer;
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;
    this.#pointsModel = pointsModel;
    this.#filterModel = filterModel;

    this.#newPointPresenter = new AddNewPointPresenter({
      eventListContainer: this.#eventListComponent.element,
      destinationsModel: this.#destinationsModel,
      offersModel: this.#offersModel,
      onDataChange: this.#handleViewAction,
      onDestroy: this.#handleNewPointDestroy
    });

    this.#pointsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  get points(){
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

  init(){
    // this.#newPointButton = new NewPointButtonView({
    //   onClick: this.#handleNewPointButtonClick
    // });
    // render(this.#newPointButton, this.#newPointButtonContainer);

    this.#renderForm();
  }

  #renderForm(){

    if(this.#isLoading){
      this.#renderLoading();
      return;
    }
    if (this.points.length === 0) {
      this.#renderEmptyPoint();
      return;
    }
    this.#renderSort();
    this.#renderPointsList();
    this.#renderPoints(this.points);
  }

  createPoint(){
    this.#currentSortType = SortType.DAY;
    this.#filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
    this.#newPointPresenter.init();
  }

  #handleNewPointButtonClick = () => {
    this.#isCreating = true;
    this.createPoint();
    this.#newPointButton.setDisabled(true);
  };

  #renderPoint(point){
    const pointPresenter = new PointPresenter({
      container: this.#eventListComponent.element,
      destinationsModel: this.#destinationsModel,
      offersModel: this.#offersModel,
      onDataChange: this.#handleViewAction,
      onModeChange: this.#handleModeChange
    });

    pointPresenter.init(point);

    this.#pointPresenters.set(point.id, pointPresenter);
  }

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#currentSortType = sortType;

    this.#clearForm();
    this.#renderForm();
  };

  #handleViewAction = (actionType, updateType, update) => {
    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this.#pointsModel.update(updateType, update);
        break;
      case UserAction.ADD_POINT:
        this.#pointsModel.add(updateType, update);
        break;
      case UserAction.DELETE_POINT:
        this.#pointsModel.delete(updateType,update);
        break;
    }
  };

  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#pointPresenters.get(data.id).init(data);
        break;
      case UpdateType.MINOR:
        this.#clearForm();
        this.#renderForm();
        break;
      case UpdateType.MAJOR:
        this.#clearForm({resetSortType: true});
        this.#renderForm();
        break;
      case UpdateType.INIT:
        this.#isLoading = false;
        remove(this.#loadingComponent);
        this.#renderForm();
        break;
    }
  };

  #renderLoading(){
    render(this.#loadingComponent, this.#container, RenderPosition.BEFOREEND);
  }

  #handleModeChange = () => {
    this.#newPointPresenter.destroy();
    this.#pointPresenters.forEach((presenter) => presenter.resetView());
  };

  #clearPointList(){
    this.#newPointPresenter.destroy();
    this.#pointPresenters.forEach((presenter) => presenter.destroy());
    this.#pointPresenters.clear();
  }

  #clearForm({resetSortType = false} = {}){
    this.#clearPointList();

    remove(this.#sortComponent);

    if(this.#emptyPointComponent){
      remove(this.#emptyPointComponent);
    }

    if(this.#loadingComponent){
      remove(this.#loadingComponent);
    }

    if(resetSortType){
      this.#currentSortType = SortType.DAY;
    }
  }

  #renderSort() {
    const prevSortComponent = this.#sortComponent;

    this.#sortComponent = new SortsView({
      currentSortType: this.#currentSortType,
      onSortTypeChange: this.#handleSortTypeChange
    });

    if(prevSortComponent){
      replace(this.#sortComponent, prevSortComponent);
      remove(prevSortComponent);
    }else{
      render(this.#sortComponent, this.#container);
    }

    render(this.#sortComponent, this.#container, RenderPosition.BEFOREEND);
  }

  #renderEmptyPoint(){
    this.#emptyPointComponent = new EmptyView({
      filterType: this.#filterType
    });
    render(this.#emptyPointComponent, this.#container, RenderPosition.BEFOREEND);
  }

  #renderPoints(points){
    points.forEach((point) => this.#renderPoint(point));
  }

  #renderPointsList(){
    render(this.#eventListComponent, this.#container);
  }

  #handleNewPointDestroy = () => {
    this.#isCreating = false;
    this.#newPointButton.setDisabled(false);
  };
}

