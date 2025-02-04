// Written in 2015 by Shaunak Kishore (kshaunak@gmail.com).
//
// To the extent possible under law, the author(s) have dedicated all copyright
// and related and neighboring rights to this software to the public domain
// worldwide. This software is distributed without any warranty.
this.makemeahanzi = this.makemeahanzi || {};

const Decomposition = this.makemeahanzi.Decomposition = {};

Decomposition.ids_data = {
  '⿰': {label: 'Left-to-right', arity: 2},
  '⿱': {label: 'Top-to-bottom', arity: 2},
  '⿴': {label: 'Surround', arity: 2},
  '⿵': {label: 'Surround-from-above', arity: 2},
  '⿶': {label: 'Surround-from-below', arity: 2},
  '⿷': {label: 'Surround-from-left', arity: 2},
  '⿸': {label: 'Surround-from-upper-left', arity: 2},
  '⿹': {label: 'Surround-from-upper-right', arity: 2},
  '⿺': {label: 'Surround-from-lower-left', arity: 2},
  '⿻': {label: 'Overlaid', arity: 2},
  '⿳': {label: 'Top-to-middle-to-bottom', arity: 3},
  '⿲': {label: 'Left-to-middle-to-right', arity: 3},
}
Decomposition.ideograph_description_characters =
    Object.keys(Decomposition.ids_data);

const UNKNOWN_COMPONENT = '？';

const assert = (condition, message) => condition || console.error(message);

const augmentTreeWithPathData = (tree, path) => {
  tree.path = path;
  const children = (tree.children || []).length;
  for (let i = 0; i < children; i++) {
    augmentTreeWithPathData(tree.children[i], path.concat([i]));
  }
  return tree;
}

const parseSubtree = (decomposition, index) => {
  assert(index[0] < decomposition.length,
         `Not enough characters in ${decomposition}.`);
  const current = decomposition[index[0]];
  index[0] += 1;
  if (Decomposition.ids_data.hasOwnProperty(current)) {
    const result = {type: 'compound', value: current, children: []};
    for (let i = 0; i < Decomposition.ids_data[current].arity; i++) {
      result.children.push(parseSubtree(decomposition, index));
    }
    return result;
  } else if (current === UNKNOWN_COMPONENT) {
    return {type: 'character', value: '?'};
  }
  // Characters may be followed by a [x] annotation that records which variant
  // of the character to use at that position. We ignore these annotations.
  if (decomposition[index[0]] === '[') {
    assert('0123456789'.indexOf(decomposition[index[0] + 1]) >= 0);
    assert(decomposition[index[0] + 2] === ']');
    index[0] += 3;
  }
  return {type: 'character', value: current};
}

const serializeSubtree = (subtree, result) => {
  result[0] += subtree.value === '?' ? UNKNOWN_COMPONENT : subtree.value;
  const children = subtree.children ? subtree.children.length : 0;
  for (let i = 0; i < children; i++) {
    serializeSubtree(subtree.children[i], result);
  }
}

Decomposition.collectComponents = (tree, result) => {
  result = result || [];
  if (tree.type === 'character' && tree.value !== '?') {
    result.push(tree.value);
  }
  for (let child of tree.children || []) {
    Decomposition.collectComponents(child, result);
  }
  return result;
}

Decomposition.convertDecompositionToTree = (decomposition) => {
  const index = [0];
  decomposition = decomposition || UNKNOWN_COMPONENT;
  const result = parseSubtree(decomposition, index);
  assert(index[0] === decomposition.length,
         `Too many characters in ${decomposition}.`);
  return augmentTreeWithPathData(result, []);
}

Decomposition.convertTreeToDecomposition = (tree) => {
  const result = [''];
  serializeSubtree(tree, result);
  return result[0];
}

Decomposition.getSubtree = (tree, path) => {
  let subtree = tree;
  for (let index of path) {
    assert(0 <= index && index < subtree.children.length);
    subtree = subtree.children[index];
  }
  return subtree;
}
