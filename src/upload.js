/**
 * 文件上传API
 */
(function(g, und) {
	//input type="file"
	//上传图片文件
	function upimg(file, compress, progress, url, fn) {
		var reader = new FileReader();
		reader.addEventListener('loadend', function() {
			var upfile = function(blob, type) {
				alert('暂未实现, 需要时在加上.');
				// jEditor.Ajax.ajax({
				// 	url: url,
				// 	method: 'post',
				// 	dataType: 'json',
				// 	data: blob,
				// 	progress: progress,
				// 	headers: {
				// 		Filename: encodeURIComponent(file.name)
				// 	}
				// }).then(function(e) {
				// 	fn && fn(e);
				// });
			}
			compress ? compress(reader.result, file.type, {
				width: 640
			}, 0.8, upfile) : upfile(new Blob([reader.result], {
				type: file.type
			}));
		});
		reader[compress ? 'readAsDataURL' : 'readAsArrayBuffer'](file);
	}

	function compress(imgURI, type, compressSize, quality, success) {
		var img = new Image();
		img.onload = function() {
			var canvas = document.createElement("canvas");
			var ctx = canvas.getContext("2d");
			ctx.clearRect(0, 0, canvas.width, canvas.height);

			var orignalWidth = this.width,
				orignalHeight = this.height,
				rate = orignalWidth / orignalHeight,
				finalWidth = 0,
				finalHeight = 0;

			if (orignalWidth <= compressSize.width) {
				finalWidth = orignalWidth;
				finalHeight = orignalHeight;
			} else if (orignalWidth > compressSize.width) {
				finalWidth = compressSize.width;
				finalHeight = finalWidth / rate;
			}
			finalHeight = compressSize.height ? compressSize.height : finalHeight;
			canvas.width = finalWidth;
			canvas.height = finalHeight;
			ctx.drawImage(img, 0, 0, finalWidth, finalHeight);

			var bin = (type === 'image/gif' && orignalWidth <= compressSize.width) ? atob(imgURI.split(',')[1]) : atob(canvas.toDataURL(
					type, quality).split(',')[1]),
				len = bin.length,
				len32 = len >> 2,
				a8 = new Uint8Array(len),
				a32 = new Uint32Array(a8.buffer, 0, len32);

			for (var i = 0, j = 0; i < len32; i++) {
				a32[i] = bin.charCodeAt(j++) |
					bin.charCodeAt(j++) << 8 |
					bin.charCodeAt(j++) << 16 |
					bin.charCodeAt(j++) << 24;
			}

			var tailLength = len & 3;

			while (tailLength--) {
				a8[j] = bin.charCodeAt(j++);
			}

			success(new Blob([a8], {
				'type': type || 'image/png'
			}), (type === 'image/gif' && orignalWidth > compressSize.width) ? 'image/png' : type);


		}
		img.src = imgURI;
	}



	function up(file, setting) {
		var reader = new FileReader();
		reader.addEventListener('loadend', function() {
			var upfile = function(blob, type) {
				alert('暂未实现, 需要时在加上.');
				// var xhr = new XMLHttpRequest();
				// xhr.onreadystatechange = function() {
				// 	if (xhr.readyState == 4 && xhr.status == 200) {
				// 		var text = JSON.parse(xhr.responseText);
				// 		if (text.ec == -100) {
				// 			window.location.href = "login.html";
				// 		} else if (text.ec == -1) {
				// 			loading.hide();
				// 			def.reject(text);
				// 		} else {
				// 			loading.hide();
				// 			def.resolve(text);
				// 		}
				// 	}
				// };
				// xhr.open('POST', url);
				// xhr.setRequestHeader('Content-Type', type);
				// xhr.setRequestHeader('Filename', encodeURIComponent(file.name));
				// xhr.send(blob);
			};
			upfile(new Blob([reader.result], {
				type: file.type
			}), file.type);
		});
		reader.readAsArrayBuffer(file);
	}

	//export
	g.Upload = Base.Upload = {
		file: up,
		img: upimg
	}
})(window);
