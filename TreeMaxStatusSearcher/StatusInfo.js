const StatusInfo = (function() {
		const StatusInfo = function(_star, _cost, _stat, _bonus, _baseAddr, _partnerAddr, _combi) {
			this.star = _star;
			this.cost = _cost;
			this.stat = Object.assign(new Status(), _stat);
			this.bonus = Object.assign(new Status(), _bonus);
			this.baseAddr = _baseAddr;
			this.partnerAddr = _partnerAddr;
			this.combi = _combi;
		}

		return StatusInfo;
	})();
