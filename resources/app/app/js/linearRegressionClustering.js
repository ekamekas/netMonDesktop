var y = [/*sortedData from peakSelection, put them here*/]
var dataSize = y.length                             //dataSize adalah jumlah data yang ada pada variable y
var x = []                                          //x menyimpan nilai 1 sampai dataSize untuk memudahkan regresi
for (let i = 0; i <= dataSize - 1; i++){            //pengisian nilai variable x
  x[i] = i+1
}

var clusterMemberNumber = 0                         //urutan data dalam cluster sekarang
var clusterNumber = 0                               //urutan cluster sekarang
var firstMemberIndex = 0                            //urutan data pada variable y yang menjadi data pertama pada cluster sekarang
var clusteredData = [[]]                            //clusteredData menyimpan data yang telah terkelompok
clusteredData[0][0] = y[0]

var error = 1                                       //nilai error data sekarang terhadap data hasil regresi
var errorTotal = 1                                  //rata-rata error dari clusteredData sekarang terhadap y


for (i = 1; i <= dataSize - 1; i++){
  var y_new = []                                    //data hasil regresi
  sum_x = 0
  sum_y = 0
  sum_xy = 0
  sum_x2 = 0

  if (clusterMemberNumber <= 2){                    //3 data awal tiap cluster menjadi acuan penentuan data hasil regresi
    for (j = firstMemberIndex; j <= i; j++){
        sum_x = sum_x + x[j]
        sum_y = sum_y + y[j]
        sum_xy = sum_xy + x[j]*y[j]
        sum_x2 = sum_x2 + Math.pow(x[j], 2)
    }

    a1 = (((i + 1 - firstMemberIndex)*sum_xy) - (sum_x*sum_y))/(((i + 1 - firstMemberIndex)*sum_x2) - Math.pow(sum_x, 2))
    a0 = ((sum_y*sum_x2) - (sum_x*sum_xy))/(((i + 1 - firstMemberIndex)*sum_x2) - Math.pow(sum_x, 2))
    k = 0
    for (j = firstMemberIndex; j <= i; j++){
      y_new[k] = a1*x[j] + a0                       //penentuan nilai-nilai data hasil regresi sekarang
      clusteredData[clusterNumber][j] = y_new[k]    //pengisian data hasil regresi ke clusteredData
      k = k + 1
    }
    clusterMemberNumber = clusterMemberNumber + 1
  } else{                                         //jika pada cluster, urutan data sudah melewati 3, maka lakukan regresi untuk mengecek errornya terhadap data hasil regresi sekarang
    for (j = firstMemberIndex; j <= i; j++){
        sum_x = sum_x + x[j]
        sum_y = sum_y + y[j]
        sum_xy = sum_xy + x[j]*y[j]
        sum_x2 = sum_x2 + Math.pow(x[j], 2)
    }

    a1 = (((i + 1 - firstMemberIndex)*sum_xy) - (sum_x*sum_y))/(((i + 1 - firstMemberIndex)*sum_x2) - Math.pow(sum_x, 2))
    a0 = ((sum_y*sum_x2) - (sum_x*sum_xy))/(((i + 1 - firstMemberIndex)*sum_x2) - Math.pow(sum_x, 2))
    k = 0
    for (j = firstMemberIndex; j <= i; j++){
      y_new[k] = a1*x[j] + a0
      k = k + 1
    }
    k = 0
    errorTotal = 0;
    comparedIndex = y_new.length - 1
    for (j = firstMemberIndex; j <= i - 1; j++){
      errorTotal = errorTotal + Math.abs(y[j] - y_new[k])
      k = k + 1
    }
    errorTotal = errorTotal/(i - firstMemberIndex)
    error = Math.abs(y[i] - y_new[comparedIndex])

    if (error <= errorTotal){                     //jika error data sekarang terhadap data hasil regresi kurang dari rata-rata seluruh error data hasil regresi sekarang, maka data dimasukkan ke dalam satu cluster
      comparedIndex = y_new.length - 1
      k = 0
      for (j = firstMemberIndex; j <= i; j++){
        clusteredData[clusterNumber][j] = y_new[k]
        k = k + 1
      }
      clusterMemberNumber = clusterMemberNumber + 1
    } else{                                       //jika error lebih dari error rata-rata seluruh data hasil regresi, maka data sekarang menjadi data pertama di cluster berikutnya
      clusteredData.push([])
      clusterNumber = clusterNumber + 1
      clusteredData[clusterNumber][i] = y[i]
      clusterMemberNumber = 0
      firstMemberIndex = i
    }
  }
}
effectiveBandwidth = clusteredData[clusteredData.length - 3][clusteredData[clusteredData.length - 3].length - 1]      //nilai hasil estimasi
console.log(effectiveBandwidth)
