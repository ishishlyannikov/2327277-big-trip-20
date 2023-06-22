import dayjs from 'dayjs';
import { FilterType } from './const.js';

export function formatStringToDateTime (date) {
  return dayjs(date).format('YYYY-MM-DDTHH:mm');
}

export function formatStringToShortDate (date) {
  return dayjs(date).format('MMM DD');
}

export function formatStringToTime (date) {
  return dayjs(date).format('HH:mm');
}

const getOfferElementsByType = (type, offers) => offers?.find((offer) => type === offer.type);

export function getCheckedOffers (type, pointOffers, offers) {
  const offersByType = getOfferElementsByType(type, offers);
  if (!offersByType || !offersByType.offers) {
    return;
  }
  const checkedOffers = offersByType.offers.filter((offer) =>
    pointOffers
      .some((offerId) => offerId === offer.id));
  return checkedOffers;
}

export function getDestination (id, destinations) {
  return destinations.find((destination) => destination.id === id);
}

export function calculateDuration (start, end) {
  const interval = new Date(end - start);

  return {
    days: interval.getUTCDate() - 1,
    hours: interval.getUTCHours(),
    minutes: interval.getUTCMinutes()
  };
}

export function formatDuration (interval) {
  const duration = [];
  if (interval.days !== 0) {
    duration[0] = String(interval.days).padStart(2, '0');
    duration[0] += 'D';
  }
  if (interval.hours !== 0) {
    duration[1] = String(interval.hours).padStart(2, '0');
    duration[1] += 'H';
  }
  if (interval.minutes !== 0) {
    duration[2] = String(interval.minutes).padStart(2, '0');
    duration[2] += 'M';
  }

  return duration.join('');
}

function isPointFuture(point){
  return (dayjs().isBefore(point.dateFrom));
}

function isPointPast(point){
  return (dayjs().isAfter(point.dateTo));
}

function isPointPresent(point){
  return (dayjs().isAfter(point.dateFrom) && dayjs().isBefore(point.dateTo));
}

export const filter = {
  [FilterType.EVERYTHING]: (points) => points,
  [FilterType.FUTURE]: (points) => points.filter((point) => isPointFuture(point)),
  [FilterType.PRESENT]: (points) => points.filter((point) => isPointPresent(point)),
  [FilterType.PAST]: (points) => points.filter((point) => isPointPast(point)),
};

export function getOffersByType (offers, offerType) {
  const offersByType = offers.find((offer) => offer.type === offerType);
  return offersByType ? offersByType.offers : [];
}

export function isDatesEqual (dateA, dateB) {
  return dayjs(dateA).isSame(dateB);
}

export function sortByTime (pointA, pointB) {
  const durationA = dayjs(pointA.dateTo).diff(dayjs(pointA.dateFrom));
  const durationB = dayjs(pointB.dateTo).diff(dayjs(pointB.dateFrom));

  return durationB - durationA;
}

export function sortByPrice (pointA, pointB) {
  return pointB.basePrice - pointA.basePrice;
}

export function sortByDay (pointA, pointB) {
  return dayjs(pointA.dateFrom).diff(dayjs(pointB.dateFrom));
}
