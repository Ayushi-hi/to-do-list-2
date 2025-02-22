document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('taskInput');
    const dateInput = document.getElementById('dateInput');
    const timeInput = document.getElementById('timeInput');
    const addTaskButton = document.getElementById('addTask');
    const taskList = document.getElementById('taskList');

    // Set default date and time values
    const now = new Date();
    dateInput.valueAsDate = now;
    timeInput.value = now.getHours().toString().padStart(2, '0') + ':' + 
                      now.getMinutes().toString().padStart(2, '0');

    // Load tasks from localStorage
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    // Function to save tasks to localStorage
    const saveTasks = () => {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    };

    // Function to format date and time
    const formatDateTime = (date, time) => {
        const dateObj = new Date(date + 'T' + time);
        return dateObj.toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Function to render tasks
    const renderTasks = () => {
        taskList.innerHTML = '';
        
        // Sort tasks by date and time
        tasks.sort((a, b) => {
            const dateA = new Date(a.date + 'T' + a.time);
            const dateB = new Date(b.date + 'T' + b.time);
            return dateA - dateB;
        });

        tasks.forEach((task, index) => {
            const li = document.createElement('li');
            li.innerHTML = `
                <div class="task-content">
                    ${task.text}
                    <div class="task-date">${formatDateTime(task.date, task.time)}</div>
                </div>
                <button class="delete-btn">Delete</button>
            `;

            if (task.completed) {
                li.classList.add('completed');
            }

            // Toggle completion status
            li.addEventListener('click', (e) => {
                if (e.target !== li.querySelector('.delete-btn')) {
                    tasks[index].completed = !tasks[index].completed;
                    saveTasks();
                    renderTasks();
                }
            });

            // Delete task
            li.querySelector('.delete-btn').addEventListener('click', () => {
                tasks.splice(index, 1);
                saveTasks();
                renderTasks();
            });

            taskList.appendChild(li);
        });
    };

    // Add new task
    const addTask = () => {
        const text = taskInput.value.trim();
        const date = dateInput.value;
        const time = timeInput.value;

        if (text && date && time) {
            tasks.push({
                text,
                date,
                time,
                completed: false
            });
            taskInput.value = '';
            // Reset date and time to current
            const now = new Date();
            dateInput.valueAsDate = now;
            timeInput.value = now.getHours().toString().padStart(2, '0') + ':' + 
                             now.getMinutes().toString().padStart(2, '0');
            saveTasks();
            renderTasks();
        }
    };

    // Event listeners
    addTaskButton.addEventListener('click', addTask);
    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addTask();
        }
    });

    // Initial render
    renderTasks();
}); 