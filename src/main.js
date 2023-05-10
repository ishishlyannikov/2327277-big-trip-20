import { render, RenderPosition } from './render.js';
import SortView from './view/trip-sort-view.js';
import FilterView from './view/trip-filters-view.js';
import TripInfoView from './view/trip-info-view.js';
import TripPresenter from './presenter/trip-presenter.js';
import PointsModel from './model/model.js';

const tripInfoElement = document.querySelector('.trip-main');
const filterElement = document.querySelector('.trip-controls__filters');
const sortElement = document.querySelector('.trip-events');
const pointsModel = new PointsModel();

const formPresenter = new TripPresenter({tripEventsListContainer:sortElement,pointsModel});

render(new TripInfoView(), tripInfoElement, RenderPosition.AFTERBEGIN);
render(new FilterView(), filterElement);
render(new SortView(), sortElement);

formPresenter.init();
