var x = []                  //x adalah rawData
var dataSize = x.length     //dataSize menyimpan nilai ukuran array

var selectedIndex = 0       //selectedIndex adalah nilai yang menentukan current index pada selectedData
var selectedData = []       //selectedData menyimpan nilai rawData yang terkategori sebagai peak
var indicator = 1           //indicator mengindikasikan suatu nilai rawData untuk diproses atau diabaikan (genap atau ganjil)

for (let i = 0; i <= dataSize - 1; i++){
  if (i != 0 && i != dataSize - 1){                         //jika urutan data sekarang bukan data pertama dan bukan data terakhir
    if (indicator == 1 && i%2 != 0){                        //jika terindikasi urutan data sekarang merupakan urutan yang genap
      if (x[i] >= x[i-1] && x[i] >= x[i+1] && x[i] != 0){   //jika terindikasi data sekarang lebih besar sama dengan data sebelum dan sesudahnya
        selectedData[selectedIndex] = x[i]
        selectedIndex = selectedIndex + 1
        indicator = 0
      }
    } else if (indicator == 0 && i%2 == 0){                //jika terindikasi data sekarang lebih besar sama dengan data sebelum dan sesudahnya
      if (x[i] >= x[i-1] && x[i] >= x[i+1] && x[i] != 0){
        selectedData[selectedIndex] = x[i]
        selectedIndex = selectedIndex + 1
        indicator = 1
      }
    }
  } else if (i == 0){                                        //jika terindikasi urutan data sekarang adalah urutan pertama
      if (x[i] >= x[i+1] && x[i] != 0){     //jika terindikasi data sekarang lebih besar sama dengan data sebelum dan sesudahnya
        selectedData[selectedIndex] = x[i]
        selectedIndex = selectedIndex + 1
      }
  }else{                                                   //jika terindikasi urutan data sekarang adalah urutan terakhir
    if (x[i] >= x[i-1] && x[i] != 0){     //jika terindikasi data sekarang lebih besar sama dengan data sebelum dan sesudahnya
      selectedData[selectedIndex] = x[i]
    }
  }
}
sortedData = selectedData.sort()
console.log(sortedData)
