const Interface = (function() {
		const INPUT_ID_PREFIX = "Monster";
		const INPUT_ID_TEXT = ["HP","MP","ATK","DEF","SPD","INT"];
		const INPUT_FORM_TEXT = ["HP","MP","攻撃","防御","素早さ","賢さ"];
		const STATUS_NUMBER = INPUT_FORM_TEXT.length;

		const Interface = function() { }

		Interface.prototype.getTransCount = function() {
			let transCnt = document.getElementById("TransCountSelector").value;
			let inputTable = document.getElementById("StatusInputForm");

			inputTable.innerHTML = "";
			for (let i = 0; i < transCnt; i++) {
				let column = document.createElement("td");
				let list = document.createElement("ul");
				let item = document.createElement("li");

				item.setAttribute("style", "text-align: center; list-style: none");
				item.appendChild(document.createTextNode((i + 1) + "段目"));
				list.appendChild(item);
				for (let j = 0; j < STATUS_NUMBER; j++) {
					let item = document.createElement("li");
					let input = document.createElement("input");

					input.id = INPUT_ID_PREFIX + "-" + i + "-" + INPUT_ID_TEXT[j] + "-" + j;
					input.placeholder = INPUT_FORM_TEXT[j];
					input.type = "number";
					input.min = "1";
					input.required = "true";
					input.style = "width: 50px";
					item.style = "list-style: none";
					item.appendChild(input);
					list.appendChild(item);
				}

				column.appendChild(list);
				inputTable.appendChild(column);
			}
		}

		Interface.prototype.getStatusList = function() {
			let transCnt = document.getElementById("TransCountSelector").value;
			let baseStatusList = new Array(transCnt);

			for (let i = 0; i < transCnt; i++) {
				let stat = new Status(Status.STATUS_NUMBER);
				for (let j = 0; j < STATUS_NUMBER; j++) {
					let input = document.getElementById(INPUT_ID_PREFIX + "-" + i + "-" + INPUT_ID_TEXT[j] + "-" + j);
					let value = $(input).val();
					if (value === "" || value === undefined)
						return null;
					stat.vector[j] = Number(value);
				}
				baseStatusList[i] = stat;
			}
			return (transCnt > 0) ? baseStatusList : null;
		}

		Interface.prototype.changeMaximizeAll = function(_flag) {
			console.log("Change All Maximize to " + _flag + " ...");
			for (let i = 0; i < Status.STATUS_NUMBER; i++) {
				let isMaximize = document.getElementById("Status-" + i + "-Max-Check");
				isMaximize.checked = _flag;
			}
		}

		Interface.prototype.getMaximizeIndex = function() {
			let partialMaxIndex = new Array();
			for (let i = 0; i < Status.STATUS_NUMBER; i++) {
				let isMaximize = document.getElementById("Status-" + i + "-Max-Check");
				if (isMaximize.checked)
					partialMaxIndex.push(i);
			}
			return (partialMaxIndex.length > 0) ? partialMaxIndex : null;
		}

		Interface.prototype.startSearch = function() {
			let resultField = document.getElementById("ResultOutputField");
			let isText = document.getElementById("TextOutputCheck");
			let isDiff = document.getElementById("FourStarDiffCheck");
			let baseStatusList = null;
			let partialMaxIndex = null;
			let maxStatusInfo = null;

			console.log("Scanning Status...");
			baseStatusList = Interface.prototype.getStatusList();
			if (baseStatusList === null) {
				alert("未入力のステータスがあります");
				return ;
			}
			console.log(baseStatusList);

			console.log("Backup Status...");
			Interface.prototype.backupStatus();

			console.log("Scanning Maximize Setting...");
			partialMaxIndex = Interface.prototype.getMaximizeIndex();
			if (partialMaxIndex === null) {
				alert("少なくとも1つ以上のステータスに最大化設定をしてください");
				return ;
			}
			console.log(partialMaxIndex);

			console.log("Start Search...");
			// jQuery('#LoadingAnimation').show();
			resultField.innerHTML = "";
			maxStatusInfo = MaxStatusSearcher.prototype.search(baseStatusList, partialMaxIndex);
			
			if (isDiff.checked) {
				let fourStarStatus = FourStarCalculator.prototype.search(baseStatusList);
				maxStatusInfo.bonus = maxStatusInfo.stat.sub(fourStarStatus);
			}
			else
				maxStatusInfo.bonus.clear();

			console.log("Finish Search!");
			// jQuery('#LoadingAnimation').hide();
			if (isText.checked) {
				let str = StatusTreeConverter.prototype.getConsoleOutput(maxStatusInfo);
				let pre = document.createElement("pre");
				pre.setAttribute("style", "background: rgba(255,255,255,0.5)");
				pre.innerHTML = str;
				resultField.appendChild(pre);
			}
			else {
				let json = StatusTreeConverter.prototype.getJsonOutput(maxStatusInfo, 'ResultOutputField');
				tree = new Treant(json);
			}
		}

		Interface.prototype.backupStatus = function() {
			let text = document.getElementById("StatusInputText");
			let transCnt = document.getElementById("TransCountSelector").value;

			text.value = transCnt + "\n";
			for (let i = 0; i < transCnt; i++) {
				text.value += "---\n";
				for (let j = 0; j < STATUS_NUMBER; j++) {
					let input = document.getElementById(INPUT_ID_PREFIX + "-" + i + "-" + INPUT_ID_TEXT[j] + "-" + j);
					text.value += input.value + "\n";
				}
			}
			text.value += "---\n";
		}

		Interface.prototype.restoreStatus = function() {
			let text = document.getElementById("StatusInputText");
			let lines = text.value.split('\n');
			let transCnt = 0;
			let number = 0;

			console.log("Restore Status...");
			for (let i = 0; i < lines.length; i++) {
				let str = Interface.prototype.cutEdgeWhiteSpace(lines[i]);

				if (Interface.prototype.isComment(str))
					continue;

				if (number === 0) {
					transCnt = Number(str);
					document.getElementById("TransCountSelector").value = transCnt;
					Interface.prototype.getTransCount();
				}
				else {
					let monsterIdx = parseInt((number - 1) / Status.STATUS_NUMBER);
					let statusIdx = (number - 1) % Status.STATUS_NUMBER;
					let input;

					if (monsterIdx >= transCnt)
						break;
					input = document.getElementById(INPUT_ID_PREFIX + "-" + monsterIdx + "-" + INPUT_ID_TEXT[statusIdx] + "-" + statusIdx);
					input.value = Number(str);
				}
				number++;
			}
		}

		Interface.prototype.cutEdgeWhiteSpace = function(line) {
			let multiSpace = new RegExp("\\s\\s+", "g");
			let edgeSpace = new RegExp("^\\s*|\\s*$", "g");
			return line.replace(multiSpace, ' ').replace(edgeSpace, '');
		}
		Interface.prototype.isComment = function(str) {
			return str.match(new RegExp ("^-[^\n]*", "g"));
		}

		return Interface;
	})();
