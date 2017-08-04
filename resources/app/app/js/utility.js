function Utility(){
  var fs = require('fs'),
  https = require('https')

  this.getXML = function (url, callback) {

    'use strict';
    'use esversion:6'

    let xml2js = require('xml2js'),
    parser = new xml2js.Parser();

    // Check if parameter is file or http request
    if(url.split('/')[0] == "file:"){
      fs.readFile(__dirname + '/app/media/dataprtg/historicdata_may.xml', function(err, data) {
          parser.parseString(data, function (err, result) {
              console.log(result)
              if(callback !== undefined)
                callback(result)
          });
      });
    } else if(url.split('/')[0] == "http:" || url.split('/')[0] == "https:"){

      parser.on('error', function(err) { console.log('Parser error', err); });

      var request = require('request');
      var agentOptions;
      var agent;

      agentOptions = {
        host: '123.231.138.149',
        port: '443',
        path: '/',
        rejectUnauthorized: false
      };
      agent = new https.Agent(agentOptions);

      request({
        url: url,
        method: 'GET',
        agent: agent
        }, function (err, resp, body) {
        if (resp.statusCode >= 200 && resp.statusCode < 400) {
            parser.parseString(body, function(err, result) {
              console.log(result)
              if(callback !== undefined)
                callback(result)
            })
          }
        }
      )
    }
  }
}
