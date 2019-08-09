import * as Express from 'express';
import * as weather from 'weather-js';
import {WeatherSearch} from './weather-search';
import * as Redis from 'redis';

const app = Express();

let redis = Redis.createClient();
redis.on('error', err => console.log(`Redis error: ${err}.`));

app.get('/', function (request, response) {
  try {
    getWeather(request, response);
  } catch (error) {
    response.send(`There was a problem getting the weather. ${error.message}`);
  }
});

console.log(`Magic happens on port 3000!`);
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
    }

    result[0].forecast.forEach((day: any) => {
      day.imageUrl = result[0].location.imagerelativeurl + 'law/' + day.skycodeday + '.gif';
    });
    response.json(result[0]).send;

    // update the cache - no need to slow the request down for this
    redis.setex(JSON.stringify(search), 60, JSON.stringify(result));
  });
}

function getCachedResult(search: WeatherSearch): any {
  redis.get(JSON.stringify(search), function(err, result) {
    if (err) {
      throw err;
    }
    return result;
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
