/* minifyOnSave, filenamePattern: ../dist/$1.$2 */


(function(g, und) {
	var kvdb = g.indexedDB || g.mozIndexedDB || g.webkitIndexedDB || g.msIndexedDB;

	function error(msg) {
		console.error(msg);
	}

	function IDBStorage() {
		var DBNAME = 'Base.ForageStorage',
			DBVERSION = 1,
			STORENAME = 'ForageStorage',
			db = null;

		function withStore(type, f) {
			if (db) {
				f(db.transaction(STORENAME, type).objectStore(STORENAME));
				return;
			}
			var openreq = kvdb.open(DBNAME, DBVERSION);
			openreq.onerror = function withStoreOnError() {
				error("不能打开数据库: '" + openreq.error.name + "'");
			};
			openreq.onupgradeneeded = function withStoreOnUpgradeNeeded() {
				openreq.result.createObjectStore(STORENAME);
			};
			openreq.onsuccess = function withStoreOnSuccess() {
				db = openreq.result;
				f(db.transaction(STORENAME, type).objectStore(STORENAME));
			};
		}

		function get(key, callback) {
			withStore('readonly', function getBody(store) {
				var req = store.get(key);
				req.onsuccess = function getOnSuccess() {
					var value = req.result !== undefined ? req.result : null;
					callback(value);
				};
				req.onerror = function getOnError() {
					error('Error in storage.get(): ' + req.error.name);
				};
			});
		}

		function remove(key, callback) {
			withStore('readwrite', function removeBody(store) {
				var req = store['delete'](key);
				if (callback) {
					req.onsuccess = function removeOnSuccess() {
						callback();
					};
				}
				req.onerror = function removeOnError() {
					error('Error in storage.remove(): ' + req.error.name);
				};
			});
		}

		function set(key, value, callback) {
			withStore('readwrite', function setBody(store) {
				var req = store.put(value, key);
				if (callback) {
					req.onsuccess = function setOnSuccess() {
						callback();
					};
				}
				req.onerror = function setOnError() {
					error('写入失败: ' + req.error.name);
				};
			});
		}

		function clear(callback) {
			withStore('readwrite', function clearBody(store) {
				var req = store.clear();
				if (callback) {
					req.onsuccess = function clearOnSuccess() {
						callback();
					};
				}
				req.onerror = function clearOnError() {
					error('清除失败: ' + req.error.name);
				};
			});
		}

		function support() {
			return !!kvdb;
		}

		//export
		return {
			/**
			 * 是否支持存储
			 * @type {[type]}
			 */
			support: support,
			/**
			 * 获取
			 * @type {[type]}
			 */
			get: get,

			/**
			 * 设置
			 * @type {[type]}
			 */
			set: set,

			/**
			 * 删除
			 * @type {[type]}
			 */
			remove: remove,

			/**
			 * 清空
			 * @type {[type]}
			 */
			clear: clear
		};
	}

	//export
	Base.Storage = new IDBStorage();

})(window);
