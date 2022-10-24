import YAML, { Pair, Scalar } from "yaml";
import { TreeParentCollection, YamlNode } from "./types";

export const ytoj = (yaml: string) => {
  if (!yaml) return "";
  const yamlObject = YAML.parseDocument(yaml);

  // @ts-ignore
  traverse({ tree: yamlObject.contents || [] });
  return JSON.stringify(yamlObject.toJSON(), null, 2);
};

const traverse = (node: TreeParentCollection) => {
  const tree = node.tree;
  const parentTree = node.parent?.tree;
  if (Array.isArray(tree)) {
    tree.forEach((x: any) => traverse({ tree: x, parent: node }));
    return;
  }
  if (tree.items) {
    traverse({ tree: tree.items, parent: node });
    return;
  }

  if (tree?.anchor && typeof tree.anchor === "string") {
    const index = Array.isArray(parentTree)
      ? parentTree.findIndex((x: any) => x === tree)
      : -1;
    const key = new Scalar("&" + tree.anchor);
    const grandParentTree = node.parent?.parent?.tree;
    const value = Array.isArray(grandParentTree)
      ? ""
      : new Scalar(grandParentTree?.key?.value + ":" + index);

    const pair = new Pair(key, value);
    const greatGrandParentTree = node.parent?.parent?.parent?.tree;
    Array.isArray(greatGrandParentTree) &&
      greatGrandParentTree?.push(pair as YamlNode);
  }

  if (tree.value?.anchor && typeof tree.value.anchor === "string") {
    const key = new Scalar("&" + tree.value.anchor);
    const value = new Scalar(tree.key?.value);
    const pair = new Pair(key, value);
    Array.isArray(parentTree) && parentTree.push(pair as YamlNode);
  }

  if (tree.value?.items) {
    traverse({ tree: tree.value.items, parent: node });
    return;
  }

  if (
    tree.value?.source !== tree.value?.value &&
    typeof tree.value?.value !== "boolean" &&
    typeof tree.value?.value !== "number" &&
    tree.value?.value !== null
  ) {
    console.log(tree.value?.value);

    if (tree.key?.value === "<<") {
      tree.key.value = ("<<" + tree.value?.source) as YamlNode;
    }

    const value = new Scalar("*" + tree.value?.source);
    tree.value = value as YamlNode;
  }
};
