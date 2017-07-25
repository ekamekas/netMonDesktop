rawData[] = {}
clusteredData[][] = {}

alpha = 0.6
beta = 0.9

//inisialisasi vektor pewakil. jumlah vektor pewakilnya adalah 4
for i = 1:4
  clusteredData[i][0] = rawData[i]
end

//clustering sampai vektor pewakil semakin fokus
while (alpha >= 0.0001)
  for i = 1:rawData.length
    //menghitung distance data terhadap vektor pewakil
    for j = 1:4
      distance[j] = sqrt((clusteredData[j][0] - rawData[i])^2)
    end

    //mencari nilai distance terkecil
    min = 999999
    for j = 1:4
      if (min >= distance[j])
        min = distance[j]
        minimumDistanceIndex = j
      end
    end

    //update vektor pewakil dan memasukkan data ke cluster vektor pewakil
    clusteredData[minimumDistanceIndex][0] = clusteredData[minimumDistanceIndex][0] + (distance[minimumDistanceIndex]*alpha)
    clusteredData[minimumDistanceIndex][].push(rawData[i])
  end

  //update alpha
  alpha = alpha*beta
end

//sorting vektor pewakil dari rendah ke tinggi
for i = 1:3
  for j = i:4
    if (clusteredData[i][0] > clusteredData[j][0])
      temp[] = clusteredData[j][]
      clusteredData[j][] = clusteredData[i][]
      clusteredData[i][] = temp[]
    end
  end
end

//menentukan cluster signifikan tertinggi
range = 99999
population = -99999
pointer = 0
//menghitung maximum range data tiap cluster
for i = 1:4
maxRange[i] = 99999
  for j = 1:clusteredData[i][].length
  rangeVektor[j] = sqrt((clusteredData[i][0] - clusteredData[i][j])^2)
    if (rangeVektor[j] < maxRange[i])
      maxRange[i] = rangeVektor[j]
    end
  end
end
//menentukan cluster signifikan tertinggi
for i = 1:4
  if (range <= 1.5*maxRange[i] && population >= 0.3*clusteredData[i][].length)
    pointer = i
    range = maxRange
    population = clusteredData[i][].length
  end
end

//menghitung rata-rata data pada cluster signifikan tertinggi
for i = 1:clusteredData[pointer][].length

end
