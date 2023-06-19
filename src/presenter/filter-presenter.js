import {render, replace, remove} from '../framework/render.js';
import FilterView from '../view/trip-filters-view.js';
import { filter } from '../utils.js';
import {UpdateType, FilterType} from '../const.js';

export default class FiltersPresenter {
  #filterElement = null;
  #filtersModel = null;
  #pointsModel = null;
  #filterComponent = null;

  constructor({ filterElement, filtersModel, pointsModel }) {
    this.#filterElement = filterElement;
    this.#filtersModel = filtersModel;
    this.#pointsModel = pointsModel;

    this.#pointsModel.addObserver(this.#handleModelEvent);
    this.#filtersModel.addObserver(this.#handleModelEvent);
  }

  get getFilterData() {
    const points = this.#pointsModel.points;

    return Object.values(FilterType).map((type) => ({
      type,
      count: filter[type](points)
    }));
  }

  init() {
    const filters = this.getFilterData;
    const prevFilterComponent = this.#filterComponent;

    this.#filterComponent = new FilterView({
      filters,
      currentFilterType: this.#filtersModel.filter,
      onFilterTypeChange: this.#handleFilterTypeChange
    });

    if (prevFilterComponent === null) {
      render(this.#filterComponent, this.#filterElement);
      return;
    }

    replace(this.#filterComponent, prevFilterComponent);
    remove(prevFilterComponent);
  }

  #handleModelEvent = () => {
    this.init();
  };

  #handleFilterTypeChange = (filterType) => {
    if (this.#filtersModel.filter === filterType) {
      return;
    }

    this.#filtersModel.setFilter(UpdateType.MAJOR, filterType);
  };
}

