import Hit from '../Action';

export default class TrafficSource extends Hit {
  constructor({
    utm_id,
    utm_source,
    utm_medium,
    utm_campaign,
    utm_term,
    utm_content
  }) {
    super({
      ci: utm_id, // Campaign ID
      cs: utm_source, // Campaign Source 
      cm: utm_medium, // Campaign Medium
      cn: utm_campaign, // Campaign Name
      ck: utm_term, // Campaign Keyword
      cc: utm_content, // Campaign Content
    });
  }
}
