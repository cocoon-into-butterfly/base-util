/* minifyOnSave, filenamePattern: ../../dist/digest/$1.$2 */

/**
 * 编码
 * @type {String}
 */
(function(g, und) {
	var base_dic = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_=',
		bval_dic = "3Z2OMwRTvWcJ8j4u7pnrt65HAefIV9xSPqNCsmbEloYygXKzaULGkQhD0FB1di-_=";

	/**
	 * 编码(支持中文编码),使用URL安全编码,解码方请注意使用URL安全字典表进行解码
	 * 	encode('测试中文')		--> 5rWL6K-V5Lit5paH
	 *  encode('中华人民共和国') --> 5Lit5Y2O5Lq65rCR5YWx5ZKM5Zu9
	 *
	 *
	 * @param  {String} input 输入字符串
	 * @param  {String} dic   字典表,默认使用base64编码表
	 * @return {String}       编码后的结果
	 */
	function encode(input, dic) {
		var b64pad = '';
		var tab = dic || base_dic;
		var output = "";
		input = _utf8_encode(input);
		var len = input.length;
		for (var i = 0; i < len; i += 3) {
			var triplet = (input.charCodeAt(i) << 16) | (i + 1 < len ? input.charCodeAt(i + 1) << 8 : 0) | (i + 2 < len ? input.charCodeAt(i + 2) : 0);
			for (var j = 0; j < 4; j++) {
				if (i * 8 + j * 6 > input.length * 8) output += b64pad;
				else output += tab.charAt((triplet >>> 6 * (3 - j)) & 0x3F);
			}
		}
		return output;
	}

	/**
	 * 解码(支持中文), 使用URL安全解码,编码方请注意使用URL安全字典表进行编码
	 * @param  {String} input 编码字符串
	 * @param  {String} dic   字典表,默认使用base64编码表
	 * @return {String}       原文
	 */
	function decode(input, dic) {
		var tab = dic || base_dic;
		var output = "";
		var chr1, chr2, chr3;
		var enc1, enc2, enc3, enc4;
		var i = 0;

		while (i < input.length) {
			enc1 = tab.indexOf(input.charAt(i++));
			enc2 = tab.indexOf(input.charAt(i++));
			enc3 = tab.indexOf(input.charAt(i++));
			enc4 = tab.indexOf(input.charAt(i++));

			chr1 = (enc1 << 2) | (enc2 >> 4);
			chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
			chr3 = ((enc3 & 3) << 6) | enc4;

			output += String.fromCharCode(chr1);

			if (enc3 != 64) {
				output += String.fromCharCode(chr2);
			}
			if (enc4 != 64) {
				output += String.fromCharCode(chr3);
			}
		}
		output = output.toString()
		output = _utf8_decode(output);
		return output;
	}

	//支持中文编码
	function _utf8_encode(string) {
		string = string.replace(/\r\n/g, "\n");
		var utftext = "";
		for (var n = 0; n < string.length; n++) {
			var c = string.charCodeAt(n);
			if (c < 128) {
				utftext += String.fromCharCode(c);
			} else if ((c > 127) && (c < 2048)) {
				utftext += String.fromCharCode((c >> 6) | 192);
				utftext += String.fromCharCode((c & 63) | 128);
			} else {
				utftext += String.fromCharCode((c >> 12) | 224);
				utftext += String.fromCharCode(((c >> 6) & 63) | 128);
				utftext += String.fromCharCode((c & 63) | 128);
			}

		}
		return utftext;
	}

	// 支持中文解码
	function _utf8_decode(utftext) {
		var string = "";
		var i = 0;
		var c = c1 = c2 = 0;
		while (i < utftext.length) {
			c = utftext.charCodeAt(i);
			if (c < 128) {
				string += String.fromCharCode(c);
				i++;
			} else if ((c > 191) && (c < 224)) {
				c2 = utftext.charCodeAt(i + 1);
				string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
				i += 2;
			} else {
				c2 = utftext.charCodeAt(i + 1);
				c3 = utftext.charCodeAt(i + 2);
				string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
				i += 3;
			}
		}
		return string;
	}

	//export
	g.Base64 = {
		en: encode,
		de: decode
	}
	g.Bval = {
		en: function(obj) {
			return encode(JSON.stringify(obj), bval_dic);
		},
		de: function(str) {
			return JSON.parse(decode(str, bval_dic));
		}
	}
	g.bval = g.Bval.de;

	NS('Digest.Base64', g.Base64);
	NS('Digest.Bval', g.Bval);
})(window);
