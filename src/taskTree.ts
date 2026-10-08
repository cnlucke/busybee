import type { Task } from './types';

export function updateTaskInTree(tasks: Task[], id: string, updater: (task: Task) => Task): Task[] {
    return tasks.map((task) => {
        if (task.id === id) return updater(task);
        if (task.subtasks.length === 0) return task;
        return { ...task, subtasks: updateTaskInTree(task.subtasks, id, updater) };
    });
}

export function removeTaskFromTree(tasks: Task[], id: string): Task[] {
    return tasks
        .filter((task) => task.id !== id)
        .map((task) =>
            task.subtasks.length === 0 ? task : { ...task, subtasks: removeTaskFromTree(task.subtasks, id) }
        );
}

export function addSubtaskToTree(tasks: Task[], parentId: string, subtask: Task): Task[] {
    return tasks.map((task) => {
        if (task.id === parentId) {
            return { ...task, subtasks: [...task.subtasks, subtask] };
        }
        if (task.subtasks.length === 0) return task;
        return { ...task, subtasks: addSubtaskToTree(task.subtasks, parentId, subtask) };
    });
}
