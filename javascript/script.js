const searchInput = document.querySelector("#search-input"),
      loading = document.querySelector(".loading-container"),
      introduceArea = document.querySelector(".introduce"),
      searchResultArea = document.querySelector(".search-result-area"),
      removeSearchInput = document.querySelector(".remove-search-button"),
      volumeButton = document.querySelector(".fa-volume-up"),
      learnMore = document.querySelector(".learn-more"),
      messageBox = document.querySelector(".message-box");

window.addEventListener("offline", () => {
  showMessageBox("fas fa-wifi", "No network currently available, please check your network link");
});
window.addEventListener("online", () => {
  if (searchInput.value.trim() != "") {
    getSearchData(searchInput.value);
  } else {
    messageBox.classList.add("unactive");
  }
});
if (!navigator.onLine) {
  showMessageBox("fas fa-wifi", "No network currently available, please check your network link");
}

function isEmpty(value) {
  if (value === undefined || value === null || value === false || value.length <= 0 || value === 0 || value === "") {
    return true;
  } else {
    return false;
  }
}

function refreshDictionary() {
  searchResultArea.classList.remove("active");
  messageBox.classList.add("unactive");
  volumeButton.classList.remove("unactive");
  document.querySelector(".synonyms").innerHTML = "";
  document.querySelector(".antonyms").innerHTML = "";
}

function refreshSearchInput() {
  searchInput.value = "";
  removeSearchInput.classList.remove("active");
}

function showMessageBox(icon, content) {
  messageBox.classList.remove("unactive");
  messageBox.innerHTML = `<i class="${icon}"></i>
  <p class="content">${content}</p>`;
}

let audio = null;

function filterSearchResult(word, result) {
  console.log(result);
  loading.classList.remove("active");
  searchResultArea.classList.add("active");
  if (result.title) {
    swal({
      icon: "info",
      title: "Oops !",
      text: `Could not find the word "${word}"`
    });
    refreshSearchInput();
    refreshDictionary();
    introduceArea.classList.remove("unactive");
  } else {
    let searchWord = !isEmpty(result[0].word) ? result[0].word : "Error...";
    let meaning = !isEmpty(result[0].meanings[0].definitions[0].definition) ? result[0].meanings[0].definitions[0].definition : "No meanings...";
    let phontetics_1 = !isEmpty(result[0].meanings[0].partOfSpeech) ? result[0].meanings[0].partOfSpeech : "No phontics...";
    let phontetics_2 = !isEmpty(result[0].phonetics[1].text) ? result[0].phonetics[1].text : "No phontics...";
    let audioURL = result[0].phonetics[1].audio;
    let synonym = result[0].meanings[0].synonyms;
    let antonym = result[0].meanings[0].antonyms;

    document.querySelector(".search-word").textContent = searchWord;
    document.querySelector(".meaning").textContent = meaning;
    document.querySelector(".phontetics").textContent = `${phontetics_1}, ${phontetics_2}`;

    if (!isEmpty(audioURL)) {
      audio = new Audio(audioURL);
    } else {
      audio = null;
      messageBox.classList.remove("unactive");
      showMessageBox("fas fa-volume-mute", "This vocabulary does not support speech");
      volumeButton.classList.add("unactive");
    }

    if (!isEmpty(synonym)) {
      for (let i = 0; i < synonym.length; i++) {
        const tag = `<span class="px-2 py-1 rounded-3 tags mb-2 me-2" style="font-weight: 500; cursor: pointer; background: #ddd; transition: all .3s ease;" onclick="tagsReSearch('${synonym[i]}')">${synonym[i]}</span>`;
        document.querySelector(".synonyms").insertAdjacentHTML("beforeend", tag);
      }
    } else {
      document.querySelector(".synonyms").innerHTML = `<span class="mb-2">No synonym...</span>`;
    }
    if (!isEmpty(antonym)) {
      for (let j = 0; j < antonym.length; j++) {
        const tag = `<span class="px-2 py-1 rounded-3 tags mb-2 me-2" style="font-weight: 500; cursor: pointer; background: #ddd; transition: all .3s ease;" onclick="tagsReSearch('${antonym[j]}')">${antonym[j]}</span>`;
        document.querySelector(".antonyms").insertAdjacentHTML("beforeend", tag);
      }
    } else {
      document.querySelector(".antonyms").innerHTML = `<span class="mb-2">No antonym...</span>`;
    }

    learnMore.addEventListener("click", () => {
      window.location.href = `https://dictionary.cambridge.org/dictionary/english/${word}`;
    });
  }
}

function tagsReSearch(word) {
  getSearchData(word);
  searchInput.value = word;
}

async function getSearchData(word) {
  loading.classList.add("active");
  introduceArea.classList.add("inactive");
  refreshDictionary();
  try {
    let searchData = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
    searchData = await searchData.json();
    filterSearchResult(word, searchData);
  } catch {
    swal({
      icon: "error",
      title: "Notice",
      text: "An unknown error occurred, please try again later"
    });
    refreshSearchInput();
    refreshDictionary();
    introduceArea.classList.remove("unactive");
  }
}

searchInput.addEventListener("keydown", (e) => {
  if (e.keyCode === 13) {
    if (e.target.value.trim() != "") {
      getSearchData(e.target.value);
    } else {
      swal({
        icon: "info",
        title: "Notice",
        text: "Please enter a vocabulary"
      });
    }
  }
});
searchInput.addEventListener("input", (e) => {
  if (e.target.value.trim() != "") {
    removeSearchInput.classList.add("active");
  } else {
    removeSearchInput.classList.remove("active");
  }
});
removeSearchInput.addEventListener("click", () => {
  refreshSearchInput();
  searchInput.focus();
  refreshDictionary();
  introduceArea.classList.remove("unactive");
});
volumeButton.addEventListener("click", () => {
  if (audio !== null) {
    audio.play();
  }
});