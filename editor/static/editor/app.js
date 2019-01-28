
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
    if (clickedElement.classList.contains("fs-api-entry")){
      clickedElement.classList.add("fs-api-selected");
    }
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
  else {
    nameElement.addEventListener("dblclick", function() {
      getFileContents(absolute_path);
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

async function getFileContents(path) {
  if (document.getElementById("textarea")){
    document.getElementById("textarea").remove();
    document.getElementsByClassName("CodeMirror")[0].remove();
  }
  const input = document.createElement("textarea");
  input.id = "textarea";


  document.getElementById("editor-view").appendChild(input);
  if (path === "") {
    path = document.getElementsByClassName("fs-api-selected")[0].dataset.path;
  }
  open_file = document.getElementById("open-file");
  if (open_file) {
    open_file.removeAttribute("id");
  }
  document.getElementsByClassName("fs-api-selected")[0].id = "open-file";
  const rawResponse = await fetch('open_file', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({path: path})
  });
  const content = await rawResponse.json();
  const text = document.createTextNode(content);
  input.appendChild(text);
  myCodeMirror = CodeMirror.fromTextArea(document.getElementById("textarea"),  {
      lineNumbers: true,
      matchBrackets: true,
      styleActiveLine: true,
      autoCloseBrackets: true,
    }
  );
  filename = document.getElementsByClassName("fs-api-selected")[0].firstChild.textContent;
  extension = (filename.split('.').pop());
  if (extension === 'js'){
    myCodeMirror.setOption('mode', 'javascript');
  }
  else if (extension === 'html'){
    myCodeMirror.setOption('mode', 'xml');
  }
  else if (extension === 'css'){
    myCodeMirror.setOption('mode', 'css');
  }
  else if (extension === 'py'){
    myCodeMirror.setOption('mode', 'python');
  }
  else if (extension === 'java'){
    myCodeMirror.setOption('mode', 'text/x-java');
  }
  else if (extension === 'cpp'){
    myCodeMirror.setOption('mode', 'text/x-c++src');
  }
  else if (extension === 'c'){
    myCodeMirror.setOption('mode', 'text/x-csrc');
  }
}

async function updateFileContents() {
  open_file = document.getElementById("open-file");
  absolute_path = open_file.dataset.path;
  contents = myCodeMirror.getValue();
  await fetch('save_file', {
    method: 'PUT',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({path: absolute_path, contents: contents})
  });
}

async function createFile(path="") {
  name = prompt("Give File Name");
  if (document.getElementsByClassName("fs-api-selected")[0] !== undefined ){
    selected_file = document.getElementsByClassName("fs-api-selected")[0];
    directory_path = selected_file.dataset.path;
    if (selected_file.classList.contains("fs-api-file")) {
      directory_path = directory_path.match(/(.*)[\/\\]/)[1]||'';
    }
  }
  else {
    directory_path = "/Users/irokasidiari/Desktop/arxeia/" + document.getElementById("username").textContent
  }
  path = directory_path + "/" + name;
  const rawResponse = await fetch('create_file', {
    method: 'POST',

    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({path: path})
  });
  const resp = await rawResponse.json();
  if (resp === "exists"){
    alert("A file with that name already exists!");
  }
  else {
    document.getElementsByClassName("fs-api-tree")[0].remove();
    renderUrl("open_filesystem", filesystem);
  }
}

async function deleteEntry(){
  selected_file = document.getElementsByClassName("fs-api-selected")[0];
  path = selected_file.dataset.path;
  if (selected_file.classList.contains("fs-api-file")){
    type = "file";
  }
  else {
    type = "directory"
  }
  await fetch('delete_entry', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({path: path, type: type})
  });
  document.getElementsByClassName("fs-api-tree")[0].remove();
  renderUrl("open_filesystem", filesystem);
}
async function createDirectory(path="") {
  name = prompt("Give Folder Name");
  if (document.getElementsByClassName("fs-api-selected")[0] !== undefined ){
    selected_file = document.getElementsByClassName("fs-api-selected")[0];
    directory_path = selected_file.dataset.path;
    if (selected_file.classList.contains("fs-api-file")) {
      directory_path = directory_path.match(/(.*)[\/\\]/)[1]||'';
    }
  }
  else {
    directory_path = "/Users/irokasidiari/Desktop/arxeia/" + document.getElementById("username").textContent
  }
  path = directory_path + "/" + name;
  const rawResponse = await fetch('create_directory', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({path: path})
  });
  const resp = await rawResponse.json();
  if (resp === "exists"){
    alert("A folder with that name already exists!");
  }
  else {
    document.getElementsByClassName("fs-api-tree")[0].remove();
    renderUrl("open_filesystem", filesystem);
  }
}
(function () {
  const filesystem = document.getElementById('filesystem_view');

  save_button = document.getElementById("save-button");
  save_button.addEventListener("click", function() {
    updateFileContents();
  });
  edit_button = document.getElementById("edit_file");
  edit_button.addEventListener("click", function() {
    getFileContents("");
  });

  create_file = document.getElementById("create_file");
  create_file.addEventListener("click", function() {
    createFile();
  });

  delete_entry = document.getElementById("delete_entry");
  delete_entry.addEventListener("click", function() {
    deleteEntry()
  });

  create_directory = document.getElementById("create_directory");
  create_directory.addEventListener("click", function() {
    createDirectory();
  });

  document.addEventListener("keydown", function(e) {
    if ((window.navigator.platform.match("Mac") ? e.metaKey : e.ctrlKey)  && e.keyCode == 83) {
      e.preventDefault();
      updateFileContents();
    }
    if (event.keyCode == 8) {
      e.preventDefault();
      deleteEntry();
    }
    if (event.keyCode == 46) {
      e.preventDefault();
      deleteEntry();
    }
  }, false);
  let myCodeMirror;
  renderUrl("open_filesystem", filesystem);
})()
