import {RenderPosition, render} from './framework/render.js';
import TripPresenter from './presenter/trip-presenter.js';
import FiltersPresenter from './presenter/filter-presenter.js';
import PointsModel from './model/points-model.js';
import DestinationsModel from './model/destinations-model.js';
import OffersModel from './model/offers-model.js';
import FiltersModel from './model/filters-model.js';
import PointsApiService from './service/points-api-service.js';
import NewPointButtonView from './view/new-point-button-view.js';

const AUTHORIZATION = 'Basic try75Dev24Job2023';
const END_POINT = 'https://20.ecmascript.pages.academy/big-trip';

const bodyElement = document.querySelector('body');
const headerElement = bodyElement.querySelector('.page-header');
const tripInfoElement = headerElement.querySelector('.trip-main');
const filterElement = tripInfoElement.querySelector('.trip-controls__filters');
const mainElement = bodyElement.querySelector('.page-main');
const eventListElement = mainElement.querySelector('.trip-events');

const pointsApiService = new PointsApiService(END_POINT, AUTHORIZATION);
const offersModel = new OffersModel({pointsApiService});
const destinationsModel = new DestinationsModel({pointsApiService});

const pointsModel = new PointsModel({
  pointsApiService:pointsApiService,
  offersModel,
  destinationsModel
});

const filtersModel = new FiltersModel();

const filtersPresenter = new FiltersPresenter({ filterElement, filtersModel, pointsModel });

const formPresenter = new TripPresenter({
  headerContainer: tripInfoElement,
  filtersModel,
  waypointListContainer: eventListElement,
  destinationsModel,
  offersModel,
  pointsModel,
  onNewPointDestroy: handleNewPointFormClose,
  addPointButtonStatus: addPointButtonStatus
});

const addNewWaypointComponent = new NewPointButtonView({ onNewEventClick: handleAddNewWaypoint });

function handleAddNewWaypoint() {
  formPresenter.createWaypoint();
  addPointButtonStatus(true);
}

function handleNewPointFormClose() {
  addPointButtonStatus(false);
}

function addPointButtonStatus(value) {
  addNewWaypointComponent.element.disabled = value;
}
render(addNewWaypointComponent, tripInfoElement, RenderPosition.BEFOREEND);

formPresenter.init();
filtersPresenter.init();
pointsModel.init();
