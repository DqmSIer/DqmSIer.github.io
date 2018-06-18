const TransUpper = (function() {
		const TR_RATE = 20;

		const TransUpper = function() { }

		TransUpper.prototype.calcTransUp = function(_value) {
			return parseInt((_value * TR_RATE + 100 - 1) / 100);
		}
		TransUpper.prototype.getTransUpValue = function(_base, _original) {
			let result = new Status(_base.vector.length);
			for (let i = 0; i < _base.vector.length; i++) {
				const diff = _base.vector[i] - _original.vector[i];
				result.vector[i] = TransUpper.prototype.calcTransUp(diff);
			}
			return result;
		}
		TransUpper.prototype.transUp = function(_base, _original, _nextOriginal) {
			let result = new Status(_nextOriginal);
			for (let i = 0; i < _base.vector.length; i++) {
				const diff = _base.vector[i] - _original.vector[i];
				result.vector[i] += TransUpper.prototype.calcTransUp(diff);
			}
			return result;
		}

		return TransUpper;
	})();
