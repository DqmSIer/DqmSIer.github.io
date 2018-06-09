const Interface = (function() {
		let baseStatusList = new Array();
		const INPUT_ID_PREFIX = "Monster";
		const INPUT_ID_TEXT = ["HP","MP","ATK","DEF","SPD","INT"];
		const INPUT_FORM_TEXT = ["HP","MP","攻撃","防御","素早さ","賢さ"];
		const STATUS_NUMBER = INPUT_FORM_TEXT.length;
		
		const Interface = function() { }
		
		Interface.prototype.getTransCount = function() {
			let transCnt = document.getElementById("TransCountSelector").value;
			let inputTable = document.getElementById("StatusInputForm");
			let nextBaseStatusList = new Array(transCnt);
			
			inputTable.innerHTML = "";
			for (let i = 0; i < transCnt; i++) {
				let column = document.createElement("td");
				let list = document.createElement("ul");
				let item = document.createElement("li");
				let str = document.createTextNode((i + 1) + "段目");
				
				str.style = "text-align: center";
				item.style = "list-style: none";
				item.appendChild(str);
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
				
				nextBaseStatusList[i] = new Status(Status.STATUS_NUMBER);
			}

			console.log(nextBaseStatusList);
			baseStatusList = nextBaseStatusList;
		}

		Interface.prototype.clearStatus = function() {
			console.log("Clear Status...");
			// document.getElementById("TransCountSelector").value = undefined;
			for (let i = 0; i < baseStatusList.length; i++) {
				for (let j = 0; j < STATUS_NUMBER; j++) {
					let input = document.getElementById(INPUT_ID_PREFIX + "-" + i + "-" + INPUT_ID_TEXT[j] + "-" + j);
					input.value = "";
				}
			}
		}
		
		Interface.prototype.readStatus = function() {
			let resultField = document.getElementById("ResultOutputField");
			let isText = document.getElementById("TextOutputCheck");

			console.log("Scanning Status...");
			for (let i = 0; i < baseStatusList.length; i++) {
				let stat = baseStatusList[i];
				for (let j = 0; j < STATUS_NUMBER; j++) {
					let input = document.getElementById(INPUT_ID_PREFIX + "-" + i + "-" + INPUT_ID_TEXT[j] + "-" + j);
					let value = $(input).val();
					
					if (value == "") {
						alert("未入力のステータスがあります");
						return ;
					}
					stat.vector[j] = Number(value);
				}
				console.log(stat);
			}

			Interface.prototype.backupStatus();
			resultField.innerHTML = "";
			console.log("Start Search...");
			if (isText.checked) {
				let pre = document.createElement("pre");
				pre.setAttribute("style", "background: rgba(255,255,255,0.5)");
				StatusInfo.prototype.printHistoryConsole(MaxStatusSearcher.prototype.search(baseStatusList), pre);
				resultField.appendChild(pre);
			}
			else {
				StatusInfo.prototype.printHistory(MaxStatusSearcher.prototype.search(baseStatusList), resultField);
			}
		}
		
		Interface.prototype.backupStatus = function() {
			let text = document.getElementById("StatusInputText");
			let transCnt = document.getElementById("TransCountSelector").value;
			
			console.log("Backup Status...");
			
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
				
				if (number == 0) {
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

