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

		StatusInfo.prototype.printHistoryConsole = function(_statusInfo, _dstTag) {
			const PrintFunc = (function(_statusInfo, _dstTag) {
					_dstTag.innerHTML += '--- ' + _statusInfo.combi + ' ----\n';
                                        for (let i = 0; i < Status.STATUS_NUMBER; i++)
						_dstTag.innerHTML += _statusInfo.stat.vector[i] + ' [' + _statusInfo.bonus.vector[i] + ']\n';
				});

			if (_statusInfo.baseAddr !== null) {
				StatusInfo.prototype.printHistoryConsole(_statusInfo.baseAddr, _dstTag);

				if (_statusInfo.partnerAddr !== null) {
					_dstTag.innerHTML += '+++++ Power Up With x' + _statusInfo.partnerAddr.cost + ' +++++\n';
					PrintFunc(_statusInfo.partnerAddr, _dstTag);
				}
				else {
					_dstTag.innerHTML += '\n********** Trans Up **********';
				}
				_dstTag.innerHTML += '\n';
			}
			_dstTag.innerHTML += '----- Current Base x' + _statusInfo.cost + ' -----\n';
			PrintFunc(_statusInfo, _dstTag);
		}

		StatusInfo.prototype.getStarString = function(_statusInfo) {
			let starStr = '';
			for (let i = 0; _statusInfo.combi[i] === StarString.STAR_CHAR; i++)
				starStr += StarString.STAR_CHAR;
			return starStr;
		}

		StatusInfo.prototype.makeTitleTag = function(_statusInfo, _isBase, _str) {
			let title = document.createElement('span');
			let star = document.createElement('font');
			star.setAttribute('color', (_statusInfo.star === _statusInfo.cost - 1) ? '#736d71' : '#ffedab');
			star.appendChild(document.createTextNode(StatusInfo.prototype.getStarString(_statusInfo) + _statusInfo.star + ' [x' + _statusInfo.cost + ']'));
			title.setAttribute('class', 'title');
			title.setAttribute('style', (_isBase ? 'background: lightskyblue' : 'background: lightsalmon'));
			title.innerHTML = (_isBase ? 'Base' : 'Partner') + '<br/>';
			title.appendChild(star);
			return title;
		}

		Number.prototype.format = function(char, cnt){
			return (Array(cnt).fill(char).join("") + this.valueOf()).substr(-1*cnt); 
		}

		StatusInfo.prototype.makeStatusTag = function(_statusInfo) {
			const COLUMN_NUMBER = 3;
			let table = document.createElement('table');
			let tr = document.createElement('tr');
			let td = new Array(COLUMN_NUMBER);
			let ul = new Array(COLUMN_NUMBER);
			let li = new Array(COLUMN_NUMBER);

			for (let j = 0; j < COLUMN_NUMBER; j++) {
				td[j] = document.createElement('td');
				ul[j] = document.createElement('ul');
			}
			ul[0].setAttribute('class', 'status-list');
			ul[1].setAttribute('class', 'status-value');
			ul[2].setAttribute('class', 'status-value');
			for (let i = 0; i < Status.STATUS_NUMBER; i++) {
				for (let j = 0; j < COLUMN_NUMBER; j++)
					li[j] = document.createElement('li');
				li[0].innerHTML = STATUS_FIELD_NAME[i];
				li[1].innerHTML = _statusInfo.stat.vector[i];
				li[2].innerHTML = '[' + _statusInfo.bonus.vector[i].format(' ', 2) + ']';
				for (let j = 0; j < COLUMN_NUMBER; j++)
					ul[j].appendChild(li[j]);
			}
			for (let j = 0; j < COLUMN_NUMBER; j++) {
				td[j].appendChild(ul[j]);
				tr.appendChild(td[j]);
			}
			table.appendChild(tr);
			return table;
		}

		StatusInfo.prototype.makeNodeTag = function(_statusInfo, _isBase) {
			let baseBox = document.createElement('div');
			baseBox.appendChild(StatusInfo.prototype.makeTitleTag(_statusInfo, _isBase));
			baseBox.appendChild(StatusInfo.prototype.makeStatusTag(_statusInfo));
			return baseBox;
		}

		StatusInfo.prototype.getInnerHtmlJson = function(_tag) {
			return '"innerHTML":' + '"' + _tag.innerHTML.replace(/\"/g, "\'") + '"';
		}

		StatusInfo.prototype.getJson = function(_statusInfo, _isBase, _level) {
			let base = StatusInfo.prototype.makeNodeTag(_statusInfo, _isBase);
			let json = '';
			json += '{' + StatusInfo.prototype.getInnerHtmlJson(base);
			json += ',"collapsed":' + ((_statusInfo.star !== _statusInfo.cost - 1) ? 'true' : 'false');
			json += ',"children":[';
			if (_statusInfo.baseAddr !== null && (_statusInfo.star !== _statusInfo.cost - 1)) {
				json += StatusInfo.prototype.getJson(_statusInfo.baseAddr, true, _level + 1);
				if (_statusInfo.partnerAddr !== null)
					json += ',' + StatusInfo.prototype.getJson(_statusInfo.partnerAddr, false, _level + 1);
			}
			json += ']}';
			return json;
		}
		StatusInfo.prototype.printHistory = function(_statusInfo, _dstTag) {
			let base = StatusInfo.prototype.makeBaseTag(_statusInfo);

			if (_statusInfo.baseAddr !== null) {
				StatusInfo.prototype.printHistory(_statusInfo.baseAddr, _dstTag);

				if (_statusInfo.partnerAddr !== null) {
					let plus = StatusInfo.prototype.makePlusTag();
					let arrow = StatusInfo.prototype.makeArrowTag();
					let partner = StatusInfo.prototype.makePartnerTag(_statusInfo.partnerAddr);
					let line = StatusInfo.prototype.makeLineTag();

					if (_statusInfo.partnerAddr.star != _statusInfo.partnerAddr.cost - 1)
						StatusInfo.prototype.printHistory(_statusInfo.partnerAddr,
										  partner.firstChild.firstChild.lastChild);

					_dstTag.appendChild(plus);
					_dstTag.appendChild(partner);
					_dstTag.appendChild(arrow);
					_dstTag.appendChild(line);
				}
				else {
					let redirect = StatusInfo.prototype.makeRedirectTag();
					let line = StatusInfo.prototype.makeLineTag();
					_dstTag.appendChild(redirect);
					_dstTag.appendChild(line);
				}
			}
			_dstTag.appendChild(base);
		}

		return StatusInfo;
	})();
