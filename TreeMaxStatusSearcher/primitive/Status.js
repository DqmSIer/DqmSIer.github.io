const Status = (function() {
		const STATUS_NUMBER = 6;
		const STAR_NUMBER = 4;
		const Status = function(_status) {
			if (_status instanceof Status)
				this.vector = Object.assign(new Array(), _status.vector);
			else if (_status instanceof Array)
				this.vector = Object.assign(new Array(), _status);
			else {
				let vector = new Array(STATUS_NUMBER);
				for (let i = 0; i < STATUS_NUMBER; i++)
					vector[i] = 0;
				this.vector = vector;
			}
		}

		Status.prototype.clear = function() {
			for (let i = 0; i < STATUS_NUMBER; i++)
				this.vector[i] = 0;
		}
		Status.prototype.add = function(_status) {
			let result = new Status(this);
			for (let i = 0; i < STATUS_NUMBER; i++)
				result.vector[i] += _status.vector[i];
			return result;
		}
		Status.prototype.sub = function(_status) {
			let result = new Status(this);
			for (let i = 0; i < STATUS_NUMBER; i++)
				result.vector[i] -= _status.vector[i];
			return result;
		}
		Status.prototype.ge = function(_status) {
			for (let i = 0; i < STATUS_NUMBER; i++) {
				if (this.vector[i] < _status.vector[i])
					return false;
			}
			return true;
		}
		Status.prototype.le = function(_status) {
			for (let i = 0; i < STATUS_NUMBER; i++) {
				if (this.vector[i] > _status.vector[i])
					return false;
			}
			return true;
		}
		Status.prototype.eq = function(_status) {
			for (let i = 0; i < STATUS_NUMBER; i++) {
				if (this.vector[i] !== _status.vector[i])
					return false;
			}
			return true;
		}
		Status.prototype.neq = function(_status) {
			return !this.eq(_status);
		}

		Status.prototype.gePartial = function(_status, _index) {
			let len = _index.length;
			for (let i = 0; i < len; i++) {
				let idx = _index[i];
				if (this.vector[idx] < _status.vector[idx])
					return false;
			}
			return true;
		}
		Status.prototype.eqPartial = function(_status, _index) {
			let len = _index.length;
			for (let i = 0; i < len; i++) {
				let idx = _index[i];
				if (this.vector[idx] !== _status.vector[idx])
					return false;
			}
			return true;
		}

		Status.STATUS_NUMBER = STATUS_NUMBER;
		Status.STAR_NUMBER = STAR_NUMBER;

		return Status;
	})();
