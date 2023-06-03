import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import relativeTime from 'dayjs/plugin/relativeTime';
import { FilterType } from './const.js';

dayjs.extend(duration);
dayjs.extend(relativeTime);

const MSEC_IN_SEC = 1000;
const SEC_IN_MIN = 60;
const MIN_IN_HOUR = 60;
const HOUR_IN_DAY = 24;

const MSEC_IN_HOUR = MSEC_IN_SEC * SEC_IN_MIN * MIN_IN_HOUR;
const MSEC_IN_DAY = MSEC_IN_HOUR * HOUR_IN_DAY;

export function humanizeDate(date, dateFormat) {
  return date ? dayjs(date).format(dateFormat) : '';
}

export function formatStringToDateTime (date) {
  return dayjs(date).format('YYYY-MM-DDTHH:mm');
}

export function formatStringToShortDate (date) {
  return dayjs(date).format('MMM DD');
}

export function formatStringToTime (date) {
  return dayjs(date).format('HH:mm');
}

export function getTimeDiff(timeFrom, timeTo) {
  const timeDiff = dayjs(timeTo).diff(timeFrom);
  let pointDuration = 0;

  switch (true) {
    case (timeDiff >= MSEC_IN_DAY):
      pointDuration = dayjs.duration(timeDiff).format('DD[D] HH[H] mm[M]');
      break;
    case (timeDiff >= MSEC_IN_HOUR):
      pointDuration = dayjs.duration(timeDiff).format('HH[H] mm[M]');
      break;
    case (timeDiff < MSEC_IN_HOUR):
      pointDuration = dayjs.duration(timeDiff).format('mm[M]');
      break;
  }
  return pointDuration;
}

export function getRandomInteger (min, max) {
  const lower = Math.ceil(Math.min(Math.abs(min), Math.abs(max)));
  const upper = Math.floor(Math.max(Math.abs(min), Math.abs(max)));
  const result = Math.random() * (upper - lower + 1) + lower;
  return Math.floor(result);
}

export function getRandomArrayElement(items) {
  return items[getRandomInteger(0, items.length - 1)];
}

export function capitalize(string) {
  return `${string[0].toUpperCase()}${string.slice(1)}`;
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
  [FilterType.EVERYTHING]: (points) => [...points],
  [FilterType.FUTURE]: (points) => points.filter((point) => isPointFuture(point)),
  [FilterType.PRESENT]: (points) => points.filter((point) => isPointPresent(point)),
  [FilterType.PAST]: (points) => points.filter((point) => isPointPast(point)),
};

export function updatePoint (points,update) {
  return points.map((point) => point.id === update.id ? update : point);
}

export const sortByTime = (pointA, pointB) => {
  const durationA = dayjs(pointA.dateTo).diff(dayjs(pointA.dateFrom));
  const durationB = dayjs(pointB.dateTo).diff(dayjs(pointB.dateFrom));

  return durationB - durationA;
};

export const sortByPrice = (pointA, pointB) => pointB.basePrice - pointA.basePrice;

export const sortByDay = (pointA, pointB) => dayjs(pointA.dateFrom).diff(dayjs(pointB.dateFrom));


// export function durationWaypoint(point) {
//   return dayjs(point.dateTo).diff(dayjs(point.dateFrom));
// }


// export function sortByTime(points) {
//   return points.sort((a, b) => durationWaypoint(b) - durationWaypoint(a));
// }

// export function sortByPrice(points) {
//   return points.sort((a, b) => b.basePrice - a.basePrice);
// }
