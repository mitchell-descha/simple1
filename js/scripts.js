let pokemonRepository = (function () {
  let pokemonList = [];
  let pokeApiUrl = "https://pokeapi.co/api/v2/pokemon/?limit=150";

  function addPokemon(pokemon) {
    if (
      typeof pokemon === "object" &&
      "name" in pokemon &&
      "detailsUrl" in pokemon
    ) {
      pokemonList.push(pokemon);
    }
  }

  function getAll() {
    return pokemonList;
  }

  function addListItem(pokemon) {
    let pokemonListElement = document.querySelector('.list-group');
    let pokemonListItem = document.createElement('li');
    let btn = document.createElement('button');
    pokemonListItem.classList.add("list-group-item", "text-center", "border-0");

    btn.setAttribute("data-toggle", "modal");
    btn.setAttribute("data-target", "#exampleModal");
    btn.classList.add("btn-secondary", "mt-1", "p-2", "border-0", "fs-5");

    btn.addEventListener("click", function () {
      showDetails(pokemon);
    });

    btn.innerText = pokemon.name;
    pokemonListItem.appendChild(btn);
    pokemonListElement.appendChild(pokemonListItem);
  }

  function loadList() {
    showLoadingMessage();
    return fetch(pokeApiUrl)
      .then(response => response.json())
      .then(json => {
        hideLoadingMessage();
        json.results.forEach(item => {
          let pokemon = {
            name: item.name,
            detailsUrl: item.url,
          };
          addPokemon(pokemon);
        });
      })
      .catch(error => {
        hideLoadingMessage();
        console.error(error);
      });
  }

  function loadDetails(pokemon) {
    let detailUrl = pokemon.detailsUrl;
    return fetch(detailUrl)
      .then(response => response.json())
      .then(details => {
        pokemon.imageUrl = details.sprites.front_default;
        pokemon.height = details.height;
        pokemon.weight = details.weight;
      })
      .catch(error => {
        console.error(error);
      });
  }

  function searchItem() {
    let searchInput = document.querySelector("#input").value.toLowerCase();
    let listArray = document.querySelectorAll(".list-group-item");

    listArray.forEach(pokemon => {
      let listBtn = pokemon.querySelector(".btn-secondary").innerText.toLowerCase();
      if (listBtn.includes(searchInput)) {
        pokemon.style.display = "inline-block";
      } else {
        pokemon.style.display = "none";
      }
    });
  }

  let searchInput = document.querySelector("#input");
  searchInput.addEventListener("input", searchItem);

  function showDetails(pokemon) {
    loadDetails(pokemon).then(() => {
      showModal(pokemon.name, pokemon.height, pokemon.imageUrl, pokemon.weight);
    }).catch(error => {
      console.error(error);
    });
  }

  function showLoadingMessage() {
    let loadingDiv = document.createElement("div");
    loadingDiv.classList.add("spinner-border", "text-light");
    let pokemonUL = document.querySelector("ul");
    pokemonUL.appendChild(loadingDiv);
  }

  function hideLoadingMessage() {
    let pokemonUL = document.querySelector("ul");
    pokemonUL.firstChild.remove();
  }

  function showModal(pokemonName, pokemonHeight, pokemonImage, pokemonWeight) {
    let title = document.querySelector(".modal-title");
    title.innerText = pokemonName.toUpperCase();
    let height = document.querySelector(".pokemonHeight");
    let imgDetails = document.querySelector(".PokomoneImg");
    let weight = document.querySelector(".pokemonWeight");
    weight.innerText = "Weight: " + pokemonWeight + "KG";
    height.innerText = "Height: " + pokemonHeight + "M";
    imgDetails.src = pokemonImage;

    let modalContainer = document.querySelector("#exampleModal");
    modalContainer.classList.add("isVisible");
  }

  function hideModal() {
    let modalContainer = document.querySelector("#exampleModal");
    modalContainer.classList.remove("isVisible");
  }

  window.addEventListener("keydown", e => {
    let modalContainer = document.querySelector("#exampleModal");
    if (e.key === "Escape" && modalContainer.classList.contains("isVisible")) {
      hideModal();
    }
  });

  let logoRefresh = document.querySelector(".logo");
  logoRefresh.addEventListener("click", () => {
    window.location.reload();
  });

  let modalContainer = document.querySelector("#exampleModal");
  modalContainer.addEventListener("click", e => {
    let target = e.target;
    if (target === modalContainer) {
      hideModal();
    }
  });

  return {
    addPokemon: addPokemon,
    addListItem: addListItem,
    getAll: getAll,
    loadList: loadList,
    loadDetails: loadDetails,
    showModal: showModal,
    hideModal: hideModal
  };
})();

pokemonRepository.loadList().then(() => {
  pokemonRepository.getAll().forEach(pokemon => {
    pokemonRepository.addListItem(pokemon);
  });
});