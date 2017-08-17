function Utility(){
  var fs = require('fs'),
  path = require('path'),
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

  // Exporting to spreadsheet-xml format
  // data : Array dari data yang akan ditulis
  this.writeSpreadsheet = (data, columns, outputfile, template, callback) => {
      function addRow(rowNumber, rowData, table){
          let cell = []
          // Inserting row number
          cell.push({
              "$":{
                "ss:MergedDown":1
              },
              "Data":[
                {
                  "$":{
                    "ss:Type":"String"
                  },
                  "_":rowNumber
                }
              ]
            })
          for(let i = 0; i < rowData.length; i++){
            // Inserting cell data
            let cellData = rowData[i]
            if(cellData === undefined)
              cellData = ''
            else
              cellData = cellData[0]
            cell.push({
              "$":{
                "ss:MergedDown":1
              },
              "Data":[
                {
                  "$":{
                    "ss:Type":"String"
                  },
                  "_":cellData
                }
              ]
            })
          }
          table.push({Cell:cell})
      }
      if(outputfile === undefined)
        outputfile = path.join(__dirname + "../" + "dist/result.xml")
      outputfile = this.windowsSlash(outputfile)
      if(template === undefined)
        template = path.join(__dirname, "../", "media/excelTemplate.xml")
      template = this.windowsSlash("file://" + template)
      this.getXML(template, (result) => {
        console.log("Proses sedang berjalan");
        template = result
        console.log(result)
        if(data !== undefined && data.length != 0){
          try{
            template.Workbook.Worksheet[0].Table[0].$["ss:ExpandedRowCount"] = template.Workbook.Worksheet[0].Table[0].$["ss:ExpandedRowCount"] + data.length + 1   // Assign metadata of row counts (with header)
            if(template.Workbook.Worksheet[0].Table[0].$["ss:ExpandedColumnCount"] < columns.length + 1)
              template.Workbook.Worksheet[0].Table[0].$["ss:ExpandedColumnCount"] = columns.length + 1   // Assign metadata of column counts (with number column)
            template.Workbook.Worksheet[0].Table[0]["Row"] = []   // Declare new attribute
            // Add header row
            addRow('No', columns, template.Workbook.Worksheet[0].Table[0]["Row"])
            // Start loopy
            for(let i = 0; i < data.length; i++){
              let rowData = []
              for (col = 0; col < columns.length; col++) {
                rowData.push(data[i][columns[col]])
              }
              addRow(i + 1, rowData, template.Workbook.Worksheet[0].Table[0]["Row"])
            }
            // End loopy
            // Write to file
            this.writeXML(template, outputfile, () => {
              callback(outputfile)
            })
          } catch(err){
            console.log(err, "Why ?")
            callback()
          }
        }
      })
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
