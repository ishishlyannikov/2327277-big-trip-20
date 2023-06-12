import {RenderPosition, render} from './framework/render.js';
// import FilterView from './view/trip-filters-view.js';
import TripInfoView from './view/trip-info-view.js';
import TripPresenter from './presenter/trip-presenter.js';
import FilterPresenter from './presenter/filter-presenter.js';
import PointsModel from './model/waypoint-model.js';
import DestinationsModel from './model/destination-model.js';
import OffersModel from './model/offer-model.js';
import FilterModel from './model/filters-model.js';
import MockService from './service/mock-service.js';
// import { generateFilter } from './mock/filter.js';


const bodyElement = document.querySelector('body');
const headerElement = bodyElement.querySelector('.page-header');
const tripInfoElement = headerElement.querySelector('.trip-main');
const filterElement = tripInfoElement.querySelector('.trip-controls__filters');
const mainElement = bodyElement.querySelector('.page-main');
const eventListElement = mainElement.querySelector('.trip-events');

const mockService = new MockService();
const pointsModel = new PointsModel(mockService);
const destinationsModel = new DestinationsModel(mockService);
const offersModel = new OffersModel(mockService);
const filterModel = new FilterModel();
// const filters = generateFilter(pointsModel.points);

const filterPresenter = new FilterPresenter({
  container:filterElement,
  pointsModel,
  filterModel
});


const formPresenter = new TripPresenter({
  tripEventsListContainer:eventListElement,
  pointsModel,
  destinationsModel,
  offersModel,
  filterModel
});

render(new TripInfoView(), tripInfoElement, RenderPosition.AFTERBEGIN);
// render(new FilterView({filters}), filterElement);

formPresenter.init();
filterPresenter.init();
