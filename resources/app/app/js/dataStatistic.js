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
  this.population = population
  this.findPeaks = function (array) {
    let peaks = [];
    for(let i = 0; i < array.length; i++){
      if(array[i] > array[i + 1])
        peaks.push(array[i]);
    }
    return peaks;
  };

  // let clusters = [];
  // let group = [];
  // let pivot = this.population[0];
  this.sortedData = function(){
    function sortNumber(a,b) {
        return a - b;
    }
    return this.population.sort(sortNumber);
  };
  // for(i = 0; i < this.sortedData().length; i++){
  //   if(this.sortedData()[i] <= pivot + radius){
  //     group.push(this.sortedData()[i]);
  //   } else {
  //     clusters.push(group);
  //     group = [];
  //     pivot = this.sortedData()[i];
  //     group.push(this.sortedData()[i]);
  //   }
  // }
  //   clusters.push(group);  // Group terakhirs
    
  this.findDominanPeak = (population) => {
    if(population === undefined)
        population = this.population
    let sortedData = []
    let selectedIndex = 0       //selectedIndex adalah nilai yang menentukan current index pada selectedData
    let selectedData = []       //selectedData menyimpan nilai rawData yang terkategori sebagai peak  
    let indicator = 1           //indicator mengindikasikan suatu nilai rawData untuk diproses atau diabaikan (genap atau ganjil)
    var dataSize = population.length     //dataSize menyimpan nilai ukuran array
    
    for (let i = 0; i <= population.length - 1; i++){
      if (i != 0 && i != population.length - 1){                         //jika urutan data sekarang bukan data pertama dan bukan data terakhir
        if (indicator == 1 && i%2 != 0){                        //jika terindikasi urutan data sekarang merupakan urutan yang ganjil
          if (population[i] >= population[i-1] && population[i] >= population[i+1]){   //jika terindikasi data sekarang lebih besar sama dengan data sebelum dan sesudahnya
            sortedData.push(population[i])
            indicator = 0
          }
        } else if (indicator == 0 && i%2 == 0){                //jika terindikasi data sekarang lebih besar sama dengan data sebelum dan sesudahnya
          if (population[i] >= population[i-1] && population[i] >= population[i+1]){
            sortedData.push(population[i])
            indicator = 1
          }
        }
      } else if (i == 0){                                        //jika terindikasi urutan data sekarang adalah urutan pertama
        if (population[i] >= population[i+1]){     //jika terindikasi data sekarang lebih besar sama dengan data sebelum dan sesudahnya
          sortedData.push(population[i])
        }
      }else{                                                   //jika terindikasi urutan data sekarang adalah urutan terakhir
        if (population[i] >= population[i-1]){     //jika terindikasi data sekarang lebih besar sama dengan data sebelum dan sesudahnya
          sortedData.push(population[i])
        }
      }
    }
    var x = []                                          //x menyimpan nilai 1 sampai dataSize untuk memudahkan regresi
    for (let i = 0; i <= sortedData.length - 1; i++){            //pengisian nilai variable x
      x[i] = i+1
    }
    try{

      var clusterMemberNumber = 0                         //urutan data dalam cluster sekarang
      var clusterNumber = 0                               //urutan cluster sekarang
      var firstMemberIndex = 0                            //urutan data pada variable y yang menjadi data pertama pada cluster sekarang
      var clusteredData = [[]]                            //clusteredData menyimpan data yang telah terkelompok
      clusteredData[0][0] = sortedData[0]

      var error = 1                                       //nilai error data sekarang terhadap data hasil regresi
      var errorTotal = 1                                  //rata-rata error dari clusteredData sekarang terhadap y


      for (i = 1; i <= sortedData.length - 1; i++){
        var y_new = []                                    //data hasil regresi
        sum_x = 0
        sum_y = 0
        sum_xy = 0
        sum_x2 = 0

        if (clusterMemberNumber <= 2){                    //3 data awal tiap cluster menjadi acuan penentuan data hasil regresi
          for (j = firstMemberIndex; j <= i; j++){
              sum_x = sum_x + x[j]
              sum_y = sum_y + sortedData[j]
              sum_xy = sum_xy + x[j]*sortedData[j]
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
              sum_y = sum_y + sortedData[j]
              sum_xy = sum_xy + x[j]*sortedData[j]
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
            errorTotal = errorTotal + Math.abs(sortedData[j] - y_new[k])
            k = k + 1
          }
          errorTotal = errorTotal/(i - firstMemberIndex)
          error = Math.abs(sortedData[i] - y_new[comparedIndex])

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
            clusteredData[clusterNumber][i] = sortedData[i]
            clusterMemberNumber = 0
            firstMemberIndex = i
          }
        }
      }
      if(clusteredData.length == 1){
        effectiveBandwidth = clusteredData[0][clusteredData.length-1]
      } else if(clusteredData.length == 2){
        effectiveBandwidth = new DataStatistic(clusteredData[1]).percentil(25)
      } else {
        effectiveBandwidth = clusteredData[clusteredData.length - 3][clusteredData[clusteredData.length - 3].length - 1]      //nilai hasil estimasi
      }
    }catch(err){
      effectiveBandwidth = undefined
      alert("Ada sesuatu yang salah")
    }
    return effectiveBandwidth
  }
  // return clusters;
}
