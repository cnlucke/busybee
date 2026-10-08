import { useState } from 'react';
import type { Task } from './types';
import TaskForm from './TaskForm';
import TaskItem from './TaskItem';
import { addSubtaskToTree, removeTaskFromTree, updateTaskInTree } from './taskTree';

export default function TaskList() {
    const [tasks, setTasks] = useState<Task[]>(() => [
        { id: '1', title: 'Learn React hooks', done: false, createdAt: Date.now(), subtasks: [] },
        { id: '2', title: 'Build a task list component', done: true, createdAt: Date.now(), subtasks: [] },
    ]);

    const handleAddTask = (task: Task) => {
        setTasks([...tasks, task]);
    };

    const handleToggleComplete = (id: string) => {
        setTasks(updateTaskInTree(tasks, id, (task) => ({ ...task, done: !task.done })));
    };

    const handleDeleteTask = (id: string) => {
        setTasks(removeTaskFromTree(tasks, id));
    };

    const handleEditTask = (id: string, title: string) => {
        setTasks(updateTaskInTree(tasks, id, (task) => ({ ...task, title })));
    };

    const handleAddSubtask = (parentId: string, title: string) => {
        const subtask: Task = {
            id: String(Date.now()),
            title,
            done: false,
            createdAt: Date.now(),
            subtasks: [],
        };
        setTasks(addSubtaskToTree(tasks, parentId, subtask));
    };

    return (
        <div className="w-fit max-w-full mx-auto my-5 font-sans">
            <h2>Task List</h2>
            <TaskForm onAddTask={handleAddTask} />
            <ul className="list-none p-0">
                {tasks.map((task) => (
                    <TaskItem
                        key={task.id}
                        task={task}
                        onToggle={handleToggleComplete}
                        onDelete={handleDeleteTask}
                        onEdit={handleEditTask}
                        onAddSubtask={handleAddSubtask}
                    />
                ))}
            </ul>
            {tasks.length === 0 && <p className="text-[#666]">No tasks left!</p>}
        </div>
    );
}
