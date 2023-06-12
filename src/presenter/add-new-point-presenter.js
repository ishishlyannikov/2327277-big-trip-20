import { remove, render, RenderPosition } from '../framework/render.js';
import {nanoid} from 'nanoid';
import EditEventView from '../view/edit-event-view.js';
import { UserAction, UpdateType, EditType } from '../const.js';

export default class AddNewPointPresenter {
  #tripEventsListComponent = null;
  #handleDataChange = null;
  #handleDestroy = null;
  #destinationsModel = null;
  #offersModel = null;

  #pointEditComponent = null;

  constructor({tripEventsListComponent, onDataChange, onDestroy, destinationsModel, offersModel}) {
    this.#tripEventsListComponent = tripEventsListComponent;
    this.#handleDataChange = onDataChange;
    this.#handleDestroy = onDestroy;
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;
  }

  init() {
    // const allDestinations = [...this.#destinationsModel.destinations];
    // const allOffers = [...this.#offersModel.offers];

    if (this.#pointEditComponent !== null) {
      return;
    }

    // this.#pointEditComponent = new EditEventView({
    //   onFormSubmit: this.#handleFormSubmit,
    //   allDestinations: allDestinations,
    //   allOffers: allOffers,
    //   onDeleteClick: this.#handleDeleteClick,
    //   onCancelClick: this.#handleCancelClick,
    //   isCreatingMode: true
    // });

    this.#pointEditComponent = new EditEventView({
      destinations: this.#destinationsModel.destinations,
      offers: this.#offersModel.offers,
      onFormSubmit: this.#handleFormSubmit,
      onDeleteClick: this.#handleDeleteClick,
      onCancelClick: this.#handleCancelClick,
      type: EditType.CREATING
    });

    render(this.#pointEditComponent, this.#tripEventsListComponent, RenderPosition.AFTERBEGIN);

    document.addEventListener('keydown', this.#escKeyDownHandler);
  }

  destroy() {
    if (this.#pointEditComponent === null) {
      return;
    }

    this.#handleDestroy();

    remove(this.#pointEditComponent);
    this.#pointEditComponent = null;

    document.removeEventListener('keydown', this.#escKeyDownHandler);
  }

  #handleFormSubmit = (point) => {
    this.#handleDataChange(
      UserAction.ADD_POINT,
      UpdateType.MINOR,
      {id: nanoid(), ...point},
    );
    this.destroy();
  };

  #handleDeleteClick = () => {
    this.destroy();
  };

  #handleCancelClick = () => {
    this.destroy();
  };

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.destroy();
    }
  };
}
