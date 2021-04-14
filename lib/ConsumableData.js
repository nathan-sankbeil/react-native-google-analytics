import Serializable from './Serializable';

export default class ConsumableData extends Serializable {
  isEmpty() {
    return Object.keys(this.properties).length === 0;
  }

  set(hit) {
    this.properties = Object.assign({}, this.properties, hit.properties);
  }

  flush() {
    this.properties = {};
  }

  toQueryString() {
    const data = super.toQueryString();
    this.flush();
    return data;
  }
}
