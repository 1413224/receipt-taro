export function getFormatTimesTamp(val){
	if(val > 2554431132000) return '-';
	var date = new Date(val);
	var seperator1 = "-";
	var seperator2 = ":";
	var month = date.getMonth() + 1;
	var strDate = date.getDate();
	if(month >= 1 && month <= 9) {
		month = "0" + month;
	}
	if(strDate >= 0 && strDate <= 9) {
		strDate = "0" + strDate;
	}
	var hours = date.getHours();
	if(hours >= 0 && hours <= 9) {
		hours = "0" + hours;
	}
	var min = date.getMinutes();
	if(min >= 0 && min <= 9) {
		min = "0" + min;
	}
	var seconds = date.getSeconds();
	if(seconds >= 0 && seconds <= 9) {
		seconds = "0" + seconds;
	}
	var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate +
		" " + hours + seperator2 + min + seperator2 + seconds;
	return currentdate;
}

export function getFormatDateTamp(val, noDay){
	if(val > 2554431132000) return '-';
	var date = new Date(val);
	var seperator1 = "-";
	var seperator2 = ":";
	var month = date.getMonth() + 1;
	var strDate = date.getDate();
	if(month >= 1 && month <= 9) {
		month = "0" + month;
	}
	if(strDate >= 0 && strDate <= 9) {
		strDate = "0" + strDate;
	}
	if(noDay) {
		var currentdate = date.getFullYear() + '年' + month + '月'
	} else {
		var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
	}

	return currentdate;
}