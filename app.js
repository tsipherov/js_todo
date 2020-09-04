const tasks = {
  _id: 'task-1599218026378',
  completed: true,
  body: 'На данный момент у вас нет никаких созданных списков задач. Добавьте свою первую задачу.',
  title: 'Создать свой первый список задач',
}

const arrOfTasks = {};
if (!localStorage.getItem("arrOfTasks")) {
  arrOfTasks[tasks._id] = tasks;
}
const idInitTask = tasks._id;
Object.assign(arrOfTasks, JSON.parse(localStorage.getItem("arrOfTasks")));

// из массива tasks с помощью метода reduce() создаем объект, где ключами будут id
// а значениями объекты из массива
(function (objOfTasks) {

  const listContainer = document.querySelector(".tasks-list-section .list-group");
  const addTaskForm = document.forms["addTask"];
  const inputTitle = addTaskForm.elements["title"];
  const inputBoby = addTaskForm.elements["body"];

  addTaskForm.addEventListener("submit", formSubmitHandler);
  listContainer.addEventListener("click", deleteTaskHandler)
  renderAllTasks(objOfTasks);

  function renderAllTasks(objOfTasks) {
    if (!objOfTasks) {
      console.error("List of tasks is empty!");
      return;
    }

    const fragment = document.createDocumentFragment();

    Object.values(objOfTasks).forEach(task => {
      const li = listItemTemplate(task);
      fragment.append(li);
    });

    listContainer.append(fragment);
  }

  function listItemTemplate({ _id, title, body } = {}) {
    const li = document.createElement("li");
    li.classList.add("list-group-item", "d-flex", "align-items-center", "flex-wrap", "mt-2");
    li.setAttribute("data-task-id", _id);

    const span = document.createElement("span");
    span.classList.add("font-weight-bold");
    span.textContent = title;

    const button = document.createElement("button");
    button.classList.add("btn", "btn-danger", "ml-auto", "delete-btn");
    button.textContent = "Delete task";

    const p = document.createElement("p");
    p.classList.add("mt-2", "w-100", "text-break");
    p.textContent = body;

    li.append(span, p, button);

    return li;
  }

  function formSubmitHandler(e) {
    e.preventDefault();
    const titleValue = inputTitle.value;
    const bodyValue = inputBoby.value;

    if (!titleValue || !bodyValue) {
      alert("Введите название и описание задачи!");
      return;
    }

    const newTask = createNewTask(titleValue, bodyValue);
    if (objOfTasks[idInitTask]) {
      deleteTask(idInitTask);
    };
    saveTasksToLocalStoreg(objOfTasks);
    const newTaskElem = listItemTemplate(newTask);
    listContainer.prepend(newTaskElem);
    addTaskForm.reset();
  }

  function createNewTask(title, body) {
    const newTask = {
      title,
      body,
      completed: false,
      _id: `task-${new Date().valueOf()}`
    }

    objOfTasks[newTask._id] = newTask;


    return { ...newTask };
  }

  function deleteTask(id) {
    delete objOfTasks[id];
    saveTasksToLocalStoreg(objOfTasks);
    const liForDelete = listContainer.querySelector(`[data-task-id = ${id}]`);
    liForDelete.remove();
  }

  function deleteTaskHandler(e) {
    if (e.target.classList.contains("delete-btn")) {
      const parentLi = e.target.closest('[data-task-id]');
      const parentId = parentLi.dataset.taskId;
      const isConfirm = confirm(`Вы действительно хотите удалить задачу "${objOfTasks[parentId].title}"?`);
      if (isConfirm) {
        console.log(parentId);
        deleteTask(parentId);
      }
    };
  }

  function saveTasksToLocalStoreg(objOfTasks) {
    localStorage.setItem("arrOfTasks", JSON.stringify(objOfTasks));
  }
})(arrOfTasks);

