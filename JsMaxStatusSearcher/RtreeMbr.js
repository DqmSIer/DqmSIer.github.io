const RtreeMbr = (function() {
		const RtreeMbr = function(_lower, _upper) {
			if (Number.isInteger(_lower)) {
				const _dimension = _lower;
				this.create(_dimension);
				return ;
			}
			this.set(_lower, _upper);
		}
		
		RtreeMbr.prototype.clear = function() {
			for (let i = 0; i < this.lowerPoint.length; i++)
				this.lowerPoint[i] = this.upperPoint[i] = 0;
		}
		RtreeMbr.prototype.create = function(_dimension) {
			this.lowerPoint = new Array(_dimension);
			this.upperPoint = new Array(_dimension);
			this.clear();
		}
		RtreeMbr.prototype.set = function(_lower, _upper) {
			this.lowerPoint = Object.assign(new Array(), _lower);
			this.upperPoint = Object.assign(new Array(), _upper);
		}
		RtreeMbr.prototype.extend = function(_lower, _upper) {
			for (let i = 0; i < _lower.length; i++) {
				if (this.lowerPoint[i] > _lower[i])
					this.lowerPoint[i] = _lower[i];
				if (this.upperPoint[i] < _upper[i])
					this.upperPoint[i] = _upper[i];
			}
		}
		RtreeMbr.prototype.overlap = function(_lower, _upper) {
			for (let i = 0; i < _lower.length; i++) {
				if (this.upperPoint[i] < _lower[i] || _upper[i] < this.lowerPoint[i])
					return false;
			}
			return true;
		}
		RtreeMbr.prototype.getArea = function() {
			let area = 1;
			for (let i = 0; i < this.lowerPoint.length; i++)
				area *= this.upperPoint[i] - this.lowerPoint[i];
			return area;
		}
		
		return RtreeMbr;
	})();
