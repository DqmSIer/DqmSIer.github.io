const PowerUpper = (function() {
		const PU_RATE = 2;

		const PowerUpper = function() { }

		PowerUpper.prototype.calcPowerUp = function(_value) {
			return parseInt((_value * PU_RATE + 100 - 1) / 100);
		}
		PowerUpper.prototype.getPowerUpValue = function(_base, _partner) {
			let result = new Status(_base.vector.length);

			if (_partner === undefined) {
				for (let i = 0; i < _base.vector.length; i++)
					result.vector[i] = PowerUpper.prototype.calcPowerUp(_base.vector[i]);
			}
			else {
				for (let i = 0; i < _base.vector.length; i++)
					result.vector[i] = PowerUpper.prototype.calcPowerUp(_base.vector[i]) + PowerUpper.prototype.calcPowerUp(_partner.vector[i]);
			}
			return result;
		}
		PowerUpper.prototype.powerUp = function(_base, _partner) {
			let result = new Status(_base);
			for (let i = 0; i < _base.vector.length; i++)
				result.vector[i] += PowerUpper.prototype.calcPowerUp(_base.vector[i]) + PowerUpper.prototype.calcPowerUp(_partner.vector[i]);
			return result;
		}

		return PowerUpper;
	})();
