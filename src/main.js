import {RenderPosition, render} from './framework/render.js';
import TripInfoView from './view/trip-info-view.js';
import TripPresenter from './presenter/trip-presenter.js';
import FilterPresenter from './presenter/filter-presenter.js';
import PointsModel from './model/waypoint-model.js';
import DestinationsModel from './model/destination-model.js';
import OffersModel from './model/offer-model.js';
import FilterModel from './model/filters-model.js';
import PointsApiService from './service/points-api-service';

const AUTHORIZATION = 'Basic try75Dev23Job2023';
const END_POINT = 'https://20.ecmascript.pages.academy/big-trip';

const bodyElement = document.querySelector('body');
const headerElement = bodyElement.querySelector('.page-header');
const tripInfoElement = headerElement.querySelector('.trip-main');
const filterElement = tripInfoElement.querySelector('.trip-controls__filters');
const mainElement = bodyElement.querySelector('.page-main');
const eventListElement = mainElement.querySelector('.trip-events');

const pointsApiService = new PointsApiService(END_POINT, AUTHORIZATION);
const offersModel = new OffersModel(pointsApiService);
const destinationsModel = new DestinationsModel(pointsApiService);

const pointsModel = new PointsModel({
  service:pointsApiService,
  offersModel,
  destinationsModel
});

const filterModel = new FilterModel();

const filterPresenter = new FilterPresenter({
  filterContainer:filterElement,
  pointsModel,
  filterModel
});


const formPresenter = new TripPresenter({
  container:eventListElement,
  newPointButtonContainer:mainElement,
  pointsModel,
  destinationsModel,
  offersModel,
  filterModel
});

render(new TripInfoView(), tripInfoElement, RenderPosition.AFTERBEGIN);

formPresenter.init();
filterPresenter.init();
pointsModel.init();
