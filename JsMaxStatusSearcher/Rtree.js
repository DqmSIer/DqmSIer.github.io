const Rtree = (function() {
		const MAX_ENTRY_NUMBER = 10;
		const MIN_ENTRY_NUMBER = 5;
		
		const Rtree = function(_dimension) {
			this.objectPool = new Array();
			this.nodePool = new Array();
			this.root = new RtreeNode(_dimension);
			this.dimension = _dimension;
			this.level = 0;	
		}
		
		// not tested
		Rtree.prototype.pickSeeds = function(_remainSet, _node, _divNode, _lowerFunc, _upperFunc) {
			let objMbr = new Array(new RtreeMbr(this.dimension), new RtreeMbr(this.dimension));
			let compMbr = new RtreeMbr(this.dimension);
			let minIdx = new Array(2);
			let maxDiff = Number.MIN_SAFE_INTEGER;
			
			/* find maximum distance pair */
			for (let i = 0; i < _remainSet.length - 1; i++) {
				objMbr[0].set(_lowerFunc(_remainSet[i]), _upperFunc(_remainSet[i]));
				compMbr = Object.assign(new RtreeMbr(), objMbr);
				for (let j = i + 1; j < _remainSet.length; j++) {
					objMbr[1].set(_lowerFunc(_remainSet[j]), _upperFunc(_remainSet[j]));
					compMbr.extend(_lowerFunc(_remainSet[j]), _upperFunc(_remainSet[j]));
					
					let diff = Math.abs(compMbr.getArea() - objMbr[0].getArea() - objMbr[1].getArea());
					if (maxDiff < diff) {
						maxDiff = diff;
						minIdx[0] = i;
						minIdx[1] = j;
					}
				}
			}
			
			/* form two nodes */
			_node.mbr.clear();
			_divNode.mbr.clear();
			_node.addChild(_remainSet[minIdx[0]], _lowerFunc, _upperFunc);
			_divNode.addChild(_remainSet[minIdx[1]], _lowerFunc, _upperFunc);
			/* remove from remaining set */
			_remainSet.splice(minIdx[1], 1);
			_remainSet.splice(minIdx[0], 1);
		}
		// not tested
		Rtree.prototype.pickNext = function(_remainSet, _node, _divNode, _lowerFunc, _upperFunc) {
			let minDiff = Number.MAX_SAFE_INTEGER;
			let minNode = null;
			let minIdx;
			
			for (let i = 0; i < _remainSet.length; i++) {
				let newMbr = new Array(Object.assign(new RtreeMbr(), _node.mbr),
						       Object.assign(new RtreeMbr(), _divNode.mbr));
				let diff = new Array(2);
				
				newMbr[0].extend(_lowerFunc(_remainSet[i]), _upperFunc(_remainSet[i]));
				newMbr[1].extend(_lowerFunc(_remainSet[i]), _upperFunc(_remainSet[i]));
				diff[0] = Math.abs(newMbr[0].getArea() - _node.mbr.getArea());
				diff[1] = Math.abs(newMbr[1].getArea() - _divNode.mbr.getArea());
				
				if (minDiff > Math.min(diff[0], diff[1])) {
					minDiff = Math.min(diff[0], diff[1]);
					minIdx = i;
					
					if (diff[0] < diff[1])
						minNode = _node;
					else {
						if (diff[1] < diff[0])
							minNode = _divNode;
						else { /* tie */
							if (_node.mbr.getArea() < _divNode.mbr.getArea())
								minNode = _node;
							else /* tie */
								minNode = (_node.child.length < _divNode.child.length) ? _node : _divNode;
						}
					}
				}
			}
			minNode.addChild(_remainSet[minIdx], _lowerFunc, _upperFunc);
			_remainSet.splice(minIdx, 1);
		}
		// not tested
		Rtree.prototype.split = function(_node, _object, _lowerFunc, _upperFunc) {
			let remainSet = new Array();
			let divNode = new RtreeNode(this.dimension);
			
			this.nodePool.push(divNode);
			for (let i = 0; i < _node.child.length; i++)
				remainSet.push(_node.child[i]);
			remainSet.push(_object);
	
			/* divide objects into 2 groups */
			_node.child = new Array();
			divNode.child = new Array();
			this.pickSeeds(remainSet, _node, divNode, _lowerFunc, _upperFunc);
			
			while (remainSet.length > 0) {
				if (_node.child.length === MAX_ENTRY_NUMBER - MIN_ENTRY_NUMBER + 1) {
					for (let i = 0; i < remainSet.length; i++)
						divNode.addChild(remainSet[i], _lowerFunc, _upperFunc);
				}
				if (divNode.child.length === MAX_ENTRY_NUMBER - MIN_ENTRY_NUMBER + 1) {
					for (let i = 0; i < remainSet.length; i++)
						_node.addChild(remainSet[i], lowerFunc, upperFunc);
				}
				this.pickNext(remainSet, _node, divNode, _lowerFunc, _upperFunc);
			}
			
			return divNode;
		}
		
		
		// not tested
		Rtree.prototype.chooseLeafInternal = function(_depth, _node, _object, _lowerFunc, _upperFunc) {
			if (_depth === this.level)
				return _node;
			else {
				let minArea = Number.MAX_SAFE_INTEGER;
				let minExtend = Number.MAX_SAFE_INTEGER;
				let minCostNode = null;
			
				for (let i = 0; i < _node.child.length; i++) {
					let extendMbr = Object.assign(new RtreeMbr(), _node.child[i].mbr);
					let oldArea, newArea, extend;
	
					oldArea = extendMbr.getArea();
					extendMbr.extend(_lowerFunc(_object), _upperFunc(_object));
					newArea = extendMbr.getArea();
			
					extend = newArea - oldArea;
					if (extend < minExtend) {
						minExtend = extend;
						minArea = newArea;
						minCostNode = _node.child[i];
					}
					else if (extend === minExtend) { /* tie */
						if (newArea < minArea) { 
							minArea = newArea;
							minCostNode = _node.child[i];
						}
					}
				}
			}
		
			return this.chooseLeafInternal(_depth + 1, minCostNode, _object, _lowerFunc, _upperFunc);
		}
		Rtree.prototype.chooseLeaf = function(_object, _lowerFunc, _upperFunc) {
			return this.chooseLeafInternal(0, this.root, _object, _lowerFunc, _upperFunc);
		}

		// not tested
		Rtree.prototype.adjust = function(_leaf, _divLeaf, _lowerFunc, _upperFunc) {
			const LowerGetter = function(_node) { return _node.mbr.lowerPoint; };
			const UpperGetter = function(_node) { return _node.mbr.upperPoint; };
			let node = _leaf;
			let divNode = _divLeaf;
	
			/* fix mbr of leaf to root */
			while (node !== this.root) {
				let parent = node.parent;
				let divParent = null;
			
				parent.updateMbr();
				if (divNode !== null) {
					let nodeAddr = this.nodePool[this.nodePool.length - 1];
				
					if (parent.child.length < MAX_ENTRY_NUMBER)
						parent.addChild(divNode, LowerGetter, UpperGetter);
					else
						divParent = this.split(parent, nodeAddr, LowerGetter, UpperGetter);
				
					node = parent;	
					divNode = divParent;
				}
			
				/* root is reached */
				if (divNode !== null) {
					this.root = new RtreeNode(this.dimension);
					this.root.addChild(node, LowerGetter, UpperGetter);
					this.root.addChild(divNode, LowerGetter, UpperGetter);
					this.nodePool.push(this.root);
					this.level++;
				}
			}
		}

		// not tested
		Rtree.prototype.insertInternal = function(_depth, _node, _object, _lowerFunc, _upperFunc) {
			let objAddr = Object.assign(new Object(), _object);
			let leaf = this.chooseLeaf(objAddr, _lowerFunc, _upperFunc);
			let divLeaf = null;

			this.objectPool.push(objAddr);
			if (leaf.child.length < MAX_ENTRY_NUMBER)
				leaf.addChild(objAddr, _lowerFunc, _upperFunc);
			else
				divLef = this.split(leaf, objAddr, _lowerFunc, _upperFunc);
			this.adjust(leaf, divLeaf, _lowerFunc, _upperFunc);
		}
		Rtree.prototype.insert = function(_object, _lowerFunc, _upperFunc) {
			this.insertInternal(0, this.root, _object, _lowerFunc, _upperFunc);
		}
	
		// not tested
		Rtree.prototype.updateInternal = function(_depth, _node, _object, _lowerFunc, _upperFunc, _screenFunc) {
			if (_depth == this.level) {
				for (let i = 0; i < _node.child.length; i++) {
					const result = _screenFunc(_node.child[i], _object);
					switch (result) {
						case 1: /* update */
							_node.child[i] = Object.assign(_node.child[i], _object);
						case - 1: /* skip */
							return result;
						default:
							break;
					}
				}
			}
			else {
				for (let i = 0; i < _node.child.length; i++) {
					if (_node.child[i].mbr.overlap(_lowerFunc(_object), _upperFunc(_object))) {
						result = this.updateInternal(_depth + 1, _node.child[i], _object, _lowerFunc, _upperFunc, _screenFunc);
						if (result !== 0)
							return result;
					}
				}
			}
			return 0;
		}
		Rtree.prototype.update = function(_object, _lowerFunc, _upperFunc, _screenFunc) {
			const result = this.updateInternal(0, this.root, _object, _lowerFunc, _upperFunc, _screenFunc);
			if (result === 0)
				this.insert(_object, _lowerFunc, _upperFunc);
			return result;	
		}

		// not tested
		Rtree.prototype.searchInternal = function(_depth, _node, _resultPool, _searchObject, _lowerFunc, _upperFunc, _screenFunc) {
			/* Leaf */
			if (_depth == this.level) {
				for (let i = 0; i < _node.child.length; i++) {
					if (_screenFunc(_node.child[i], _lowerFunc, _upperFunc))
						_resultPool.push(_node.child[i]);
				}
			}
			else {
				for (let i = 0; i < _node.child.length; i++) {
					if (_node.child[i].mbr.overlap(_lowerFunc(_searchObject), _upperFunc(_searchObject)))
						this.searchInternal(_depth + 1, _node.child[i], _resultPool, _searchObject, _lowerFunc, _upperFunc, _screenFunc);
				}
			}
		}
		Rtree.prototype.search = function(_resultPool, _searchObject, _lowerFunc, _upperFunc, _screenFunc) {
			this.searchInternal(0, this.root, _resultPool, _searchObject, _lowerFunc, _upperFunc, _screenFunc);
		}

		Rtree.prototype.referObjectPool = function() {
			return this.objectPool;
		}
		Rtree.prototype.referNodePool = function() {
			return this.nodePool;
		}

		
		return Rtree;
	})();

