export type IdProperty = string | number;

export type ParentIdProperty = IdProperty | null | undefined;

interface Properties {
  id: IdProperty;

  parentId: ParentIdProperty;
}

export type TreeNodeDescription<T = Properties> = T & {
  [customProperty: string]: any;
};

export type Predicate = (node: TreeNode) => boolean;

export interface TreeNode extends TreeNodeDescription {
  children?: TreeNodeDescription[];
}

export type TreeNodePath = Omit<TreeNode, "children">;

export interface ById<T> {
  [id: string]: T;
}

export interface Options {
  propertyId: string;

  propertyParentId: string;
}

export interface Tree {
  getTree(): TreeNode[];

  find(predicate: Predicate): TreeNode | null;

  findPath(predicate: Predicate): TreeNodePath[] | null;
}
