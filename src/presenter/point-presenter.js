import EditEventView from '../view/edit-event-view.js';
import PointView from '../view/point-view.js';
import { Mode } from '../const.js';
import { render, remove, replace} from '../framework/render.js';


export default class PointPresenter {
  #container = null;
  #destinationsModel = null;
  #offersModel = null;
  #changeData = null;
  #changeMode = null;
  #mode = Mode.DEFAULT;

  #pointComponent = null;
  #pointEditComponent = null;
  #point = null;

  constructor({
    container,
    destinationsModel,
    offersModel,
    changeData,
    changeMode}) {
    this.#container = container;
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;
    this.#changeData = changeData;
    this.#changeMode = changeMode;
  }

  init(point) {
    this.#point = point;

    const prevPointComponent = this.#pointComponent;
    const prevEditComponent = this.#pointEditComponent;

    this.#pointComponent = new PointView ({
      point: this.#point,
      pointDestinations: this.#destinationsModel.getById(point.destination),
      pointOffers: this.#offersModel.getByType(point.type),
      onEditClick: this.#editClickHandler,
      onFavoriteClick: this.#favoriteClickHandler
    });

    this.#pointEditComponent = new EditEventView ({
      point: this.#point,
      pointDestinations: this.#destinationsModel.destinations,
      pointOffers: this.#offersModel.offers,
      onResetClick: this.#resetButtonClickHandler,
      onSubmitClick: this.#formSubmitHandler
    });

    if (prevPointComponent === null || prevEditComponent === null) {
      render(this.#pointComponent, this.#container);
      return;
    }

    if (this.#mode === Mode.EDITING) {
      replace(this.#pointEditComponent, prevEditComponent);
    }

    if (this.#mode === Mode.DEFAULT) {
      replace(this.#pointComponent, prevPointComponent);
    }

    remove(prevPointComponent);
    remove(prevEditComponent);
  }

  resetView = () => {
    if (this.#mode !== Mode.DEFAULT) {
      this.#replaceFormToPoint();
    }
  };

  destroy = () => {
    remove(this.#pointComponent);
    remove(this.#pointEditComponent);
  };

  #replacePointToForm = () => {
    replace(this.#pointEditComponent, this.#pointComponent);
    document.addEventListener('keydown', this.#escKeyDownHandler);
    this.#changeMode();
    this.#mode = Mode.EDITING;
  };

  #replaceFormToPoint = () => {
    replace(this.#pointComponent, this.#pointEditComponent);
    document.removeEventListener('keydown', this.#escKeyDownHandler);
    this.#mode = Mode.DEFAULT;
  };

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.#replaceFormToPoint();
    }
  };

  #editClickHandler = () => {
    this.#replacePointToForm();
  };

  #favoriteClickHandler = () => {
    this.#changeData({
      ...this.#point,
      isFavorite: !this.#point.isFavorite
    });
  };

  #resetButtonClickHandler = () => {
    this.#replaceFormToPoint();
  };

  #formSubmitHandler = (point) => {
    this.#changeData(point);
    this.#replaceFormToPoint();
  };
}
