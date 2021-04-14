import ConsumableData from './ConsumableData';
import CustomDimensions from './CustomDimensions';
import EnhancedEcommerce from './EnhancedEcommerce';
import Event from './hits/Event';
import Exception from './hits/Exception';
import Item from './hits/Item';
import PageView from './hits/PageView';
import ScreenView from './hits/ScreenView';
import Social from './hits/Social';
import Timing from './hits/Timing';
import TrafficSource from './hits/TrafficSource';
import Transaction from './hits/Transaction';

export default class Analytics {
  constructor(trackingId, clientId, version, userAgent, requestFn) {
    this.collectBaseEndpoint = 'https://www.google-analytics.com/collect?';
    this.version = version || 1;
    this.trackingId = trackingId;
    this.clientId = clientId;
    this.userAgent = userAgent || null;
    this.customDimensions = new CustomDimensions();
    this.ConsumableData = new ConsumableData();
    this.EnhancedEcommerce = new EnhancedEcommerce();
    this.requestFn = requestFn || null;

    if (!userAgent) {
      throw new Error('You must specify a user agent in order for Google Analytics to accept the event. Use DeviceInfo.getUserAgent() from react-native-device-info for this.');
    }
  }

  add(hit) {
    this.EnhancedEcommerce.add(hit);
  }

  addDimension(index, name) {
    this.customDimensions.addDimension(index, name);
  }

  removeDimension(index) {
    this.customDimensions.removeDimension(index);
  }

  send(hit) {
    if (!(hit instanceof Event) &&
        !(hit instanceof Exception) &&
        !(hit instanceof Item) &&
        !(hit instanceof PageView) &&
        !(hit instanceof ScreenView) &&
        !(hit instanceof Social) &&
        !(hit instanceof Timing) &&
        !(hit instanceof Transaction)) {
      throw new Error("Only the following hits can be sent using 'send' command: pageview, screenview, event, transaction, item, social, exception and timing");
    }

    let request = this.collectBaseEndpoint;
    let options = {
      method: 'get',
      headers: {
        'User-Agent': this.userAgent
      }
    }

    hit.set({
      v: this.version,
      tid: this.trackingId,
      cid: this.clientId
    });

    // Adds hit to the request.
    request += hit.toQueryString();

    // Adds custom dimensions.
    if (Object.keys(this.customDimensions.properties).length) {
      request += `&${this.customDimensions.toQueryString()}`;
    }

    if (!this.ConsumableData.isEmpty()) {
      request += `&${this.ConsumableData.toQueryString()}`;
    }

    // Adds 'enhanced ecommerce' hits to the request if the send hit is not of type 'ecommerce'.
    // Reference: https://developers.google.com/analytics/devguides/collection/protocol/v1/devguide#enhancedecom
    if (!(hit instanceof Item) &&
        !(hit instanceof Transaction) &&
        !this.EnhancedEcommerce.isEmpty()) {
      request += `&${this.EnhancedEcommerce.toQueryString()}`;
    }

    // Adds cache-buster.
    // Reference: https://developers.google.com/analytics/devguides/collection/protocol/v1/reference#cache-busting
    request += `&z=${Math.round(Math.random() * 1e8)}`;

    if (this.requestFn) {
      return this.requestFn(request, options);
    }

    return fetch(request, options);
  }

  set(action) {
    if (action instanceof TrafficSource) {
      this.ConsumableData.set(action);
    } else {
      this.EnhancedEcommerce.set(action);
    }
  }
}
