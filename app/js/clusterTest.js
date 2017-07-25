
var clusteredData = [[]]
var alpha = 0.6
var beta = 0.9
var count = []
var epoch = 0

for (i = 0; i < 4; i++) {
  count[i] = 0
  let tmp = []
  tmp = dummyData[i]
  clusteredData[i] = tmp
}

//clustering sampai vektor pewakil semakin fokus
while (epoch < 10){
  for(i = 0; i < dummyData.length; j++){
    let distance = []
    //menghitung distance data terhadap vektor pewakil
    for (j = 0; j < 4; j++){
      distance[j] = Math.abs((clusteredData[j][0] - dummyData[i]))
    }

    //mencari nilai distance terkecil
    let min = 999
    let minimumDistanceIndex = 0
    for (j = 0; j < 4; j++){
      if (min >= distance[j]){
        min = distance[j]
        minimumDistanceIndex = j
      }
    }

    //update vektor pewakil dan memasukkan data ke cluster vektor pewakil
    clusteredData[minimumDistanceIndex][0] = clusteredData[minimumDistanceIndex][0] + (distance[minimumDistanceIndex]*alpha)
    count[minimumDistanceIndex] = count[minimumDistanceIndex] + 1
    clusteredData[minimumDistanceIndex][i] = dummyData[i]
  }

  //update alpha
  alpha = alpha*beta
  epoch++
}
