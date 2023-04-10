import * as vscode from "vscode";
import YAML, { Alias, Scalar, YAMLMap, YAMLSeq } from "yaml";
import { TreeParentCollection, YamlNode } from "./types";

export const jtoy = (json: string) => {
  if (!json) return "";
  const jsonObject = JSON.parse(json);
  const yamlObject = new YAML.Document(jsonObject);
  let yamlString;
  if (vscode.workspace.getConfiguration("yjc").anchorInterop) {
    // @ts-ignore
    traverse({ tree: yamlObject.contents || [] });
    yamlString = yamlObject.toString().replace(/:\n\s+\&/g, ": &");
  } else {
    yamlString = yamlObject.toString();
  }
  return yamlString;
};

const applyAnchor = (element: YamlNode, tree: YamlNode) => {
  if (element) {
    let anchorValue;
    if (element.value?.value) {
      anchorValue = new Scalar(element.value?.value);
      anchorValue.anchor = (tree.key?.value as string).substring(1);
      element.value = anchorValue as YamlNode;
    }
    if (element.value) {
      element.anchor = (tree.key?.value as string).substring(1) as YamlNode;
    }
    if (element.value?.items) {
      if (element.value.constructor.name === "YAMLSeq") {
        anchorValue = new YAMLSeq();
      } else {
        anchorValue = new YAMLMap();
      }
      anchorValue.items = element.value?.items as any;
      anchorValue.anchor = (tree.key?.value as string).substring(1);
      element.value = anchorValue as YamlNode;
    }
  }
};

const traverse = (node: TreeParentCollection) => {
  const tree = node.tree;
  if (Array.isArray(tree)) {
    tree.forEach((x: any) => traverse({ tree: x, parent: node }));
    tree.splice(
      0,
      tree.length,
      ...tree.filter((x) => !/^\&/.test(x.key?.value as string))
    );
    return;
  }
  if (tree.items) {
    traverse({ tree: tree.items, parent: node });
    return;
  }
  if (tree.value?.items) {
    traverse({ tree: tree.value.items, parent: node });
    return;
  }

  if (/^\&/.test(tree.key?.value as string)) {
    if (node.parent && Array.isArray(node.parent.tree)) {
      const [anchorKey, anchorKeyIndex] = (tree.value?.value as string).split(
        ":"
      );
      const keyIndex = (node.parent?.tree as Array<any>).findIndex(
        (x) => x?.key?.value === anchorKey
      );

      if (Number(anchorKeyIndex) >= 0) {
        applyAnchor(
          node.parent.tree[keyIndex]?.value?.items?.[
            Number(anchorKeyIndex)
          ] as YamlNode,
          tree
        );
      } else {
        applyAnchor(node.parent.tree[keyIndex], tree);
      }
    }
  }
  if (/^source\:\s\*.+/.test(tree.value?.value as string)) {
    tree.value = new Alias(
      (tree.value?.value as string).substring(9)
    ) as YamlNode;
    if (tree.key?.value && /^<</.test(tree.key?.value as string)) {
      tree.key.value = "<<" as YamlNode;
    }
  }
};
