import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import { WAYPOINT_TYPES, DEFAULT_POINT, EditType } from '../const.js';
import { getDestination } from '../utils.js';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import he from 'he';

const createEventTypesTemplate = (pointType, id, isDisabled) =>
  WAYPOINT_TYPES.map((type) =>
    `<div class="event__type-item">
      <input id="event-type-${type.toLowerCase()}-${id}" class="event__type-input  visually-hidden" type="radio" name="event-type"
        value="${type.toLowerCase()}"
        ${pointType.toLowerCase() === type.toLowerCase() ? 'checked' : ''}
        ${isDisabled ? 'disabled' : ''}
      />
      <label class="event__type-label  event__type-label--${type.toLowerCase()}"
        for="event-type-${type.toLowerCase()}-${id}">${type}
      </label>
    </div>`
  ).join('');

const createPicturesTemplate = (pictures) => {
  if(!pictures || pictures.length === 0){
    return '';
  }
  return`<div class="event__photos-container">
    <div class="event__photos-tape">
      ${pictures.map((picture) => `<img class="event__photo" src=${picture.src} alt=${picture.alt}>`)}
  </div>`;
};

const createControlsTemplate = (editType, isDisabled, isSaving, isDeleting) => {

  const getResetButtonText = () => {
    if(editType === EditType.EDITING) {
      return isDeleting ? 'Deleting...' : 'Delete';
    }
    return 'Cancel';
  };

  return `
    <button class="event__save-btn  btn  btn--blue" type="submit" ${isDisabled ? 'disabled' : ''}>
      ${isSaving ? 'Saving...' : 'Save'}
    </button>
    <button class="event__reset-btn" type="reset" ${isDisabled ? 'disabled' : ''}>
      ${getResetButtonText()}
    </button>
    ${editType === EditType.EDITING ? `<button class="event__rollup-btn" type="button" >
      <span class="visually-hidden">Open event</span>
    </button>` : ''}`;
};

const createEditEventTemplate = ({point, pointDestinations, pointOffers, editType}) => {
  const { basePrice, dateFrom, dateTo, destination, type, id, isDisabled, isSaving, isDeleting } = point;

  const currentPoint = getDestination(destination, pointDestinations);
  const pointType = type !== '' ? type.toLowerCase() : DEFAULT_POINT;
  const typeListTemplate = createEventTypesTemplate(pointType.toLowerCase(), id, isDisabled);
  const controlsTemplate = createControlsTemplate(editType, isDisabled, isSaving, isDeleting);

  const getOffersByType = (offersByType) => pointOffers?.find((offer) => offer.type.toLowerCase() === offersByType)?.offers;
  const extraOffers = getOffersByType(type.toLowerCase());

  const offersList = extraOffers?.map((offer) => `
      <div class="event__offer-selector">
        <input class="event__offer-checkbox  visually-hidden"
          id="${offer.id}" type="checkbox" name="event-offer-luggage"
          data-offer-id="${offer.id}"
          ${point.offers.includes(offer.id) ? 'checked' : ''}
          ${isDisabled ? 'disabled' : ''}
        />
        <label class="event__offer-label" for="${offer.id}">
          <span class="event__offer-title">${he.encode(offer.title)}</span>
          &plus;&euro;&nbsp;
          <span class="event__offer-price">${he.encode(offer.price.toString())}</span>
        </label>
      </div>`)
    .join('');

  return(`
  <li class="trip-events__item">
    <form class="event event--edit" action="#" method="post">
      <header class="event__header">
        <div class="event__type-wrapper">
          <label class="event__type  event__type-btn" for="event-type-toggle-${id}">
            <span class="visually-hidden">Choose event type</span>
            <img class="event__type-icon" width="17" height="17" src="img/icons/${pointType}.png" alt="Event ${pointType} icon">
          </label>
          <input class="event__type-toggle  visually-hidden"
            id="event-type-toggle-${id}" type="checkbox"
            ${isDisabled ? 'disabled' : ''}
          />
          <div class="event__type-list">
            <fieldset class="event__type-group">
              <legend class="visually-hidden">Event type</legend>
                ${typeListTemplate}
            </fieldset>
          </div>
        </div>
        <div class="event__field-group  event__field-group--destination">
          <label class="event__label  event__type-output" for="event-destination-${id}">
            ${pointType}
          </label>
          <input class="event__input  event__input--destination"
            id="event-destination-${id}" type="text" name="event-destination"
            value="${currentPoint ? he.encode(currentPoint.name) : ''}"
            list="destination-list-${id}"
            ${isDisabled ? 'disabled' : ''}
          />
          <datalist id="destination-list-${id}">
            ${pointDestinations?.map((item) => `<option value="${he.encode(item.name)}"></option>`).join('')}
          </datalist>
        </div>

        <div class="event__field-group  event__field-group--time">
          <label class="visually-hidden" for="event-start-time-${id}">From</label>
          <input class="event__input  event__input--time"
            id="event-start-time-${id}" type="text" name="event-start-time"
            value="${dateFrom}"}
            ${isDisabled ? 'disabled' : ''}
          />
          &mdash;
          <label class="visually-hidden" for="event-end-time-${id}">To</label>
          <input class="event__input  event__input--time"
            id="event-end-time-${id}" type="text" name="event-end-time"
            value="${dateTo}"
            ${isDisabled ? 'disabled' : ''}
          />
        </div>

        <div class="event__field-group  event__field-group--price">
          <label class="event__label" for="event-price-${id}">
            <span class="visually-hidden">Price</span>
            &euro;
          </label>
          <input class="event__input  event__input--price" id="event-price-${id}"
            type="text" name="event-price"
            value="${he.encode(basePrice.toString())}"
            ${isDisabled ? 'disabled' : ''}
          />
        </div>
        ${controlsTemplate}
      </header>
      <section class="event__details">
        ${(extraOffers && extraOffers.length) ? `<section class="event__section  event__section--offers">
          <h3 class="event__section-title  event__section-title--offers">Offers</h3>
          <div class="event__available-offers">
            ${offersList}
          </div>
        </section>` : ''}
        ${currentPoint ? `<section class="event__section  event__section--destination">
          <h3 class="event__section-title  event__section-title--destination">Destination</h3>
          <p class="event__destination-description">${he.encode(currentPoint.description)}</p>
          ${createPicturesTemplate(currentPoint.pictures)}
        </section>
      </section>` : ''}
    </form>
  </li>`
  );
};

export default class EditPointView extends AbstractStatefulView {

  #destinations = null;
  #offers = null;
  #handleFormSubmit = null;
  #handleFormReset = null;
  #handleDeleteClick = null;
  #datepickerFrom = null;
  #datepickerTo = null;
  #editType = null;

  constructor({
    pointDestinations,
    point = DEFAULT_POINT,
    pointOffers,
    onSubmit,
    onReset,
    onDelete,
    editType
  }) {
    super();
    this.#destinations = pointDestinations;
    this._setState(EditPointView.parsePointToState(point));
    this.#offers = pointOffers;
    this.#handleFormSubmit = onSubmit;
    this.#handleFormReset = onReset;
    this.#handleDeleteClick = onDelete;
    this.#editType = editType;

    this._restoreHandlers();
  }

  get template() {
    return createEditEventTemplate({
      point: this._state,
      pointDestinations: this.#destinations,
      pointOffers: this.#offers,
      editType: this.#editType});
  }

  removeElement() {
    super.removeElement();

    if (this.#datepickerFrom) {
      this.#datepickerFrom.destroy();
      this.#datepickerFrom = null;
    }
    if (this.#datepickerTo) {
      this.#datepickerTo.destroy();
      this.#datepickerTo = null;
    }
  }

  reset = (point) => this.updateElement({point});

  _restoreHandlers() {
    this.#setInnerHandlers();
    this.element.querySelector('.event--edit').addEventListener('submit', this.#submitFormHandler);
    this.element.querySelector('.event--edit').addEventListener('reset', this.#resetFormHandler);
  }

  #setInnerHandlers = () => {
    if (this.#editType === EditType.EDITING) {
      this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#resetFormHandler);
      this.element.querySelector('.event__reset-btn').addEventListener('click', this.#deleteFormHandler);
    }

    this.element.querySelector('.event__input--price').addEventListener('input', this.#changePriceHandler);
    this.element.querySelector('.event__input--destination').addEventListener('change', this.#changeDestinationHandler);
    this.element.querySelector('.event__type-group').addEventListener('change', this.#changeTypeHandler);

    this.#setDatepickerFrom();
    this.#setDatepickerTo();

    const offerBlock = this.element.querySelector('.event__available-offers');

    if(offerBlock){
      offerBlock.addEventListener('change', this.#offerCheckHandler);
    }
  };

  #submitFormHandler = (evt) => {
    evt.preventDefault();
    this.#handleFormSubmit(EditPointView.parseStateToPoint(this._state));
  };

  #deleteFormHandler = (evt) => {
    evt.preventDefault();
    this.#handleDeleteClick(EditPointView.parseStateToPoint(this._state));
  };

  #resetFormHandler = (evt) => {
    evt.preventDefault();
    this.#handleFormReset();
  };

  #changeTypeHandler = (evt) => {
    evt.preventDefault();
    if (evt.target.tagName === 'INPUT') {
      this.updateElement({
        type: evt.target.value,
        offers: []
      });
    }
  };

  #offerCheckHandler = (evt) => {
    evt.preventDefault();
    if (evt.target.tagName === 'INPUT') {
      const checkedOfferId = evt.target.dataset.offerId;
      const checkedOfferIndex = this._state.offers.indexOf(checkedOfferId);
      if (checkedOfferIndex === -1) {
        this._state.offers.push(checkedOfferId);
        return;
      }

      this._state.offers.splice(checkedOfferIndex, 1);
    }
  };

  #changePriceHandler = (evt) => {
    evt.preventDefault();
    const newPrice = evt.target.value;
    if(Number(newPrice) && newPrice >= 1) {
      this._setState({
        basePrice: +newPrice
      });
    } else {
      evt.target.value = this._state.basePrice;
    }
  };

  #changeDestinationHandler = (evt) => {
    evt.preventDefault();
    if (!evt.target.value) {
      return;
    }

    const selectedDestination = this.#destinations.find((tripDestination) => tripDestination.name === evt.target.value);
    const selectedDestinationId = (selectedDestination) ? selectedDestination.id : null;

    this.updateElement({
      ...this._state,
      destination: selectedDestinationId
    });
  };

  #dateFromChangeHandler = ([userDate]) => {
    this.updateElement({
      dateFrom: userDate,
    });
  };

  #dateToChangeHandler = ([userDate]) => {
    this.updateElement({
      dateTo: userDate,
    });
  };

  #setDatepickerFrom () {
    this.#datepickerFrom = flatpickr(
      this.element.querySelector(`#event-start-time-${this._state.id}`),
      {
        enableTime: true,
        dateFormat: 'd/m/y H:i',
        maxDate: this._state.dateTo,
        defaultDate: this._state.dateFrom,
        onChange: this.#dateFromChangeHandler,
        'time_24hr':true
      }
    );
  }

  #setDatepickerTo() {
    this.#datepickerTo = flatpickr(
      this.element.querySelector(`#event-end-time-${this._state.id}`),
      {
        enableTime: true,
        dateFormat: 'd/m/y H:i',
        minDate: this._state.dateFrom,
        defaultDate: this._state.dateTo,
        onChange: this.#dateToChangeHandler,
        'time_24hr':true
      }
    );
  }

  static parsePointToState(point) {
    return {...point,
      isDisabled: false,
      isSaving: false,
      isDeleting: false,
    };
  }

  static parseStateToPoint(state) {
    const point = {...state};
    delete point.isDisabled;
    delete point.isSaving;
    delete point.isDeleting;

    return point;
  }
}
