// Dummy data of network traffic in Mbps
var threshold = 0.1;   // +- 10% dari rerata
var countLoop = 3;     //

function DataStatistic(population){
  this.population = population;
  this.sortedData = function(data){
    if(data === undefined)
      data = population;
    function sortNumber(a,b) {
        return a - b;
    }
    return data.sort(sortNumber);
  };

  this.sum = function(data){
    if(data === undefined)
      data = population;
    let sum = 0;
    if(data.constructor === Array){
      for(i = 0; i < data.length; i++){
        sum = sum + data[i];
      }
    }
    return sum;
  }

  this.mean = function(data){
    if(data === undefined)
      data = population;
    return this.sum(data)/data.length;
  };

  this.percentil = function(k, data){
    if(data === undefined)
      data = population;
    let sortedData = this.sortedData(data);
    return sortedData[Math.floor(k/100 * sortedData.length) - 1] + (k/100 % 1) * (sortedData[Math.floor(k/100 * sortedData.length)] - sortedData[Math.floor(k/100 * sortedData.length) - 1]);
  };

  this.standardDeviation = function(data){
    if(data === undefined)
      data = population;
    let diffSquare = [];
    let i = 0;
    while(i < data.length) {
      diffSquare.push(Math.pow(data[i] - this.mean(data), 2));
      i++;
    };
    return Math.sqrt(1/data.length * this.sum(diffSquare));
  };
}

// Mengelompokan data berdasarkan interval
function DataCluster(population, radius){
  this.findPeaks = function (array) {
    let peaks = [];
    for(let i = 0; i < array.length; i++){
      if(array[i] > array[i + 1])
        peaks.push(array[i]);
    }
    return peaks;
  };

  let clusters = [];
  let group = [];
  let pivot = population[0];
  this.sortedData = function(){
    function sortNumber(a,b) {
        return a - b;
    }
    return population.sort(sortNumber);
  };
  for(i = 0; i < this.sortedData().length; i++){
    if(this.sortedData()[i] <= pivot + radius){
      group.push(this.sortedData()[i]);
    } else {
      clusters.push(group);
      group = [];
      pivot = this.sortedData()[i];
      group.push(this.sortedData()[i]);
    }
  }
    clusters.push(group);  // Group terakhirs
  return clusters;
}
