const RtreeNode = (function() {
		const RtreeNode = function(_dimension) {
			this.mbr = new RtreeMbr(_dimension);
			this.child = new Array();
			this.parent = null;
		}

		RtreeNode.prototype.updateMbr = function() {
			this.mbr.clear();
			for (let i = 0; i < this.child.length; i++) {
				let cnode = this.child[i];
				this.mbr.extend(cnode.mbr.lowerPoint, cnode.mbr.upperPoint);
			}
		}
		RtreeNode.prototype.addChild = function(_child, _lowerFunc, _upperFunc) {
			this.mbr.extend(_lowerFunc(_child), _lowerFunc(_child));
			this.child.push(_child);
			if (_child instanceof RtreeNode)
				_child.parent = this;
		}
		
		return RtreeNode;
	})();

