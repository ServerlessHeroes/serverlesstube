/**
 * Created by Peter Sbarski
 * Last Updated: 28/03/2016
 */
'use strict';

var request = require('request');
var env = require('./config');

function successResponse(message){
  return {
    httpStatusCode: 200,
    body: JSON.stringify({'message' : message})
  }
}

function errorResponse(status, message){
  return {
    httpStatusCode: status,
    body: JSON.stringify({'message':message})
  }
}

exports.handler = function(event, context, callback){
    var authToken = event.queryStringParameters.Authorization;

    if (!authToken) {
      var response = errorResponse(400, 'AuthToken not found');

    	callback(null, response);
    	return;
    }

    var token = event.authToken.split(' ')[1];

    var body = {
        'id_token': token
    };

    var options = {
        url: 'https://' +  env.AUTH0_DOMAIN + '/tokeninfo',
        method: 'POST',
        json: true,
        body: body
    };

    request(options, function(error, response, body){
        if (!error && response.statusCode === 200) {
            var response = successResponse(body);

            callback(null, response);
        } else {
            var response = errorResponse(error);

            callback(null, response);
        }
    });
};
