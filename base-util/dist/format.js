(function(f,g){var e={dateParse:function(a){var b,c;Is.number(a)&&(a+="");if(Is.str(a)){if(/^[0-9]{13}$/.test(a))c=parseInt(a);else if(/^[0-9]{10}$/.test(a))c=1E3*parseInt(a);else try{a=a.replace(/\u5e74|\u6708|\u65e5/g,"-"),a=a.replace(/\u65f6|\u5206|\u79d2/g,":"),c=Date.parse(a)}catch(d){}c&&(b=new Date(c))}else Is.date(a)&&(b=a);return b},dateFormat:function(a,b){b=b||"yyyy-MM-dd hh:mm:ss";a=e.dateParse(a);var c={"M+":a.getMonth()+1,"d+":a.getDate(),"h+":a.getHours(),"m+":a.getMinutes(),"s+":a.getSeconds(),
"q+":Math.floor((a.getMonth()+3)/3),S:a.getMilliseconds()};/(y+)/.test(b)&&(b=b.replace(RegExp.$1,(a.getFullYear()+"").substr(4-RegExp.$1.length)));for(var d in c)(new RegExp("("+d+")")).test(b)&&(b=b.replace(RegExp.$1,1==RegExp.$1.length?c[d]:("00"+c[d]).substr((""+c[d]).length)));return b.trim()},size:function(a){var b=0;return b=1024<=a&&1048576>a?this.round(a/1024)+"K":1048576<=a&&1073741824>a?this.round(a/1048576)+"M":1073741824<=a?this.round(a/1073741824)+"G":a+"Byte"},round:function(a){return Math.round(100*
a)/100},bool:function(a){var b=!1;null===a||a===g?b=!1:Is.bool(a)?b=a:Is.str(a)?(a=a.toLowerCase(),b="t"==a||"1"==a||"true"==a||"on"==a):Is.number(a)&&(b=1<=a);return b}};f.Format=Base.Format=e})(window);