(function(k,l){function d(){return this.replace(/(^\s*)|(\s*$)/g,"")}function f(b,a){a=Object.isNumber(a)?a:0;return this.lastIndexOf(b,a)===a}function g(b,a){b=String(b);a=Object.isNumber(a)?a:this.length;0>a&&(a=0);a>this.length&&(a=this.length);var c=a-b.length;return 0<=c&&this.indexOf(b,c)===c}function h(b,a,c){return RegExp.prototype.isPrototypeOf(b)?this.replace(b,a):this.replace(new RegExp(b,c?"gi":"g"),a)}Base.extend(String.prototype,{tidy:function(){return this.replace(/\s+/g," ")},safely:function(){return this.replace(/'|"|-|\/|\\|;|=/g,
"")},startsWith:String.prototype.startsWith||f,endsWith:String.prototype.endsWith||g,trim:String.prototype.trim||d,replaceAll:String.prototype.replaceAll||h,hashCode:function(){for(var b=0,a,c=0;c<this.length;c++)if(a=this.charCodeAt(c),32!=a&&10!=a&&13!=a&&9!=a&&(b=31*b+a,2147483647<b||-2147483648>b))b&=4294967295;return b.toString(16)},toArray:function(){return this.split(/\n|;|,|\/|\\|\|| /g)},parseText:function(b,a,c){b=new RegExp("([^"+b+""+a+"]+)"+a+"([^"+b+"]*)","g");for(var d=decodeURIComponent,
e={};a=b.exec(this);)e[a[1].trim()]=c?d(a[2].trim()):a[2].trim();return e}})})(window);