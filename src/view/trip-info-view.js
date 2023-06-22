import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import { getCheckedOffers, getDestination } from '../utils.js';
import { FormatPattern } from '../const.js';
import dayjs from 'dayjs';

const POINTS_COUNT_MAX = 3;

const formatDate = (date, isTripInfo) => {
  const pattern = isTripInfo ? FormatPattern.TRIP_INFO_DATE : FormatPattern.DATE;
  return date ? dayjs(date).format(pattern) : '';
};

const createTripInfoTemplate = (getTripDestinations, getTripDates, getTripPrice) => (
  `<section class="trip-main__trip-info  trip-info">
      <div class="trip-info__main">
        <h1 class="trip-info__title">${getTripDestinations()}</h1>
        <p class="trip-info__dates">${getTripDates()}</p>
      </div>
      <p class="trip-info__cost">
        Total: &euro;&nbsp;<span class="trip-info__cost-value">${getTripPrice()}</span>
      </p>
    </section>`
);

export default class TripInfoView extends AbstractStatefulView {
  #points = [];
  #destinations = [];
  #offers = [];

  constructor(points, destinations, offers) {
    super();
    this.#points = points;
    this.#destinations = destinations;
    this.#offers = offers;
  }

  get template(){
    return createTripInfoTemplate(this.#getDestinations, this.#getTripDates, this.#getTripPrice);
  }

  #getDestinations = () => {
    if (!this.#points || !this.#points.length) {
      return '';
    }

    const selectedDestinations = this.#destinations
      .filter((destination) => this.#points
        .find((point) => point.destination === destination.id))
      .map((destination) => destination.name);

    if (selectedDestinations.length > POINTS_COUNT_MAX) {
      const firstDestination = getDestination(this.#points[0].destination, this.#destinations).name;
      const lastDestination = getDestination(this.#points.at(-1).destination, this.#destinations).name;

      return [firstDestination, lastDestination].join(' &mdash; ... &mdash; ');
    }

    return selectedDestinations.join(' &mdash; ');
  };

  #getTripPrice = () => {
    if (!this.#points || !this.#points.length) {
      return '';
    }

    return this.#points.reduce((total, point) => {
      const checkedOffers = getCheckedOffers(point.type, point.offers, this.#offers);
      const offersSum = checkedOffers.reduce((acc, offer) => {
        acc += offer.price;
        return acc;
      }, 0);

      total += point.basePrice + offersSum;
      return total;
    }, 0);
  };

  #getTripDates = () => {
    if (!this.#points || !this.#points.length) {
      return '';
    }

    const dateFrom = formatDate(this.#points[0].dateFrom, true);
    const dateTo = formatDate(this.#points.at(-1).dateTo, true);

    return [dateFrom, dateTo].join(' - ');
  };
}
