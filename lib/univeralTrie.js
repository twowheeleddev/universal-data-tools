// File: /lib/universalTrie.js

const { Map: IMap } = require("immutable");

/**
 * Creates an empty Trie node.
 *
 * @param {boolean} [isEnd=false] - Whether the node marks the end of a word
 * @param {IMap} [children=IMap()] - Children nodes
 * @returns {IMap} Trie node
 */
function createNode(isEnd = false, children = IMap()) {
  return IMap({ isEnd, children });
}

/**
 * Initializes an empty Trie.
 *
 * @returns {IMap} Root Trie node
 */
function createTrie() {
  return createNode();
}

/**
 * Inserts a word into the Trie.
 *
 * @param {IMap} node - Trie node
 * @param {string} word - Word to insert
 * @returns {IMap} New Trie node
 */
function insertWord(node, word) {
  if (!IMap.isMap(node) || typeof word !== "string") return node;

  return word
    .split("")
    .reduce((acc, char, idx) => {
      const children = acc.get("children");
      const child = children.get(char, createTrie());
      return acc.set("children", children.set(char, child));
    }, node)
    .set("isEnd", true);
}

/**
 * Searches for a prefix in the Trie.
 *
 * @param {IMap} node - Trie node
 * @param {string} prefix - Prefix to search
 * @returns {IMap|null} Node where prefix ends or null
 */
function searchPrefix(node, prefix) {
  if (!IMap.isMap(node) || typeof prefix !== "string") return null;

  return prefix.split("").reduce((acc, char) => {
    if (!acc || !IMap.isMap(acc)) return null;
    return acc.get("children").get(char) || null;
  }, node);
}

/**
 * Collects all words under a given Trie node.
 *
 * @param {IMap} node - Trie node
 * @param {string} [prefix=''] - Accumulated prefix
 * @returns {Array<string>} Array of found words
 */
function collectWords(node, prefix = "") {
  if (!IMap.isMap(node)) return [];

  const results = node.get("isEnd") ? [prefix] : [];

  for (const [char, child] of node.get("children").entries()) {
    results.push(...collectWords(child, prefix + char));
  }

  return results;
}

module.exports = {
  createTrie,
  insertWord,
  searchPrefix,
  collectWords,
};
