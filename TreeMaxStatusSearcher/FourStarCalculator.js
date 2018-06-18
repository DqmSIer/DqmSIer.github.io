const FourStarCalculator = (function() {
		const FourStarCalculator = function() { }

		FourStarCalculator.prototype.search = function(_baseStatusList) {
			let status = _baseStatusList[0];
			for (let tc = 0; tc < _baseStatusList.length; tc++) {
				const baseStatusAddr = _baseStatusList[tc];

				for (let sc = 0; sc < Status.STAR_NUMBER; sc++)
					status = PowerUpper.prototype.powerUp(status, baseStatusAddr);
				if (tc < _baseStatusList.length - 1) {
					const nextBaseStatusAddr = _baseStatusList[tc + 1];
					status = TransUpper.prototype.transUp(status, baseStatusAddr, nextBaseStatusAddr);
				}
			}
			return status;
		}

		return FourStarCalculator;
	})();
