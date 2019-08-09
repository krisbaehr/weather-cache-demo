import * as Express from 'express';
import * as weather from 'weather-js';
import {WeatherSearch} from './weather-search';
import {Cache} from './cache';
import {CacheItem} from './cache-item';
const app = Express();

let cache = new Cache();
cache.items = [];

app.get('/', function (request, response) {
  try {
    getWeather(request, response);
  } catch (error) {
    response.send(`There was a problem getting the weather. ${error.message}`);
  }
});

console.log(`Magic happens on port 3000`);
console.log(`Try this: http://localhost:3000?city=Syracuse&state=NE&degreeType=F`);

app.listen(3000);

function getWeather(request: Express.Request, response: Express.Response) {
  let search = request.query;
  validateSearch(search);

  let cityState = search.city + ', ' + search.state;

  // try to respond with the cached result.
  let cachedResult = getCachedResult(search);
  if (cachedResult != null) {
    return response.json(cachedResult).send;
  }

  // respond with weather api's result
  weather.find({search: cityState, degreeType: search.degreeType}, (err: Error, result: any) => {
    if(err) {
      throw err;
    } else {
      result[0].forecast.forEach((day: any) => {
        day.imageUrl = result[0].location.imagerelativeurl + 'law/' + day.skycodeday + '.gif';
      });
      response.json(result[0]).send;

      // update the cache - no need to slow the request down for this
      updateCachedResult(search, result[0]);
    }
  });
}

function validateSearch(search: WeatherSearch) {
  if (search.city == null) {
    throw new Error('City is required.');
  }

  if(search.state == null) {
    throw new Error('State is required.');
  }

  if(search.degreeType == null) {
    throw new Error('Degree Type is required.');
  }

  if(search.degreeType !== 'F' && search.degreeType !== 'C') {
    throw new Error('Degree Type is invalid.');
  }
}

function getCachedResult(search: WeatherSearch): any {
  let i = findCacheItem(search);
  if ( i != null) {
    if (Date.now() - cache.items[i].lastUpdated >= 60000) {
      return undefined;
    }
    return cache.items[i].result;
  }
  return undefined;
}

function updateCachedResult(search: WeatherSearch, result: any) {
  let i = findCacheItem(search);
  if ( i != null) {
    cache.items[i].result = result;
    cache.items[i].lastUpdated = Date.now();
    return;
  }
  addCacheItem(search, result);
}

function findCacheItem(search: WeatherSearch): number {
  for (let i = 0; i < cache.items.length; i++) {
    const cacheItem = cache.items[i];
    if (cacheItem.search.city === search.city
    && cacheItem.search.state === search.state
    && cacheItem.search.degreeType === search.degreeType) {
      return i;
    }
  }
  return undefined;
}

 function addCacheItem(search: WeatherSearch, result: any) {
    let item = new CacheItem();
    item.search = search;
    item.result = result;
    item.lastUpdated = Date.now();
    cache.items.push(item);
  }