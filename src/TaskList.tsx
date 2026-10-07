import { useState } from 'react';
import type {Task} from './types';
import TaskForm from './TaskForm';
import TaskItem from './TaskItem';

export default function TaskList() {
    const [tasks, setTasks] = useState<Task[]>(() => [
        { id: '1', title: 'Learn React hooks', done: false, createdAt: Date.now() },
        { id: '2', title: 'Build a task list component', done: true, createdAt: Date.now() },
    ]);

    const handleAddTask = (task: Task) => {
        setTasks([...tasks, task]);
    };

    const handleToggleComplete = (id: string) => {
        setTasks(tasks.map((task) =>
            task.id === id ? { ...task, done: !task.done } : task
        ));
    };

    const handleDeleteTask = (id: string) => {
        setTasks(tasks.filter((task) => task.id !== id));
    };

    return (
        <div style={{ maxWidth: '400px', margin: '20px auto', fontFamily: 'sans-serif' }}>
            <h2>Task List</h2>
            <TaskForm onAddTask={handleAddTask} />
            <ul style={{ listStyleType: 'none', padding: 0 }}>
                {tasks.map((task) => (
                    <TaskItem
                        key={task.id}
                        task={task}
                        onToggle={handleToggleComplete}
                        onDelete={handleDeleteTask}
                    />
                ))}
            </ul>
            {tasks.length === 0 && <p style={{ color: '#666' }}>No tasks left!</p>}
        </div>
    );
}
