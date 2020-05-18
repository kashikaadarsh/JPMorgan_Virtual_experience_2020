import { ServerRespond } from './DataStreamer';

export interface Row {
  price_abc : Number,
  price_def : Number,
  ratio : Number,
  upper_bound : Number,
  lower_bound : Number,
  timestamp: Date,
  trigger_alert : number | undefined,
}


export class DataManipulator {
  static generateRow(serverRespond: ServerRespond[]): Row {
    const priceABC=(serverRespond[0].top_ask.price + serverRespond[0].top_bid.price)/2;
    const priceDEF=(serverRespond[1].top_ask.price + serverRespond[1].top_bid.price)/2;
    const ratio = priceABC/priceDEF;
    const upperBound = 1+0.05;
    const lowerBound = 1 - 0.05;   //only a single value is passed instead of an array of values 
    return {
      price_abc : priceABC,
      price_def : priceDEF,
      ratio,
      timestamp:serverRespond[0].timestamp > serverRespond[1].timestamp?   
      serverRespond[0].timestamp : serverRespond[1].timestamp,        //index 0 is about stock ABC and index 1 is about stock DEF
      upper_bound : upperBound,
      lower_bound : lowerBound,
      trigger_alert : (ratio > upperBound ||ratio < lowerBound) ? ratio :undefined,   // only defined when the upper or lower limits are surpassed


    };
  }
