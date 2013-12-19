define(function() {
	var Sabuk = {
		_promise: null,
		_libName: null,

		//0 = new Promise(function(resolve, reject) { ... })
		//1 = MyLibrary.defer().promise
		_syntax: 0,
		_deferFuncName: null
	};

	var LibraryConfigMap = {
		'bluebird': {
			_syntax: 1,
			_deferFuncName: 'defer',
			_libName: 'bluebird'
		}
	};

	if(Promise) {
		//We have native promises

		//Underlying library
		Sabuk._promise = Promise;

		//API interface adhering to syntax=0
		Sabuk.Promise = Promise;
	}

	var promiseConstructorFunctions = [
		Sabuk._promise,
		function() {}
	];

	Sabuk.setLibrary = function(Promise, libName) {
		if(LibraryConfigMap[libName]) {
			this._promise = Promise;
			var libConfig = LibraryConfigMap[libName];
			for(var key in libConfig) {
				Sabuk[key] = libConfig[key];
			}
		}
	};

	var deferFunctions = [
		function() {
			var deferred = {};
			var promiseDefine = function(f, r) {
				deferred.fulfill = f;
				deferred.reject = r;
			}
			deferred.promise = new Sabuk._promise(promiseDefine);

			return deferred;
		},
		function() {
			return Sabuk._promise[Sabuk._deferFuncName]();
		}
	];

	Sabuk.defer = function() {
		return deferFunctions[this._syntax]();
	};

	return Sabuk;
});