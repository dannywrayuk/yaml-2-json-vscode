export interface YamlNode {
  key?: YamlNode;
  value?: YamlNode;
  source?: YamlNode;
  anchor?: YamlNode;
  items?: Array<YamlNode>;
}

export interface TreeParentCollection {
  tree: Array<YamlNode> | YamlNode;
  parent?: TreeParentCollection;
}
