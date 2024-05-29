function padTwoDigits(num) {
    return num.toString().padStart(2, "0");
}


function dateInYyyyMmDdHhMmSs(date) {
    return (
      [
        date.getFullYear(),
        padTwoDigits(date.getMonth() + 1),
        padTwoDigits(date.getDate()),
      ].join("") +
      [
        "T",
        padTwoDigits(date.getHours()),
        padTwoDigits(date.getMinutes()),
        padTwoDigits(date.getSeconds()),
      ].join("")
    );
}



function dateFormatMinusThreeDay(date) {
    const today =date.getDate();
    if(today===1){
      date.setDate(0);
      return (
        [
          date.getFullYear(),
          padTwoDigits(date.getMonth() + 1),
          padTwoDigits(date.getDate()),
        ].join(" ") +
        [
          "T",
          padTwoDigits(date.getHours()),
          padTwoDigits(date.getMinutes()),
          padTwoDigits(date.getSeconds()),
        ].join("")
      );
    }else{
      return (
        [
          date.getFullYear(),
          padTwoDigits(date.getMonth() + 1),
          padTwoDigits(date.getDate()-3),
        ].join("")+
        [
          "T",
          padTwoDigits(date.getHours()),
          padTwoDigits(date.getMinutes()),
          padTwoDigits(date.getSeconds()),
        ].join("")
      );
    }
      
  }

function dateInYyyyMmDdHhMmSs2(date) {
    return (
      [
        date.getFullYear(),
        padTwoDigits(date.getMonth() + 1),
        padTwoDigits(date.getDate()),
      ].join("-") +
      " " +
      [
        padTwoDigits(date.getHours()),
        padTwoDigits(date.getMinutes()),
        padTwoDigits(date.getSeconds()),
      ].join(":")
    );
}




module.exports = {dateInYyyyMmDdHhMmSs,dateInYyyyMmDdHhMmSs2,dateFormatMinusThreeDay};