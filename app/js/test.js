// Dummy data of network traffic in Mbps
var threshold = 0.1   // +- 10% dari rerata
var countLoop = 3     //
var dummyData = [
  3, 4, 5, 2, 4, 5, 5,
  6, 4, 5, 3, 5, 2, 7,
  20, 600, 30, 78, 23, 23, 43,
  50, 68, 52, 44, 47, 55, 56
]

function DataStatistic(data){
  this.data = data
  this.average = function(){
    let sum = 0
    if(this.data.constructor === Array){
      for(i = 0; i < this.data.length; i++){
        sum = sum + this.data[i]
      }
      return sum/this.data.length
    }
  }
  this.sortedData = function(){
    function sortNumber(a,b) {
        return a - b
    }
    return data.sort(sortNumber)
  }
  this.percentil = function(k){
    let sortedData = this.sortedData()
    console.log(sortedData)
    console.log(typeof sortedData)
    return sortedData[Math.floor(k/100 * sortedData.length) - 1] + (k/100 % 1) * (sortedData[Math.floor(k/100 * sortedData.length)] - sortedData[Math.floor(k/100 * sortedData.length) - 1])
  }
}
