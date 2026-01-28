// Basic word data (temporary)
const words = {
  responsible: {
    meaning: "Doing your duty properly",
    example: "She was responsible for the project."
  },
  confident: {
    meaning: "Feeling sure of yourself",
    example: "He spoke in a confident manner."
  }
};

// Search
function searchWord() {
  const w = document.getElementById("search").value.toLowerCase();
  localStorage.setItem("currentWord", w);
  window.location.href = "word.html";
}

// Load word page
if (document.getElementById("word")) {
  const w = localStorage.getItem("currentWord");
  document.getElementById("word").innerText = w;
  document.getElementById("meaning").innerText = words[w]?.meaning || "Meaning not found";
  document.getElementById("example").innerText = words[w]?.example || "";
}

// Save word
function saveWord() {
  let saved = JSON.parse(localStorage.getItem("savedWords")) || [];
  const w = localStorage.getItem("currentWord");
  if (!saved.includes(w)) saved.push(w);
  localStorage.setItem("savedWords", JSON.stringify(saved));
  alert("Word saved!");
}

// Load saved words
if (document.getElementById("wordList")) {
  const list = document.getElementById("wordList");
  let saved = JSON.parse(localStorage.getItem("savedWords")) || [];
  saved.forEach(w => {
    let li = document.createElement("li");
    li.innerText = w;
    list.appendChild(li);
  });
}

// Revision
let index = 0;
let savedWords = JSON.parse(localStorage.getItem("savedWords")) || [];

function showMeaning() {
  document.getElementById("revMeaning").style.display = "block";
}

function markRemembered() {
  index++;
  if (index >= savedWords.length) {
    alert("Done for today!");
    return;
  }
  loadRevision();
}

function loadRevision() {
  let w = savedWords[index];
  document.getElementById("revWord").innerText = w;
  document.getElementById("revMeaning").innerText = words[w]?.meaning || "";
  document.getElementById("revMeaning").style.display = "none";
}

if (document.getElementById("revWord")) {
  loadRevision();
}
