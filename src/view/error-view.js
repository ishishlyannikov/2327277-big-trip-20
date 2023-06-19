import AbstractView from '../framework/view/abstract-view.js';

const createLoadingErrorTemplate = () => `
  <p class="trip-events__msg">
    Something went wrong.
    <br>Please, try again later...
  </p>`;

export default class ErrorView extends AbstractView {

  get template(){
    return createLoadingErrorTemplate();
  }
}
