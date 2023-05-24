import {RenderPosition, render} from './framework/render.js';
import FilterView from './view/trip-filters-view.js';
import TripInfoView from './view/trip-info-view.js';
import TripPresenter from './presenter/trip-presenter.js';
import PointsModel from './model/waypoint-model.js';
import DestinationsModel from './model/destination-model.js';
import OffersModel from './model/offer-model.js';
import MockService from './service/mock-service.js';

const tripInfoElement = document.querySelector('.trip-main');
const filterElement = document.querySelector('.trip-controls__filters');
const sortElement = document.querySelector('.trip-events');
const mockService = new MockService();
const pointsModel = new PointsModel(mockService);
const destinationsModel = new DestinationsModel(mockService);
const offersModel = new OffersModel(mockService);

const formPresenter = new TripPresenter({
  tripEventsListContainer:sortElement,
  pointsModel,
  destinationsModel,
  offersModel
});

render(new TripInfoView(), tripInfoElement, RenderPosition.AFTERBEGIN);
render(new FilterView(), filterElement);

formPresenter.init();
