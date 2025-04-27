const {
  createTrie,
  insertWord,
  searchPrefix,
  collectWords,
} = require("./lib/universalTrie");

let trie = createTrie();
trie = insertWord(trie, "hello");
trie = insertWord(trie, "helium");

const node = searchPrefix(trie, "hel");
const words = collectWords(node); // ['hello', 'helium']
