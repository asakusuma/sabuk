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

	if(Promise && Promise.toString().indexOf('[native code]') > -1) {
		//We have native promises

		//Underlying library
		Sabuk._promise = Promise;

		//API interface adhering to syntax=0
		Sabuk.Promise = Promise;
	}

	var rejectFunctions = ['reject', 'fail'];
	var fulfillFunctions = ['fulfill', 'resolve'];

	Sabuk.setLibrary = function(Promise, libName) {
		if(LibraryConfigMap[libName]) {
			this._promise = Promise;
			var libConfig = LibraryConfigMap[libName];
			for(var key in libConfig) {
				this[key] = libConfig[key];
			}

			if(this._syntax === 1) {
				//Setup resolution proxies
				var i, rejectFunctionName, fulfillFunctionName;

				//Find the rejection function
				for(i = 0; i < rejectFunctions.length; i++) {
					if(typeof this[rejectFunctions[i]] === 'function') {
						rejectFunctionName = rejectFunctions[i];
					}
				}

				//Setup proxies to rejection function
				for(i = 0; i < rejectFunctions.length; i++) {
					if(!this[rejectFunctions[i]]) {
						this[rejectFunctions[i]] = this[rejectFunctionName];
					}
				}

				//Find the fulfill function
				for(i = 0; i < fulfillFunctions.length; i++) {
					if(typeof this[fulfillFunctions[i]] === 'function') {
						fulfillFunctionName = fulfillFunctions[i];
					}
				}

				//Setup proxies to fulfill function
				for(i = 0; i < fulfillFunctions.length; i++) {
					if(!this[fulfillFunctions[i]]) {
						this[fulfillFunctions[i]] = this[fulfillFunctionName];
					}
				}
			}
		}
	};

	var promiseConstructorFunctions = [
		Sabuk._promise,
		function(closure) {
			var d = Sabuk.defer();

			closure(function fulfill(value) {
				d.fulfill.call(d, value);
			}, function reject(reason) {
				d.reject(d, reason);
			});

			return d.promise;
		}
	];

	Sabuk.Promise = function(closure) {
		if(!this._promise) {
			throw new Error('No promise library has been set.');
		}
		return promiseConstructorFunctions[this._syntax](closure);
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
		if(!this._promise) {
			throw new Error('No promise library has been set.');
		}
		return deferFunctions[this._syntax]();
	};

	return Sabuk;
});