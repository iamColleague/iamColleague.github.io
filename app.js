let words = JSON.parse(localStorage.getItem("colleagueWords")) || [];

function addWord() {
  const input = document.getElementById("wordInput");
  const word = input.value.trim();

  if (!word) return;

  words.push({
    text: word,
    savedAt: new Date().toISOString()
  });

  localStorage.setItem("colleagueWords", JSON.stringify(words));
  input.value = "";
  renderWords();
}

function renderWords() {
  const list = document.getElementById("wordList");
  list.innerHTML = "";

  words.forEach((w, i) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <span>${w.text}</span>
      <button onclick="removeWord(${i})">×</button>
    `;
    list.appendChild(li);
  });
}

function removeWord(index) {
  words.splice(index, 1);
  localStorage.setItem("colleagueWords", JSON.stringify(words));
  renderWords();
}

renderWords();
