var dummyData = [
  3, 4, 5, 2, 4, 5, 5,
  6, 4, 20, 600, 5, 3, 5,
  2, 7, 30, 78, 23, 23, 43,
  50, 68, 52, 44, 47, 55, 56
]

function Cluster(population, radius){
  let clusters = []
  let group = []
  let pivot = population[0]
  this.sortedData = function(){
    function sortNumber(a,b) {
        return a - b
    }
    return population.sort(sortNumber)
  }
  for(i = 0; i < this.sortedData().length; i++){
    if(this.sortedData()[i] <= pivot + radius){
      group.push(this.sortedData()[i])
    } else {
      clusters.push(group)
      group = []
      pivot = this.sortedData()[i]
      group.push(this.sortedData()[i])
    }
  }
  return clusters
}
