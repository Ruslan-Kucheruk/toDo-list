const form = document.querySelector('#form');
const taskInput = document.querySelector('#taskInput');
const taskList = document.querySelector('#tasksList');
const emptyList = document.querySelector('#emptyList');


let tasks = [];

if(localStorage.getItem('tasks')){
    tasks = JSON.parse(localStorage.getItem('tasks'));
    tasks.forEach((i) => renderTask(i));
};

//Добавление задачи
form.addEventListener('submit', addTask);

//Удаление задачи
taskList.addEventListener('click', deleteTask);

//Перечеркиваем выполненую задачу
taskList.addEventListener('click', doneTask);


//Функции
function addTask(event){
    // Отменяем отправку формы
    event.preventDefault();

    //Достаем текст задачи из поля ввода
    const taskText = taskInput.value;

    //Описываем задачу в виде объекта
    const newTask = {
        id: Date.now(),
        text: taskText,
        done: false,
    }

    // Добавляем задачу в массив с задачами
    tasks.push(newTask);

    saveToLocalStorage();

    renderTask(newTask);

    //Очищаем поле ввода и возвращаем на него фокус

    taskInput.value = '';
    taskInput.focus();

    checkEmptyList()
};

function deleteTask(event){
    
    if(event.target.dataset.action !== 'delete') return;

    const parentNode =  event.target.closest('.list-group-item');

    const id = Number(parentNode.id);
    const index = tasks.findIndex((i) => i.id === id);
    tasks.splice(index, 1);

    // //Альтернативный метод - Удаление задач через фильтрацию массива
    // tasks = tasks.filter((i) => i.id !== id)

    parentNode.remove(); 

    checkEmptyList()

    saveToLocalStorage();
};

function doneTask(event){
    if(event.target.dataset.action !== 'done') return;
    const parentNode = event.target.closest('.list-group-item');

    const id = Number(parentNode.id);

    const task = tasks.find((i) => i.id === id);

    task.done = !task.done;

    const taskTitle = parentNode.querySelector('.task-title');
    taskTitle.classList.toggle('task-title--done');

    saveToLocalStorage();

};

function checkEmptyList(){

    if(tasks.length === 0){
        const emptyListHTML = 
                                `
                                <li id="emptyList" class="list-group-item empty-list">
                                    <img src="./img/leaf.svg" alt="Empty" width="48" class="mt-3">
                                    <div class="empty-list__title">Список дел пуст</div>
                                </li>
                                `
        taskList.insertAdjacentHTML("beforeend", emptyListHTML)
    }

    if(tasks.length > 0){
        const emptyListEl = document.querySelector('#emptyList');
        emptyListEl ? emptyListEl.remove() : null;
    }
        
}

function saveToLocalStorage(){
    localStorage.setItem('tasks', JSON.stringify(tasks))
}

function renderTask(b){
//Формируем CSS класс
const cssClass = b.done ? "task-title task-title--done" : 'task-title';

//Формируем разметку для новой задачи

taskHTML = 
                `<li id='${b.id}' class="list-group-item d-flex justify-content-between task-item">
                    <span class='${cssClass}'>${b.text}</span>
                    <div class="task-item__buttons">
                        <button type="button" data-action="done" class="btn-action">
                            <img src="./img/tick.svg" alt="Done" width="18" height="18">
                        </button>
                        <button type="button" data-action="delete" class="btn-action">
                            <img src="./img/cross.svg" alt="Done" width="18" height="18">
                        </button>
                    </div>
                </li>
                `;

// Добавляем задачу на страницу
taskList.insertAdjacentHTML("beforeend", taskHTML);
}