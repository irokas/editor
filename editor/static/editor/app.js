// IIFE keeps our variables private
// and gets executed immediately!
async function renderUrl(url, container) {
  const response = await fetch(url, {mode: 'no-cors'});
  const payload = await response.json();
  renderInput(payload, container);
};

function renderInput(input, container) {
  const dirItems = input.filter(inputEl => inputEl.type === "directory"),
    fileItems = input.filter(inputEl => inputEl.type === "file");
  dirItems.sort(alphabeticCompare);
  fileItems.sort(alphabeticCompare);
  const listItems = dirItems.concat(fileItems);
  ulElement = convertItemsToUnorderedList(listItems);
  ulElement.classList.add("fs-api-tree");
  container.addEventListener("click", function(e) {
    selectEntry(e.target.parentNode, container);
  });
  container.appendChild(ulElement);
  return listItems;
};
function selectEntry(clickedElement, rootContainer) {
  rootContainer
    .querySelectorAll(".fs-api-selected")
    .forEach(entry => entry.classList.remove("fs-api-selected"));
  clickedElement.classList.add("fs-api-selected");
}
function appendNewEntry(type, path, url) {
  const container = document.querySelector(`li[data-path="${url}"]`);
  const liElement = createNewListItem(type, path, url.concat(path));
  container.querySelector(".fs-api-tree").appendChild(liElement);
}
function createNewListItem(type, name, absolute_path) {
  const liElement = document.createElement("li");
  liElement.classList.add("fs-api-entry", `fs-api-${type}`);
  liElement.dataset.path = absolute_path;
  const nameElement = document.createElement("span");
  nameElement.textContent = name;
  nameElement.classList.add("fs-api-entry-name");
  if (type === "directory") {
    const handler = document.createElement("span");
    handler.classList.add("fs-api-directory-handler");
    handler.textContent = "›";
    handler.addEventListener("click", function() {
      toggleDirectory(nameElement);
    });
    liElement.appendChild(handler);
    nameElement.addEventListener("dblclick", function() {
      toggleDirectory(nameElement);
    });
  }
  liElement.appendChild(nameElement);
  return liElement;
}
function convertItemsToUnorderedList(listItems) {
  const ulElement = document.createElement("ul");
  listItems.forEach(item => {
    const liElement = createNewListItem(
      item.type,
      item.name,
      item.absolute_path
    );
    if (item.children) {
      renderInput(item.children, liElement);
    }
    ulElement.appendChild(liElement);
  });
  return ulElement;
}

function toggleDirectory(nameElement) {
  if (nameElement.parentNode.classList.contains("fs-api-directory-collapse")) {
    nameElement.parentNode.classList.remove("fs-api-directory-collapse");
  } else {
    nameElement.parentNode.classList.add("fs-api-directory-collapse");
  }
}
function alphabeticCompare(a, b) {
  const firstName = a.name.toUpperCase();
  const secondName = b.name.toUpperCase();
  return firstName > secondName ? 1 : secondName > firstName ? -1 : 0;
}

(function () {
  let doc = document.getElementById('editor-view');
  doc.contentEditable = true;

  let filesystem = document.getElementById('filesystem');
  url = "open"
  renderUrl(url, filesystem_view);
})()
