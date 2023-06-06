import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import { humanizeDate, capitalize } from '../utils.js';
import { WAYPOINT_TYPES, DATE_FORMAT, DEFAULT_POINT } from '../const.js';

// function createEditEventTemplate({state, pointDestinations, pointOffers}) {
//   const {point} = state;
//   const {basePrice, type, destination, dateFrom, dateTo} = point;

//   const startTimeInForm = humanizeDate(dateFrom, DATE_FORMAT);
//   const endTimeInForm = humanizeDate(dateTo, DATE_FORMAT);

//   function createEventTypesTemplate(types) {
//     return types.map((typeItem) =>
//       `<div class="event__type-item">
//        <input id="event-type-${typeItem.toLowerCase()}-1"
//        class="event__type-input  visually-hidden"
//        type="radio"
//        name="event-type"
//        value="${typeItem.toLowerCase()}">
//        <label class="event__type-label  event__type-label--${typeItem.toLowerCase()}"
//        for="event-type-${typeItem.toLowerCase()}-1">${capitalize(typeItem)}</label>
//       </div>`).join('');
//   }

//   function createCitiesListTemplate(cities) {
//     return cities.map((city) => `<option value=${city}></option>`).join('');
//   }

//   function createPicturesTemplate(pictures) {
//     return pictures.map((picture) =>
//       `<img class="event__photo" src="${picture.src}" alt="Event photo">`).join('');
//   }

//   const concreteOffers = pointOffers.find((offer) => offer.type === type).offers;

//   function createOffersTemplate() {
//     return concreteOffers.map((offer) =>
//       `<div class="event__offer-selector">
//          <input class="event__offer-checkbox  visually-hidden"
//          id="event-offer-${type}-${offer.id}"
//          type="checkbox"
//          name="event-offer-${type}" ${point.offers.includes(offer.id) ? 'checked' : ''}>
//          <label class="event__offer-label"
//          for="event-offer-${type}-${offer.id}">
//            <span class="event__offer-title">${offer.title}</span>
//            &plus;&euro;&nbsp;
//            <span class="event__offer-price">${offer.price}</span>
//          </label>
//        </div>`).join('');
//   }


function createEditEventTemplate({point, pointDestinations, pointOffers}) {
  const {basePrice, type, destination, dateFrom, dateTo} = point;

  const startTimeInForm = humanizeDate(dateFrom, DATE_FORMAT);
  const endTimeInForm = humanizeDate(dateTo, DATE_FORMAT);

  function createEventTypesTemplate(types) {
    return types.map((typeItem) =>
      `<div class="event__type-item">
            <input id="event-type-${type}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${type}" ${typeEvent === type ? 'checked' : ''}>
            <label class="event__type-label  event__type-label--${type}" for="event-type-${type}-1">${type}</label>
          </div>`
    )).join('')}
      </fieldset>
    </div>`
  );
}

function createDestinationList(point, destinations, type){
  return (
    `<div class="event__field-group  event__field-group--destination">
      <label class="event__label  event__type-output" for="event-destination-1">
        ${type}
      </label>
      <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${destinations.find((item) => item.id === point.destination).name}" list="destination-list-1">
      <datalist id="destination-list-1">
      ${destinations.map((item) => (
      `<option ${item.id === point.destination ? 'selected' : ''} value="${item.name}">${item.name}</option>`
    )).join('')}
      </datalist>
    </div>`
  );
}

function createOffersList(point, offers){

  const offersByType = offers.find((offer) => offer.type === point.type).offers;
  const offersByIds = [...offersByType.filter((offer) => point.offers.find((id) => offer.id === id))];

  return (
    `<section class="event__section  event__section--offers">
      <h3 class="event__section-title  event__section-title--offers">Offers</h3>

      <div class="event__available-offers">

  function createOffersTemplate() {
    return concreteOffers.map((offer) =>
      `<div class="event__offer-selector">
         <input class="event__offer-checkbox  visually-hidden"
         id="event-offer-${type}-${offer.id}"
         type="checkbox"
         name="event-offer-${type}" ${point.offers.includes(offer.id) ? 'checked' : ''}>
         <label class="event__offer-label"
         for="event-offer-${type}-${offer.id}">
           <span class="event__offer-title">${offer.title}</span>
           &plus;&euro;&nbsp;
           <span class="event__offer-price">${offer.price}</span>
         </label>
       </div>`).join('');
  }
  return (`
<li class="trip-events__item">
  <form class="event event--edit" action="#" method="post">
    <header class="event__header">
      <div class="event__type-wrapper">
        <label class="event__type  event__type-btn" for="event-type-toggle-1">
          <span class="visually-hidden">Choose event type</span>
          <img class="event__type-icon" width="17" height="17" src="img/icons/${point.type}.png" alt="Event type icon">
        </label>
        <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">
        <div class="event__type-list">
          <fieldset class="event__type-group">
            <legend class="visually-hidden">Event type</legend>
            ${createEventTypesTemplate(WAYPOINT_TYPES)}
          </fieldset>
        </div>
      </div>
      <div class="event__field-group  event__field-group--destination">
        <label class="event__label  event__type-output" for="event-destination-1">
        ${capitalize(type)}
        </label>
        <input class="event__input  event__input--destination"
        id="event-destination-1" type="text"
        name="event-destination"
        value="${pointDestinations.find((el) => el.id === destination).name}" list="destination-list-1">
        <datalist id="destination-list-1">
        ${createCitiesListTemplate(DESTINATIONS)}
        </datalist>
      </div>
      <div class="event__field-group  event__field-group--time">
        <label class="visually-hidden" for="event-start-time-1">From</label>
        <input class="event__input  event__input--time"
        id="event-start-time-1" type="text"
        name="event-start-time" value="${startTimeInForm}">
        <label class="visually-hidden" for="event-end-time-1">To</label>
        <input class="event__input  event__input--time"
        id="event-end-time-1" type="text"
        name="event-end-time" value="${endTimeInForm}">
      </div>
      <div class="event__field-group  event__field-group--price">
        <label class="event__label" for="event-price-1">
          <span class="visually-hidden">Price</span>
          € ${basePrice}
        </label>
        <input class="event__input  event__input--price"
        id="event-price-1" type="text"
        name="event-price" value="">
      </div>
      <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
      <button class="event__reset-btn" type="reset">Cancel</button>
      <button class="event__rollup-btn" type="button">
        <span class="visually-hidden">Open event</span>
      </button>
    </header>
    <section class="event__details">
      <section class="event__section  event__section--offers">
        <h3 class="event__section-title  event__section-title--offers">Offers</h3>
        <div class="event__available-offers">
        ${pointOffers ? createOffersTemplate(pointOffers) : ''}
        </div>
      </section>
      <section class="event__section  event__section--destination">
        <h3 class="event__section-title  event__section-title--destination">Destination</h3>
        <p class="event__destination-description">${pointDestinations.find((el) => el.id === destination).description}</p>
        <div class="event__photos-container">
            <div class="event__photos-tape">
            ${createPicturesTemplate(pointDestinations.find((el) => el.id === destination).pictures)}
            </div>
          </section>
        </section>
      </form>
    </li>`
  );
}

export default class EditEventView extends AbstractStatefulView {

  #pointDestinations = null;
  #pointOffers = null;
  #handleFormSubmit = null;
  #handleFormReset = null;

  constructor({
    pointDestinations,
    point = DEFAULT_POINT,
    pointOffers,
    onFormSubmit,
    onResetClick
  }) {
    super();
    this.#pointDestinations = pointDestinations;
    this._setState(EditEventView.parsePointToState({point}));
    this.#pointOffers = pointOffers;
    this.#handleFormSubmit = onFormSubmit;
    this.#handleFormReset = onResetClick;

    this._restoreHandlers();
  }

  get template() {
    return createEditEventTemplate({
      state: this._state,
      pointDestinations:this.#pointDestinations,
      pointOffers:this.#pointOffers
    });
  }

  reset = (point) => this.updateElement({point});

  _restoreHandlers = () => {
    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#resetButtonClickHandler);
    this.element.querySelector('form').addEventListener('submit', this.#formSubmitHandler);
    this.element.querySelector('.event__type-group').addEventListener('change', this.#typeInputClick);
    this.element.querySelector('.event__input--price').addEventListener('change', this.#priceInputChange);
    this.element.querySelector('.event__input--destination').addEventListener('change', this.#destinationInputChange);

    const offerBlock = this.element.querySelector('.event__available-offers');

    if(offerBlock){
      offerBlock.addEventListener('change', this.#offerClickHanlder);
    }
  };

  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    this.#handleFormSubmit(EditEventView.parseStateToPoint(this._state));
  };

  #resetButtonClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleFormReset();
  };

  #typeInputClick = (evt) => {
    evt.preventDefault();

    this.updateElement({
      point: {
        ...this._state.point,
        type: evt.target.value,
        offers: []
      }
    });
  };

  #offerClickHanlder = (evt) => {
    evt.preventDefault();

    const checkedBoxes = Array.from(this.element.querySelectorAll('.event__offer-checkbox:checked'));

    this._setState({
      point: {
        ...this._state.point,
        offers: checkedBoxes.map((element) => element.dataset.offerId)
      }
    });
  };

  #priceInputChange = (evt) => {
    evt.preventDefault();

    this._setState({
      point: {
        ...this._state.point,
        basePrice: evt.target.value
      }
    });
  };

  #destinationInputChange = (evt) => {
    evt.preventDefault();

    const selectedDestination = this.#pointDestinations.find((destination) => destination.name === evt.target.value);

    const selectedDestinationId = (selectedDestination) ? selectedDestination.id : null;

    this.updateElement({
      point: {
        ...this._state.point,
        destination: selectedDestinationId
      }
    });
  };

  static parsePointToState = ({point}) => ({point});

  static parseStateToPoint = (state) => state.point;

}
