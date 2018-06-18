const StatusTreeConverter = (function() {
		const STATUS_FIELD_NAME = ['HP:', 'MP:', '攻撃:', '防御:', '素早さ:', '賢さ:'];
		const StatusTreeConverter = function() { }

		Number.prototype.format = function(char, cnt){
			return (Array(cnt).fill(char).join("") + this.valueOf()).substr(-1*cnt); 
		}

		/***** for Console ****/
		StatusTreeConverter.prototype.getStringConsole = function(_statusInfo) {
			let str = '';
			str += '--- ' + _statusInfo.combi + ' ----\n';
			for (let i = 0; i < Status.STATUS_NUMBER; i++)
				str += _statusInfo.stat.vector[i].format(' ', 3) + ' [' + _statusInfo.bonus.vector[i].format(' ', 2) + ']\n';
			return str;
		}
		StatusTreeConverter.prototype.getConsoleOutput = function(_statusInfo) {
			let str = '';
			if (_statusInfo.baseAddr !== null) {
				str += StatusTreeConverter.prototype.getConsoleOutput(_statusInfo.baseAddr);
				if (_statusInfo.partnerAddr !== null) {
					str += '+++++ Power Up With x' + _statusInfo.partnerAddr.cost + ' +++++\n';
					str += StatusTreeConverter.prototype.getStringConsole(_statusInfo.partnerAddr);
				}
				else {
					str += '\n********** Trans Up **********\n';
				}
				str += '\n';
			}
			str += '----- Current Base x' + _statusInfo.cost + ' -----\n';
			str += StatusTreeConverter.prototype.getStringConsole(_statusInfo);
			return str;
		}

		/***** for HTML ****/
		StatusTreeConverter.prototype.getStarString = function(_statusInfo) {
			let starStr = '';
			for (let i = 0; _statusInfo.combi[i] === StarString.STAR_CHAR; i++)
				starStr += StarString.STAR_CHAR;
			return starStr;
		}
		StatusTreeConverter.prototype.makeTitleTag = function(_statusInfo, _isBase, _str) {
			let title = document.createElement('span');
			let star = document.createElement('font');
			star.setAttribute('color', (_statusInfo.star === _statusInfo.cost - 1) ? '#736d71' : '#ffedab');
			star.appendChild(document.createTextNode(StatusTreeConverter.prototype.getStarString(_statusInfo) + _statusInfo.star
								 + ' [x' + _statusInfo.cost + ']'));
			title.setAttribute('class', 'title');
			title.setAttribute('style', (_isBase ? 'background: lightskyblue' : 'background: lightsalmon'));
			title.innerHTML = (_isBase ? 'Base' : 'Partner') + '<br/>';
			title.appendChild(star);
			return title;
		}
		StatusTreeConverter.prototype.makeStatusTag = function(_statusInfo) {
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
		StatusTreeConverter.prototype.makeNodeTag = function(_statusInfo, _isBase) {
			let baseBox = document.createElement('div');
			baseBox.appendChild(StatusTreeConverter.prototype.makeTitleTag(_statusInfo, _isBase));
			baseBox.appendChild(StatusTreeConverter.prototype.makeStatusTag(_statusInfo));
			return baseBox;
		}

		/***** for JSON ****/
		StatusTreeConverter.prototype.getInnerHtmlJson = function(_tag) {
			return '"innerHTML":' + '"' + _tag.innerHTML.replace(/\"/g, "\'") + '"';
		}
		StatusTreeConverter.prototype.getNodeJson = function(_statusInfo, _isBase, _level) {
			let base = StatusTreeConverter.prototype.makeNodeTag(_statusInfo, _isBase);
			let json = '';
			json += '{' + StatusTreeConverter.prototype.getInnerHtmlJson(base);
			json += ',"collapsed":' + ((_statusInfo.star !== _statusInfo.cost - 1) ? true : false);
			json += ',"children":[';
			if (_statusInfo.baseAddr !== null && (_statusInfo.star !== _statusInfo.cost - 1)) {
				json += StatusTreeConverter.prototype.getNodeJson(_statusInfo.baseAddr, true, _level + 1);
				if (_statusInfo.partnerAddr !== null)
					json += ',' + StatusTreeConverter.prototype.getNodeJson(_statusInfo.partnerAddr, false, _level + 1);
			}
			json += ']}';
			return json;
		}
		StatusTreeConverter.prototype.getJsonOutput = function(_statusInfo, _dstId) {
			let jsonNodes = StatusTreeConverter.prototype.getNodeJson(_statusInfo, true, 0);
			let jsonString = '{"chart":'
			+ '{"container":"#' + _dstId + '"'
			+ ',"connectors":{"type": "straight"}'
			// + ',"rootOrientation":"NORTH"'
			// + ',"nodeAlign":"TOP"'
			+ ',"animateOnInit":true'
			+ ',"node":{"collapsable":true}'
			+ ',"animation":{"nodeAnimation":"easeOutQuart","nodeSpeed":500,"connectorsSpeed":500}'
			+ '},'
			+ '"nodeStructure":' + jsonNodes + '}';
			console.log(jsonString);
			return JSON.parse(jsonString);
		}

		return StatusTreeConverter;
	})();

