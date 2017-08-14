function Utility(){
  var fs = require('fs'),
  url = require('url'),
  xml2js = require('xml2js')
  https = require('https')

  this.getXML = function (path, callback) {

    'use strict';
    'use esversion:6'

    let parser = new xml2js.Parser();

    path = url.parse(path)

    // Check if parameter is file or http request, assume localfile if protocol is null
    if(path.protocol == "file:" || path.protocol == null){
      console.log("Waiting")  // Ganti dengan frontend popup-waiting-window
      fs.readFile(decodeURI(path.pathname), function(err, data) {
          parser.parseString(data, function (err, result) {
              if(callback !== undefined){
                callback(result)
                console.log("Done")
              }
          });
      });
    } else if(path.protocol == "http:" || path.protocol == "https:"){
      console.log("Waiting")  // Ganti dengan frontend popup-waiting-window

      parser.on('error', function(err) { console.log('Parser error', err); });

      let request = require('request');
      let agentOptions;
      let agent;

      agentOptions = {
        host: '123.231.138.149',
        port: '443',
        path: '/',
        rejectUnauthorized: false
      };
      agent = new https.Agent(agentOptions);

      request({
        url: path,
        method: 'GET',
        agent: agent
        }, function (err, resp, body) {
        if (resp.statusCode >= 200 && resp.statusCode < 400) {
            parser.parseString(body, function(err, result) {
              if(callback !== undefined){
                callback(result)
                console.log("Done");
              }
            })
          }
        }
      )
    }
  }

  this.writeXML = function(data, outputPath, callback){
    let builder = new xml2js.Builder()
    let xml = ""
    console.log(outputPath, "Output path")
    console.log(typeof(data), "Tipe data")
    if(typeof(data) === "object")
      xml = builder.buildObject(data)
    fs.writeFile(outputPath, xml, (err) => {
      if(err)
        return console.log(err)
      callback()
    })
  }

  this.getJSON = function(url, callback) {
    let request = require('request');
    let agentOptions;
    let agent;

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
        callback(JSON.parse(body))
        }
      }
    )
  }

  // For Windows path
  this.windowsSlash = (path) => {
    let chars = path.split('')
    for(let i = 0; i < chars.length; i++){
      if(chars[i] == "\\")
        chars[i] = "/"
    }
    return chars.join('')
  }
}
