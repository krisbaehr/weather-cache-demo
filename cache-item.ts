import {WeatherSearch} from './weather-search';

export class CacheItem {
  search: WeatherSearch;
  result: any;
  lastUpdated: number;
}