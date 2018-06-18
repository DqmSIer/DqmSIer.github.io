const MaxStatusSearcher = (function() {
		const ZeroStatus = new Status(Status.STATUS_NUMBER);
		const StatusGetter = function(_statusInfo) { return _statusInfo.stat; };
		const BonusGetter = function(_statusInfo) { return _statusInfo.bonus; };
		const StatusCompar = function(_info1, _info2) { return (_info2.stat.neq(_info1.stat)) ? 0 : ((_info2.cost < _info1.cost) ? 1 : -1); };
		const PowerUpCompar = function(_info1, _info2) { return (_info2.bonus.neq(_info1.bonus)) ? 0 : ((_info2.cost < _info1.cost) ? 1 : -1); };
		const TransUpCompar = function(_info1, _info2) { return (_info2.bonus.neq(_info1.bonus)) ? 0 : ((_info2.cost < _info1.cost) ? 1 : -1); };

		const MaxStatusSearcher = function() { }

		MaxStatusSearcher.prototype.transUp = function(_transCnt, _baseStatusAddr, _puBaseIndex, _puPartnerIndex, _trBaseIndex, _trFormerIndex, _partialMaxIndex) {
			let maxStatusInfoAddr = null;

			// if (_transCnt === 0) {
			if (_trFormerIndex === null) {
				const nextCombi = StarString.prototype.make(0, 0, false, "");
				let nextStatusInfo = new StatusInfo(0, 1, _baseStatusAddr, PowerUpper.prototype.getPowerUpValue(_baseStatusAddr), null, null, nextCombi);

				_puBaseIndex.insert(Object.assign(new StatusInfo(),  nextStatusInfo), StatusGetter, StatusGetter);
				_puPartnerIndex.insert(Object.assign(new StatusInfo(), nextStatusInfo), BonusGetter, BonusGetter);
				nextStatusInfo.bonus = Object.assign(new Status(),  ZeroStatus);
				_trBaseIndex.insert(nextStatusInfo, BonusGetter, BonusGetter);

				maxStatusInfoAddr = Object.assign(new StatusInfo(), nextStatusInfo);
			}
			else {
				const trFormerQueue = _trFormerIndex.referObjectPool();
				for (let i = 0; i < trFormerQueue.length; i++) {
					const formerInfoAddr = trFormerQueue[i];
					const nextStatus = _baseStatusAddr.add(formerInfoAddr.bonus);
					const nextCombi = StarString.prototype.make(0, _transCnt, !(formerInfoAddr.star === 0 && formerInfoAddr.cost === 1),
										    "[" + formerInfoAddr.combi + "]");
					let nextStatusInfo = new StatusInfo(0, formerInfoAddr.cost, nextStatus, PowerUpper.prototype.getPowerUpValue(nextStatus),
									    formerInfoAddr, null, nextCombi);

					_puBaseIndex.insert(Object.assign(new StatusInfo(),  nextStatusInfo), StatusGetter, StatusGetter);
					_puPartnerIndex.insert(Object.assign(new StatusInfo(), nextStatusInfo), BonusGetter, BonusGetter);
					nextStatusInfo.bonus = TransUpper.prototype.getTransUpValue(nextStatusInfo.stat, _baseStatusAddr);
					_trBaseIndex.insert(nextStatusInfo, BonusGetter, BonusGetter);

					maxStatusInfoAddr = Object.assign(new StatusInfo(), nextStatusInfo);
				}
			}

			return maxStatusInfoAddr;
		}

		MaxStatusSearcher.prototype.powerUp = function(_isLast, _maxStatusInfoAddr, _starCnt, _transCnt, _baseStatusAddr,
							       _puBaseIndex, _puPartnerIndex, _trBaseIndex, _partialMaxIndex) {
			const puBaseQueue = _puBaseIndex.referObjectPool();
			const puPartnerQueue = _puPartnerIndex.referObjectPool();
			let laterUpdateQueue = new Array();
			let maxStatusInfoAddr = _maxStatusInfoAddr;

			for (let i = 0; i < puBaseQueue.length; i++) {
				const baseInfoAddr = puBaseQueue[i];
				if (baseInfoAddr.star < _starCnt)
					continue; 

				for (let j = 0; j < puPartnerQueue.length; j++) {
					const partnerInfoAddr = puPartnerQueue[j];
					if (baseInfoAddr.star < partnerInfoAddr.star)
						continue;

					const nextStatus = baseInfoAddr.stat.add(baseInfoAddr.bonus).add(partnerInfoAddr.bonus);
					const nextCombi = StarString.prototype.make(_starCnt + 1, _transCnt,
										    !(baseInfoAddr.star === baseInfoAddr.cost - 1
										      && partnerInfoAddr.star === 0
										      && partnerInfoAddr.cost === 1),
										    "(" + baseInfoAddr.combi + "+" + partnerInfoAddr.combi + ")");
					let nextStatusInfo = new StatusInfo(baseInfoAddr.star + 1,
									    baseInfoAddr.cost + partnerInfoAddr.cost,
									    nextStatus,
									    PowerUpper.prototype.getPowerUpValue(nextStatus),
									    Object.assign(new StatusInfo(), baseInfoAddr), 
									    Object.assign(new StatusInfo(), partnerInfoAddr),
									    nextCombi);

					if (_starCnt < Status.STAR_NUMBER - 1)
						laterUpdateQueue.push(Object.assign(new StatusInfo(), nextStatusInfo));

					if (!_isLast) {
						nextStatusInfo.bonus = TransUpper.prototype.getTransUpValue(nextStatus, _baseStatusAddr);
						_trBaseIndex.update(nextStatusInfo, BonusGetter, BonusGetter, TransUpCompar);
					}
					else if (_starCnt === Status.STAR_NUMBER - 1) {
						if (nextStatusInfo.stat.eqPartial(maxStatusInfoAddr.stat, _partialMaxIndex)) {
							if (nextStatusInfo.cost <= maxStatusInfoAddr.cost)
								maxStatusInfoAddr = nextStatusInfo;
						}
						else if (nextStatusInfo.stat.gePartial(maxStatusInfoAddr.stat, _partialMaxIndex))
							maxStatusInfoAddr = nextStatusInfo;
					}
				}
			}

			for (let i = 0; i < laterUpdateQueue.length; i++) {
				const updateInfo = laterUpdateQueue[i];
				_puBaseIndex.update(updateInfo, StatusGetter, StatusGetter, StatusCompar);
				_puPartnerIndex.update(updateInfo, BonusGetter, BonusGetter, PowerUpCompar);
			}

			return maxStatusInfoAddr;
		}

		MaxStatusSearcher.prototype.search = function(_baseStatusList, _partialMaxIndex) {
			let puBaseIndexList = new Array();
			let puPartnerIndexList = new Array();
			let trBaseIndexList = new Array();
			let maxStatusInfoAddr = null;

			for (let tc = 0; tc < _baseStatusList.length; tc++) {
				const baseStatusAddr = _baseStatusList[tc];
				let puBaseIndex = new Rtree(Status.STATUS_NUMBER);
				let puPartnerIndex = new Rtree(Status.STATUS_NUMBER);
				let trBaseIndex = new Rtree(Status.STATUS_NUMBER);
				let trFormerIndex = (tc > 0) ? trBaseIndexList[tc - 1] : null;

				puBaseIndexList.push(puBaseIndex);
				puPartnerIndexList.push(puPartnerIndex);
				trBaseIndexList.push(trBaseIndex);

				maxStatusInfoAddr = this.transUp(tc, baseStatusAddr, puBaseIndex, puPartnerIndex, trBaseIndex, trFormerIndex);
				for (let sc = 0; sc < Status.STAR_NUMBER; sc++)
					maxStatusInfoAddr = this.powerUp(tc === _baseStatusList.length - 1, maxStatusInfoAddr,
									 sc, tc, baseStatusAddr, puBaseIndex, puPartnerIndex, trBaseIndex, _partialMaxIndex);
			}

			return maxStatusInfoAddr;
		}

		return MaxStatusSearcher;
	})();
