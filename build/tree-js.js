"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ROOT_PARENT_ID = "root";
class TreeJs {
    constructor(arrayOfNodes, options) {
        const cloned = this.clone(arrayOfNodes);
        this.options = { propertyId: "id", propertyParentId: "parentId", ...options };
        this.arrayOfNodeByParentId = this.createArrayOfNodeByParentId(cloned);
        this.nodeById = this.createNodeById(cloned);
        this.tree = this.createTree();
    }
    get arrayOfNodeByParentId() {
        return this._arrayOfNodeByParentId;
    }
    set arrayOfNodeByParentId(value) {
        this._arrayOfNodeByParentId = value;
    }
    get tree() {
        return this._tree.slice();
    }
    set tree(value) {
        this._tree = value;
    }
    get options() {
        return this._options;
    }
    set options(value) {
        this._options = value;
    }
    get nodeById() {
        return this._nodeById;
    }
    set nodeById(value) {
        this._nodeById = value;
    }
    clone(object) {
        if (Array.isArray(object)) {
            return object.map((o) => this.clone(o));
        }
        else if (String(object) === "[object Object]") {
            return Object.keys(object).reduce((acc, key) => ({
                ...acc,
                [key]: this.clone(object[key])
            }), {});
        }
        else {
            return object;
        }
    }
    createArrayOfNodeByParentId(arrayOfNode) {
        return arrayOfNode.reduce((acc, node) => {
            const parentId = node[this.options.propertyParentId] || ROOT_PARENT_ID;
            return {
                ...acc,
                [parentId]: acc[parentId] ? acc[parentId].concat(node) : [node]
            };
        }, {
            [ROOT_PARENT_ID]: []
        });
    }
    createNodeById(arrayOfNode) {
        return arrayOfNode.reduce((acc, node) => {
            return {
                ...acc,
                [node.id]: node
            };
        }, {});
    }
    createTree(arrayOfNode) {
        const nodes = arrayOfNode || this.arrayOfNodeByParentId[ROOT_PARENT_ID];
        let treeNodes = [];
        nodes.forEach((node) => {
            const id = node[this.options.propertyId];
            treeNodes = treeNodes.concat(node);
            if (!this.arrayOfNodeByParentId[id]) {
                return;
            }
            node.children = (node.children || []).concat(this.createTree(this.arrayOfNodeByParentId[id]));
        });
        return treeNodes;
    }
    breadthFirstSearch(predicate) {
        let queue = this.tree;
        while (queue.length) {
            const node = queue[0];
            if (predicate(node)) {
                return node;
            }
            queue = queue.slice(1).concat(node.children || []);
        }
        return null;
    }
    getTree() {
        return this.clone(this.tree);
    }
    find(predicate) {
        return this.clone(this.breadthFirstSearch(predicate));
    }
    findPath(predicate) {
        let node = this.find(predicate);
        if (!node) {
            return null;
        }
        let parentId = node[this.options.propertyParentId];
        let result = [node];
        while (parentId) {
            node = this.nodeById[parentId];
            parentId = node[this.options.propertyParentId];
            result = result.concat(node);
        }
        return this.clone(result.reverse().map(({ children, ...other }) => ({
            ...other
        })));
    }
}
exports.default = TreeJs;
//# sourceMappingURL=tree-js.js.map