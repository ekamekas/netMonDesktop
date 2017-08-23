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

    // console.log("Waiting")  // Ganti dengan frontend popup-waiting-window
    // Check if parameter is file or http request, assume localfile if protocol is null
    if(path.protocol == "file:" || path.protocol == null){
      
      fs.readFile(decodeURI(path.pathname), function(err, data) {
          parser.parseString(data, function (err, result) {
              if(callback !== undefined){
                callback(result)
                // console.log("Done")
              }
          });
      });
    } else if(path.protocol == "http:" || path.protocol == "https:"){
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
                // console.log("Done");
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

  this.getJSON = function(path, callback) {
    //  console.log("Waiting")  // Ganti dengan frontend popup-waiting-window
     path = url.parse(path)
     if(path.protocol == "file:" || path.protocol == null){
      fs.readFile(decodeURI(path.pathname), function(err, data) {
        console.log(data)
          callback(JSON.parse(data))
      });
    } else if(path.protocol == "http:" || path.protocol == "https:"){
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
            // else
            //   cellData = cellData[0]
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
        // console.log(result)
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
              let dataTemp
              for (col = 0; col < columns.length; col++) {
                if(columns[col].search("Traffic In") != -1){
                  // 5 adalah index array traffic ou (speed)
                  if(data[i]["peaks"] === undefined)
                    rowData.push("-")
                  else {
                    if(data[i]["peaks"]["correction"][3] === undefined)
                      rowData.push(data[i]["peaks"]["cluster"][3])
                    else
                      rowData.push(data[i]["peaks"]["correction"][3])
                  }
                } else if(columns[col].search("Traffic Out") != -1) {
                  // 5 adalah index array traffic ou (speed)
                  if(data[i]["peaks"] === undefined)
                    rowData.push("-")
                  else {
                    if(data[i]["peaks"]["correction"][5] === undefined)
                      rowData.push(data[i]["peaks"]["cluster"][5])
                    else
                      rowData.push(data[i]["peaks"]["correction"][5]) 
                  }
                } else {
                  dataTemp = (data[i][columns[col]]).toString().replace(/ <.*>/, '')
                  rowData.push(dataTemp)
                }
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
