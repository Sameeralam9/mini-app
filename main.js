const notesTab = document.querySelector("#notesTab");
const taskTab = document.querySelector("#taskTab");
const pages = document.querySelector("#pages");
notesTab.addEventListener("click", tabSwitch);
taskTab.addEventListener("click", tabSwitch);

const state = load() || {
  tab: "notes",
  notes: [],
  tasks: [],
  filter: "all",
};
function tabSwitch(e) {
  state.tab = e.target.value;
  pageRander();
  save();
}

function pageRander() {
  if (state.tab === "notes") {
    pages.innerHTML = "";
    const pageData = notePage();
    pages.appendChild(pageData);
    listRander(state[state.tab]);
  } else {
    pages.innerHTML = "";
    const pageData = taskPage();
    pages.appendChild(pageData);
    listRander(state[state.tab]);
  }
}

function save() {
  localStorage.setItem("state", JSON.stringify(state));
}

function load() {
  return JSON.parse(localStorage.getItem("state"));
}

function init() {
  load();
  pageRander();
}
init();

function taskEdit(e) {
  const { index, element } = findIndex(e);
  const val = state.tasks[index];
  element.innerHTML = "";
  const data = taskEditComponent(val);
  element.replaceWith(data);
}

function updateTask(e) {
  const { index, element } = findIndex(e);
  const editInputVal = document.querySelector("#taskEditInput");
  const editDateInputVal = document.querySelector("#taskDateInput");
  const editCatagoryVal = document.querySelector("#catagory");
  const val = state.tasks[index];
  val.task = editInputVal.value;
  val.catagory = editCatagoryVal.value;
  val.date = editDateInputVal.value;
  element.innerHTML = "";
  const data = taskComponent(val);
  element.replaceWith(data);
  save();
}
function cancelUpdate(e) {
  const { index, element } = findIndex(e);
  const val = state.tasks[index];
  element.innerHTML = "";
  const data = taskComponent(val);
  element.replaceWith(data);
}

function taskEditComponent(val) {
  const editOuterDiv = document.createElement("div");
  editOuterDiv.id = val.id;
  const taskEditInput = document.createElement("input");
  taskEditInput.setAttribute("id", "taskEditInput");
  taskEditInput.value = val.task;
  taskEditInput.type = "text";
  const taskDateInput = document.createElement("input");
  taskDateInput.id = "taskDateInput";
  taskDateInput.type = "date";
  taskDateInput.value = val.date;
  const catagoryInput = document.createElement("select");
  catagoryInput.value = val.catagory;
  catagoryInput.id = "editCatagory";
  const workOp = document.createElement("option");
  workOp.value = "work";
  workOp.innerText = "work";
  const homeOp = document.createElement("option");
  homeOp.value = "home";
  homeOp.innerText = "home";
  const studyOp = document.createElement("option");
  studyOp.value = "study";
  studyOp.innerText = "study";
  const updateBtn = document.createElement("button");
  updateBtn.innerHTML = "Update";
  updateBtn.addEventListener("click", updateTask);
  const cancelBtn = document.createElement("button");
  cancelBtn.innerHTML = "Cancel";
  cancelBtn.addEventListener("click", cancelUpdate);
  catagoryInput.append(workOp);
  catagoryInput.append(homeOp);
  catagoryInput.append(studyOp);
  editOuterDiv.append(taskEditInput);
  editOuterDiv.append(taskDateInput);
  editOuterDiv.append(catagoryInput);
  editOuterDiv.append(updateBtn);
  editOuterDiv.append(cancelBtn);
  return editOuterDiv;
}

function noteEdit(e) {
  const { index, element } = findIndex(e);
  element.innerHTML = "";
  const val = state.notes[index];
  const data = noteEditComponent(val);
  element.replaceWith(data);
}
function updateNoteEdit(e) {
  const { index, element } = findIndex(e);
  const editNoteTitleVal = document.querySelector("#eidtTitleHolder");
  const editNoteTextVal = document.querySelector("#editTextHolder");
  const val = state.notes[index];
  val.title = editNoteTitleVal.value;
  val.text = editNoteTextVal.value;
  const data = noteComponent(val);
  element.replaceWith(data);
  save();
}

function noteEditComponent(val) {
  const outerdiv = document.createElement("div");
  outerdiv.id = val.id;
  const eidtTitleHolder = document.createElement("input");
  eidtTitleHolder.value = val.title;
  eidtTitleHolder.id = "eidtTitleHolder";
  const editTextHolder = document.createElement("textarea");
  editTextHolder.value = val.text;
  editTextHolder.id = "editTextHolder";
  const upadetBtn = document.createElement("button");
  upadetBtn.innerText = "Update";
  upadetBtn.addEventListener("click", updateNoteEdit);
  const cancelBtn = document.createElement("button");
  cancelBtn.addEventListener("click", cancelEdit);
  cancelBtn.innerText = "cancel";
  outerdiv.append(eidtTitleHolder);
  outerdiv.append(editTextHolder);
  outerdiv.append(upadetBtn);
  outerdiv.append(cancelBtn);
  return outerdiv;
}

function cancelEdit(e) {
  const { index, element } = findIndex(e);
  element.innerHTML = "";
  const val = state.notes[index];
  const data = noteComponent(val);
  element.replaceWith(data);
}

function findIndex(e) {
  const element = e.target.parentElement;
  const index = state[state.tab].findIndex((val) => val.id === element.id);
  return { index, element };
}
function del(e) {
  const { index } = findIndex(e);
  state[state.tab].splice(index, 1);
  listRander(state[state.tab]);
  save();
}
function component(val) {
  if (state.tab === "notes") {
    return noteComponent(val);
  } else {
    return taskComponent(val);
  }
}

function listRander(list) {
  const Holder = pages.querySelector("#holder");
  Holder.innerHTML = "";
  list.forEach((val) => {
    const ComponentVal = component(val);
    Holder.append(ComponentVal);
  });
}

function addNote(e) {
  const { titleInput, textInput } = notesDomSelector(e);
  state.notes.push({
    id: crypto.randomUUID(),
    title: titleInput.value,
    text: textInput.value,
    timestamp: Date.now(),
  });
  titleInput.value = "";
  textInput.value = "";
  save();
  listRander(state[state.tab]);
}
function addTask(e) {
  const { taskInput, dateInput, catagory } = tasksDomSelector(e);
  state[state.tab].push({
    id: crypto.randomUUID(),
    task: taskInput.value,
    date: dateInput.value,
    catagory: catagory.value,
    completed: false,
  });
  taskInput.value = "";
  dateInput.value = "";
  catagory.value = "work";
  save();
  listRander(state[state.tab]);
}
function tasksDomSelector(e) {
  const data = e.target.closest("#outerDiv");
  const taskInput = data.querySelector("#taskInput");
  const dateInput = data.querySelector("#dateInput");
  const catagory = data.querySelector("#catagory");
  return {
    taskInput,
    dateInput,
    catagory,
  };
}
function notesDomSelector(e) {
  const data = e.target.closest("#outerDiv");
  const titleInput = data.querySelector(`#notesInput`);
  const textInput = data.querySelector("#noteText");
  return {
    titleInput,
    textInput,
  };
}

function notePage() {
  const pageOuterDiv = document.createElement("div");
  pageOuterDiv.id = "outerDiv";
  const noteTitle = document.createElement("input");
  noteTitle.setAttribute("id", "notesInput");
  noteTitle.type = "text";
  const noteText = document.createElement("textarea");
  noteText.setAttribute("id", "noteText");
  const addNoteBtn = document.createElement("button");
  addNoteBtn.innerHTML = "Add Note";
  const hr = document.createElement("hr");
  const br = document.createElement("br");
  const noteHolder = document.createElement("div");
  noteHolder.id = "holder";
  addNoteBtn.addEventListener("click", addNote);
  pageOuterDiv.append(noteTitle);
  pageOuterDiv.append(noteText);
  pageOuterDiv.append(addNoteBtn);
  pageOuterDiv.append(hr);
  pageOuterDiv.append(br);
  pageOuterDiv.append(noteHolder);
  return pageOuterDiv;
}
function filter() {
  if (state.filter == "all") {
    listRander(state[state.tab]);
  }
  if (state.filter == "pending") {
    const data = state.tasks.filter((val) => !val.completed);
    listRander(data);
  }
  if (state.filter == "done") {
    const data = state.tasks.filter((val) => val.completed);
    listRander(data);
  }
}
function changefilter(e) {
  state.filter = e.target.value;
  filter();
}

function taskPage() {
  const pageOuterDiv = document.createElement("div");
  pageOuterDiv.id = "outerDiv";
  const taskInput = document.createElement("input");
  taskInput.setAttribute("id", "taskInput");
  taskInput.type = "text";
  const dateInput = document.createElement("input");
  dateInput.setAttribute("id", "dateInput");
  dateInput.type = "date";
  const catagoryInput = document.createElement("select");
  catagoryInput.id = "catagory";
  const workOp = document.createElement("option");
  workOp.value = "work";
  workOp.innerText = "work";
  const homeOp = document.createElement("option");
  homeOp.value = "home";
  homeOp.innerText = "home";
  const studyOp = document.createElement("option");
  studyOp.value = "study";
  studyOp.innerText = "study";
  const allTasks = document.createElement("button");
  allTasks.innerHTML = "All";
  allTasks.value = "all";
  allTasks.addEventListener("click", changefilter);
  const pendingTasks = document.createElement("button");
  pendingTasks.innerHTML = "Pending";
  pendingTasks.value = "pending";
  pendingTasks.addEventListener("click", changefilter);
  const doneTasks = document.createElement("button");
  doneTasks.innerHTML = "Done";
  doneTasks.value = "done";
  doneTasks.addEventListener("click", changefilter);
  const addtaskBtn = document.createElement("button");
  addtaskBtn.innerHTML = "Add Task";
  const hr = document.createElement("hr");
  const br = document.createElement("br");
  const brNew = document.createElement("br");
  const taskHolder = document.createElement("div");
  taskHolder.id = "holder";
  addtaskBtn.addEventListener("click", addTask);
  catagoryInput.append(workOp);
  catagoryInput.append(homeOp);
  catagoryInput.append(studyOp);
  pageOuterDiv.append(taskInput);
  pageOuterDiv.append(dateInput);
  pageOuterDiv.append(catagoryInput);
  pageOuterDiv.append(addtaskBtn);
  pageOuterDiv.append(brNew);
  pageOuterDiv.append(allTasks);
  pageOuterDiv.append(pendingTasks);
  pageOuterDiv.append(doneTasks);
  pageOuterDiv.append(hr);
  pageOuterDiv.append(br);
  pageOuterDiv.append(taskHolder);
  return pageOuterDiv;
}

function noteComponent(val) {
  const outerdiv = document.createElement("div");
  outerdiv.id = val.id;
  const titleHolder = document.createElement("span");
  titleHolder.innerHTML = val.title;
  const textHolder = document.createElement("p");
  textHolder.innerHTML = val.text;
  const editBtn = document.createElement("button");
  editBtn.innerText = "Edit";
  editBtn.addEventListener("click", noteEdit);
  const deleteBtn = document.createElement("button");
  deleteBtn.innerText = "Delete";
  deleteBtn.addEventListener("click", del);
  outerdiv.append(titleHolder);
  outerdiv.append(textHolder);
  outerdiv.append(editBtn);
  outerdiv.append(deleteBtn);
  return outerdiv;
}
function toggleComplete(e) {
  const { index } = findIndex(e);
  state.tasks[index].completed = !state.tasks[index].completed;
  save();
}

function taskComponent(val) {
  const outerdiv = document.createElement("div");
  outerdiv.id = val.id;
  const taskHolder = document.createElement("span");
  taskHolder.innerHTML = val.task;
  const dateHolder = document.createElement("p");
  dateHolder.innerHTML = val.date;
  const catagoryHolder = document.createElement("span");
  catagoryHolder.innerHTML = val.catagory;
  const editBtn = document.createElement("button");
  editBtn.innerText = "Edit";
  editBtn.addEventListener("click", taskEdit);
  const deleteBtn = document.createElement("button");
  deleteBtn.innerText = "Delete";
  deleteBtn.addEventListener("click", del);
  const toggleBtn = document.createElement("button");
  toggleBtn.innerHTML = "Done";
  toggleBtn.addEventListener("click", toggleComplete);
  outerdiv.append(toggleBtn);
  outerdiv.append(taskHolder);
  outerdiv.append(dateHolder);
  outerdiv.append(catagoryHolder);
  outerdiv.append(editBtn);
  outerdiv.append(deleteBtn);
  return outerdiv;
}
