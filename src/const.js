export const WAYPOINT_TYPES = ['Check-in', 'Sightseeing', 'Restaurant', 'Taxi', 'Bus', 'Train', 'Ship', 'Drive', 'Flight'];

export const DEFAULT_POINT = {
  'basePrice': '',
  'dateFrom': '',
  'dateTo': '',
  'destination': '',
  'isFavorite': false,
  'offers': [],
  'type': 'taxi',
};

export const DATE_FORMAT = 'DD/MM/YY HH:mm';

export const FilterType = {
  EVERYTHING: 'everything',
  FUTURE: 'future',
  PRESENT: 'present',
  PAST: 'past'
};

export const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
};

export const SortType = {
  DAY: 'day',
  TIME: 'time',
  PRICE: 'price',
};

export const UserAction = {
  UPDATE_POINT: 'UPDATE_POINT',
  ADD_POINT: 'ADD_POINT',
  DELETE_POINT: 'DELETE_POINT',
};

export const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
  INIT: 'INIT',
  INIT_ERROR: 'INIT_ERROR',
};

export const EditType = {
  EDITING: 'EDITING',
  CREATING: 'CREATING'
};

export const FormatPattern = {
  TRIP_INFO_DATE: 'D MMM',
  DATE: 'MMM D',
  TIME: 'HH:mm',
  DATETIME: 'DD/MM/YY HH:mm',
};

export const TimeLimit = {
  LOWER_LIMIT: 350,
  UPPER_LIMIT: 1000,
};
