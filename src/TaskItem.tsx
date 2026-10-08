import { useState } from 'react';
import type { Task } from './types';
import { findEmbeddedUrl, parseHttpUrl } from './url';
import LinkPreview from './LinkPreview';

interface TaskItemProps {
    task: Task;
    onToggle: (id: string) => void;
    onDelete: (id: string) => void;
    onEdit: (id: string, title: string) => void;
    onAddSubtask: (parentId: string, title: string) => void;
}

export default function TaskItem({ task, onToggle, onDelete, onEdit, onAddSubtask }: TaskItemProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [draftTitle, setDraftTitle] = useState(task.title);
    const [isAddingSubtask, setIsAddingSubtask] = useState(false);
    const [subtaskTitle, setSubtaskTitle] = useState('');

    const startEditing = () => {
        setDraftTitle(task.title);
        setIsEditing(true);
    };

    const saveEdit = () => {
        const trimmed = draftTitle.trim();
        if (trimmed && trimmed !== task.title) {
            onEdit(task.id, trimmed);
        }
        setIsEditing(false);
    };

    const cancelEdit = () => {
        setDraftTitle(task.title);
        setIsEditing(false);
    };

    const cancelAddSubtask = () => {
        setIsAddingSubtask(false);
        setSubtaskTitle('');
    };

    const submitSubtask = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const trimmed = subtaskTitle.trim();
        if (!trimmed) return;
        onAddSubtask(task.id, trimmed);
        setSubtaskTitle('');
        setIsAddingSubtask(false);
    };

    const exactUrl = parseHttpUrl(task.title);
    const embeddedUrl = exactUrl ? null : findEmbeddedUrl(task.title);

    return (
        <li className="border-b border-[#ccc] py-2">
            <div className="flex justify-between items-center gap-2.5 px-2">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                    <input
                        type="checkbox"
                        checked={task.done}
                        onChange={() => onToggle(task.id)}
                        className="cursor-pointer"
                    />
                    {isEditing ? (
                        <input
                            type="text"
                            value={draftTitle}
                            autoFocus
                            onChange={(e) => setDraftTitle(e.target.value)}
                            onBlur={saveEdit}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') e.currentTarget.blur();
                                if (e.key === 'Escape') cancelEdit();
                            }}
                            className="flex-1 min-w-0 border border-[#ccc] rounded px-1.5 py-0.5 [font:inherit]"
                        />
                    ) : exactUrl ? (
                        <LinkPreview url={task.title} done={task.done} onTitleClick={startEditing} />
                    ) : embeddedUrl ? (
                        <LinkPreview
                            url={embeddedUrl.url.toString()}
                            done={task.done}
                            onTitleClick={startEditing}
                            before={embeddedUrl.before}
                            after={embeddedUrl.after}
                        />
                    ) : (
                        <span
                            onClick={startEditing}
                            className={`${task.done ? 'line-through text-[#888]' : 'text-black'} cursor-text flex-1 min-w-0 wrap-break-word`}
                        >
                            {task.title}
                        </span>
                    )}
                </div>
                <span className="text-xs text-[#999]">
                    {new Date(task.createdAt).toLocaleDateString()}
                </span>
                <button
                    onClick={() => onDelete(task.id)}
                    className="text-[red] border-none bg-transparent cursor-pointer"
                >
                    Delete
                </button>
            </div>

            <div className="pl-8 mt-1">
                {isAddingSubtask ? (
                    <form onSubmit={submitSubtask} className="flex items-center gap-1.5">
                        <input
                            type="text"
                            autoFocus
                            value={subtaskTitle}
                            placeholder="Subtask title"
                            onChange={(e) => setSubtaskTitle(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Escape') cancelAddSubtask();
                            }}
                            className="flex-1 min-w-0 border border-[#ccc] rounded px-1.5 py-0.5 text-[0.85rem]"
                        />
                        <button
                            type="submit"
                            className="px-2.5 py-0.5 bg-blue-600 text-white border-none rounded-full cursor-pointer text-xs"
                        >
                            Add
                        </button>
                        <button
                            type="button"
                            onClick={cancelAddSubtask}
                            className="bg-transparent border-none text-[#999] cursor-pointer text-xs"
                        >
                            Cancel
                        </button>
                    </form>
                ) : (
                    <button
                        onClick={() => setIsAddingSubtask(true)}
                        className="bg-transparent border-none text-blue-600 cursor-pointer text-xs p-0"
                    >
                        + Add subtask
                    </button>
                )}
            </div>

            {task.subtasks.length > 0 && (
                <ul className="list-none mt-1 mb-0 mx-0 pr-0 py-0 pl-8">
                    {task.subtasks.map((subtask) => (
                        <TaskItem
                            key={subtask.id}
                            task={subtask}
                            onToggle={onToggle}
                            onDelete={onDelete}
                            onEdit={onEdit}
                            onAddSubtask={onAddSubtask}
                        />
                    ))}
                </ul>
            )}
        </li>
    );
}
