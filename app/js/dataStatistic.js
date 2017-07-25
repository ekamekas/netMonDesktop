// Dummy data of network traffic in Mbps
var threshold = 0.1   // +- 10% dari rerata
var countLoop = 3     //
var dummyData = [
  3, 4, 5, 2, 4, 5, 5,
  6, 4, 5, 3, 5, 2, 7,
  20, 600, 30, 78, 23, 23, 43,
  50, 68, 52, 44, 47, 55, 56
]

function DataStatistic(population){
  this.population = population
  this.sortedData = function(data){
    if(data === undefined)
      data = population
    function sortNumber(a,b) {
        return a - b
    }
    return data.sort(sortNumber)
  }

  this.sum = function(data){
    if(data === undefined)
      data = population
    let sum = 0
    if(data.constructor === Array){
      for(i = 0; i < data.length; i++){
        sum = sum + data[i]
      }
    }
    return sum
  }

  this.mean = function(data){
    if(data === undefined)
      data = population
    return this.sum(data)/data.length
  }

  this.percentil = function(data, k){
    if(data === undefined)
      data = population
    let sortedData = this.sortedData(data)
    return sortedData[Math.floor(k/100 * sortedData.length) - 1] + (k/100 % 1) * (sortedData[Math.floor(k/100 * sortedData.length)] - sortedData[Math.floor(k/100 * sortedData.length) - 1])
  }

  this.standardDeviation = function(data){
    if(data === undefined)
      data = population
    let diffSquare = []
    console.log(data.length)
    let i = 0
    while(i < data.length) {
      diffSquare.push(Math.pow(data[i] - this.mean(data), 2))
      i++
    }
    return Math.sqrt(1/data.length * this.sum(diffSquare))
  }
}
