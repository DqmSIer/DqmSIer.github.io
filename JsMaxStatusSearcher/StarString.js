const StarString = (function() {
		const STAR_CHAR = "★";
		
		const StarString = function() { }
		
		StarString.prototype.make = function(_starCnt, _transCnt, _isCont, _contString) {
			let result;
			
			result = STAR_CHAR;
			for (let i = 0; i < _transCnt; i++)
				result += STAR_CHAR;
			result += _starCnt;
			
			if (_isCont)
				result += _contString;
			
			return result;
		}
		
		StarString.STAR_CHAR = STAR_CHAR;
		
		return StarString;
	})();

