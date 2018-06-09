const Status = (function() {
		const STATUS_NUMBER = 6;
		
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

		Status.prototype.add = function(_status) {
			let result = new Status(this);
			for (let i = 0; i < STATUS_NUMBER; i++)
				result.vector[i] += _status.vector[i];
			return result;
		}
		Status.prototype.gt = function(_status) {
			for (let i = 0; i < STATUS_NUMBER; i++) {
				if (this.vector[i] < _status.vector[i])
					return false;
			}
			return true;
		}
		Status.prototype.lt = function(_status) {
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
		Status.prototype.ge = function(_status) {
			return !this.lt(_status);
		}
		Status.prototype.le = function(_status) {
			return !this.gt(_status);
		}
		Status.prototype.neq = function(_status) {
			return !this.eq(_status);
		}

		Status.STATUS_NUMBER = STATUS_NUMBER;
		
		return Status;
	})();
