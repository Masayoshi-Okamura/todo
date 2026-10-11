document.addEventListener('DOMContentLoaded', () => {
    const todoForm = document.getElementById('todo-form');
    const taskList = document.getElementById('task-list');
    const emptyState = document.getElementById('empty-state');
    const filterBtns = document.querySelectorAll('.filter-btn');

    let tasks = JSON.parse(localStorage.getItem('todo_tasks')) || [];
    let currentFilter = 'all';

    const saveTasks = () => {
        localStorage.setItem('todo_tasks', JSON.stringify(tasks));
    };

    const getDueDateStatus = (dateStr) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const dueDate = new Date(dateStr);
        dueDate.setHours(0, 0, 0, 0);

        if (dueDate < today) return 'overdue';
        if (dueDate.getTime() === today.getTime()) return 'urgent';
        return 'normal';
    };

    const renderTasks = () => {
        taskList.innerHTML = '';

        const filteredTasks = tasks.filter(task =>
            currentFilter === 'all' || task.category === currentFilter
        );

        if (filteredTasks.length === 0) {
            emptyState.classList.remove('hidden');
        } else {
            emptyState.classList.add('hidden');
        }

        // Sort by due date (ascending)
        filteredTasks.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));

        filteredTasks.forEach(task => {
            const li = document.createElement('li');
            li.className = `task-item ${task.completed ? 'completed' : ''}`;

            const dateStatus = getDueDateStatus(task.dueDate);
            const dateClass = dateStatus === 'overdue' ? 'overdue' : (dateStatus === 'urgent' ? 'urgent' : '');

            li.innerHTML = `
                <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''} data-id="${task.id}">
                <div class="task-content">
                    <span class="task-text">${task.text}</span>
                    <div class="task-meta">
                        <span class="badge">${task.category}</span>
                        <span class="${dateClass}">期限: ${task.dueDate}</span>
                    </div>
                </div>
                <button class="delete-btn" data-id="${task.id}">削除</button>
            `;

            taskList.appendChild(li);
        });
    };

    todoForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const text = document.getElementById('task-text').value;
        const category = document.getElementById('task-category').value;
        const dueDate = document.getElementById('task-date').value;

        const newTask = {
            id: Date.now().toString(),
            text,
            category,
            dueDate,
            completed: false,
            createdAt: new Date().toISOString()
        };

        tasks.push(newTask);
        saveTasks();
        renderTasks();
        todoForm.reset();
    });

    taskList.addEventListener('change', (e) => {
        if (e.target.classList.contains('task-checkbox')) {
            const id = e.target.dataset.id;
            tasks = tasks.map(task =>
                task.id === id ? { ...task, completed: !task.completed } : task
            );
            saveTasks();
            renderTasks();
        }
    });

    taskList.addEventListener('click', (e) => {
        if (e.target.classList.contains('delete-btn')) {
            const id = e.target.dataset.id;
            tasks = tasks.filter(task => task.id !== id);
            saveTasks();
            renderTasks();
        }
    });

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFilter = btn.dataset.filter;
            renderTasks();
        });
    });

    renderTasks();
});
