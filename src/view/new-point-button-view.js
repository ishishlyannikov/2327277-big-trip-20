import AbstractView from '../framework/view/abstract-view.js';

const createNewPointButtonTemplate = () => (
  '<button class="trip-main__event-add-btn  btn  btn--big  btn--yellow" type="button">New event</button>'
);

export default class NewPointButtonView extends AbstractView {
  #handleClick = null;

  constructor({ onNewEventClick }) {
    super();
    this.#handleClick = onNewEventClick;
    this.element.addEventListener('click', this.#clickHandler);
  }

  get template() {
    return createNewPointButtonTemplate();
  }

  #clickHandler = (evt) => {
    evt.preventDefault();
    this.#handleClick();
  };
}
