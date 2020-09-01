import {
  ById,
  IdProperty,
  Options,
  ParentIdProperty,
  Predicate,
  Tree,
  TreeNode,
  TreeNodeDescription,
  TreeNodePath
} from "./types";

const ROOT_PARENT_ID: string = "root";

class TreeJs implements Tree {
  private _tree: TreeNode[];
  private _arrayOfNodeByParentId: ById<TreeNode[]>;
  private _nodeById: ById<TreeNode>;
  private _options: Options;

  private get arrayOfNodeByParentId(): ById<TreeNode[]> {
    return this._arrayOfNodeByParentId;
  }

  private set arrayOfNodeByParentId(value: ById<TreeNode[]>) {
    this._arrayOfNodeByParentId = value;
  }

  private get tree(): TreeNode[] {
    return this._tree.slice();
  }

  private set tree(value: TreeNode[]) {
    this._tree = value;
  }

  private get options(): Options {
    return this._options;
  }

  private set options(value: Options) {
    this._options = value;
  }

  private get nodeById(): ById<TreeNode> {
    return this._nodeById;
  }

  private set nodeById(value: ById<TreeNode>) {
    this._nodeById = value;
  }

  constructor(arrayOfNodes: TreeNodeDescription[], options?: Options) {
    const cloned: TreeNodeDescription[] = this.clone(arrayOfNodes);

    this.options = { propertyId: "id", propertyParentId: "parentId", ...options };
    this.arrayOfNodeByParentId = this.createArrayOfNodeByParentId(cloned);
    this.nodeById = this.createNodeById(cloned);
    this.tree = this.createTree();
  }

  private clone(object: any): any {
    if (Array.isArray(object)) {
      return object.map((o: any): any => this.clone(o));
    } else if (String(object) === "[object Object]") {
      return Object.keys(object).reduce(
        (acc: any, key: string): any => ({
          ...acc,
          [key]: this.clone(object[key])
        }),
        {}
      );
    } else {
      return object;
    }
  }

  private createArrayOfNodeByParentId(arrayOfNode: TreeNodeDescription[]): ById<TreeNode[]> {
    return arrayOfNode.reduce(
      (acc: ById<TreeNode[]>, node: TreeNodeDescription): ById<TreeNode[]> => {
        const parentId: string | number = node[this.options.propertyParentId] || ROOT_PARENT_ID;

        return {
          ...acc,
          [parentId]: acc[parentId] ? acc[parentId].concat(node) : [node]
        };
      },
      {
        [ROOT_PARENT_ID]: []
      }
    );
  }

  private createNodeById(arrayOfNode: TreeNodeDescription[]): ById<TreeNode> {
    return arrayOfNode.reduce((acc: ById<TreeNode>, node: TreeNodeDescription): ById<TreeNode> => {
      return {
        ...acc,
        [node.id]: node
      };
    }, {});
  }

  private createTree(arrayOfNode?: TreeNode[]): TreeNode[] {
    const nodes: TreeNode[] = arrayOfNode || this.arrayOfNodeByParentId[ROOT_PARENT_ID];
    let treeNodes: TreeNode[] = [];

    nodes.forEach((node: TreeNode): void => {
      const id: IdProperty = node[this.options.propertyId];

      treeNodes = treeNodes.concat(node);

      if (!this.arrayOfNodeByParentId[id]) {
        return;
      }

      node.children = (node.children || []).concat(this.createTree(this.arrayOfNodeByParentId[id]));
    });

    return treeNodes;
  }

  private breadthFirstSearch(predicate: Predicate): TreeNode | null {
    let queue: TreeNode[] = this.tree;

    while (queue.length) {
      const node: TreeNode = queue[0];

      if (predicate(node)) {
        return node;
      }

      queue = queue.slice(1).concat(node.children || []);
    }

    return null;
  }

  getTree(): TreeNode[] {
    return this.clone(this.tree);
  }

  find(predicate: Predicate): TreeNode | null {
    return this.clone(this.breadthFirstSearch(predicate));
  }

  findPath(predicate: Predicate): TreeNodePath[] | null {
    let node: TreeNode | null = this.find(predicate);

    if (!node) {
      return null;
    }

    let parentId: ParentIdProperty = node[this.options.propertyParentId];
    let result: TreeNode[] = [node];

    while (parentId) {
      node = this.nodeById[parentId];
      parentId = node[this.options.propertyParentId];
      result = result.concat(node);
    }

    return this.clone(
      result.reverse().map(
        ({ children, ...other }: TreeNode): TreeNodePath => ({
          ...other
        })
      )
    );
  }
}

export default TreeJs;
