export default class PersonViewModel {
  constructor({name}) {
    this.name = name;
  }
  static get name() {
    return 'person';
  }
  static get template() {
    return {element: 'person-template'};
  }
}
