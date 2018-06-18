const StatusInfo = (function() {
		const STATUS_FIELD_NAME = ["HP", "MP:", "攻撃:", "防御:", "素早さ:", "賢さ:"];
		
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
					// _dstTag.appendChild(document.createTextNode("--- " + _statusInfo.combi + " ----\n"));
					_dstTag.innerHTML += "--- " + _statusInfo.combi + " ----\n";
                                        for (let i = 0; i < Status.STATUS_NUMBER; i++)
						// _dstTag.appendChild(document.createTextNode(_statusInfo.stat.vector[i] + " [" + _statusInfo.bonus.vector[i] + "]\n"));
						_dstTag.innerHTML += _statusInfo.stat.vector[i] + " [" + _statusInfo.bonus.vector[i] + "]\n";
				});
			
			if (_statusInfo.baseAddr !== null) {
				StatusInfo.prototype.printHistoryConsole(_statusInfo.baseAddr, _dstTag);
				
				if (_statusInfo.partnerAddr !== null) {
					// _dstTag.appendChild(document.createTextNode("+++++ Power UpWith x" + _statusInfo.partnerAddr.cost + " +++++\n"));
					_dstTag.innerHTML += "+++++ Power Up With x" + _statusInfo.partnerAddr.cost + " +++++\n";
					PrintFunc(_statusInfo.partnerAddr, _dstTag);
				}
				else {
					// _dstTag.appendChild(document.createTextNode("\n********** Trans Up **********"));
					_dstTag.innerHTML += "\n********** Trans Up **********\n";
				}
				// _dstTag.appendChild(document.createTextNode("\n"));
				_dstTag.innerHTML += "\n";
			}
			// _dstTag.appendChild(document.createTextNode("----- Current Base x" + _statusInfo.cost + " -----\n"));
			_dstTag.innerHTML += "----- Current Base x" + _statusInfo.cost + " -----\n";
			PrintFunc(_statusInfo, _dstTag);
		}

		StatusInfo.prototype.getStarString = function(_statusInfo) {
			let starStr = "";
			for (let i = 0; _statusInfo.combi[i] == StarString.STAR_CHAR; i++)
				starStr += StarString.STAR_CHAR;
			return starStr;
		}
		
		StatusInfo.prototype.makeTitleTag = function(_statusInfo, _str) {
			let title = document.createElement("span");
			let star = document.createElement("font");
			
			star.setAttribute("color", (_statusInfo.star == _statusInfo.cost - 1) ? "#736d71" : "#ffedab");
			star.appendChild(document.createTextNode(StatusInfo.prototype.getStarString(_statusInfo) + _statusInfo.star + " [x" + _statusInfo.cost + "]"));
			title.setAttribute("class", "title");
			title.innerHTML = _str + "<br/>";
			title.appendChild(star);
			return title;
		}
		
		StatusInfo.prototype.makeTableTag = function() {
			let table = document.createElement("table");
			let tr = document.createElement("tr");
			let td1 = document.createElement("td");
			let td2 = document.createElement("td");
			tr.appendChild(td1);
			tr.appendChild(td2);
			table.appendChild(tr);
			return table;
		}
		
		StatusInfo.prototype.makeStatusTag = function(_statusInfo) {
			let table = StatusInfo.prototype.makeTableTag();
			let tr = table.firstChild;
			let ul1 = document.createElement("ul");
			let ul2 = document.createElement("ul");
			
			ul1.setAttribute("class", "status-list");
			ul2.setAttribute("class", "status-value");
			for (let i = 0; i < Status.STATUS_NUMBER; i++) {
				let li1 = document.createElement("li");
				let li2 = document.createElement("li");
				li1.innerHTML = STATUS_FIELD_NAME[i];
				li2.innerHTML = _statusInfo.stat.vector[i];
				ul1.appendChild(li1);
				ul2.appendChild(li2);
			}
			tr.firstChild.appendChild(ul1);
			tr.lastChild.appendChild(ul2);
			return table;
		}
		
		StatusInfo.prototype.makeBaseTag = function(_statusInfo) {
			let div = document.createElement("div");
			let table = StatusInfo.prototype.makeTableTag();
			let tr = table.firstChild;
			let baseBox = document.createElement("div");
						
			baseBox.setAttribute("class", "baseBox");
			baseBox.appendChild(StatusInfo.prototype.makeTitleTag(_statusInfo, "Base"));
			baseBox.appendChild(StatusInfo.prototype.makeStatusTag(_statusInfo));

			tr.firstChild.appendChild(baseBox);
			div.appendChild(table);
			return div;
		}
		
		StatusInfo.prototype.makePartnerTag = function(_statusInfo) {
			let div = document.createElement("div");
			let table = StatusInfo.prototype.makeTableTag();
			let tr = table.firstChild;
			let partnerBox = document.createElement("div");
			
			partnerBox.setAttribute("class", "partnerBox");
			partnerBox.appendChild(StatusInfo.prototype.makeTitleTag(_statusInfo, "Partner"));
			partnerBox.appendChild(StatusInfo.prototype.makeStatusTag(_statusInfo));

			tr.firstChild.appendChild(partnerBox);

			tr.setAttribute("style", "vertical-align: top");
			tr.firstChild.setAttribute("onclick", "StatusInfo.prototype.display(this)");
			tr.lastChild.setAttribute("style", "display: none;");

			div.appendChild(table);
			return div;
		}

		StatusInfo.prototype.display = function(_element) {
			_element.nextElementSibling.setAttribute("style", "display: inline;");
			_element.setAttribute("onclick", "StatusInfo.prototype.hide(this)");
		}
		StatusInfo.prototype.hide = function(_element) {
			_element.nextElementSibling.setAttribute("style", "display: none;");
			_element.setAttribute("onclick", "StatusInfo.prototype.display(this)");
		}
		

		StatusInfo.prototype.makePlusTag = function() {
			let plus = document.createElement("div");
			plus.setAttribute("class", "plus");
			plus.appendChild(document.createTextNode("＋"));
			return plus;
		}

		StatusInfo.prototype.makeArrowTag = function() {
			let arrow = document.createElement("div");
			arrow.setAttribute("class", "arrow");
			arrow.innerHTML = "&forall;";
			return arrow;
		}

		StatusInfo.prototype.makeLineTag = function() {
			let line = document.createElement("hr");
			line.setAttribute("class", "boundary");
			return line;
		}
		
		StatusInfo.prototype.makeRedirectTag = function() {
			let redirect = document.createElement("div");
			redirect.setAttribute("class", "redirect");
			redirect.innerHTML = "&sect;";
			return redirect;
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
