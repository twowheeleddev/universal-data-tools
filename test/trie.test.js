// File: /test/trie.test.js

const {
  createTrie,
  insertWord,
  searchPrefix,
  collectWords,
} = require("../lib/universalTrie");

let trie = createTrie();
trie = insertWord(trie, "apple");
trie = insertWord(trie, "app");

const node = searchPrefix(trie, "app");
const words = collectWords(node);

console.assert(Array.isArray(words), "Words should be an array");
console.assert(
  words.includes("app") && words.includes("apple"),
  "Should find app and apple"
);

console.log("Trie tests passed");
