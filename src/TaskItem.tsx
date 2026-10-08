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
        <li style={{ borderBottom: '1px solid #ccc', padding: '8px 0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px', padding: '0 8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, minWidth: 0 }}>
                    <input
                        type="checkbox"
                        checked={task.done}
                        onChange={() => onToggle(task.id)}
                        style={{ cursor: 'pointer' }}
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
                            style={{
                                flex: 1,
                                minWidth: 0,
                                border: '1px solid #ccc',
                                borderRadius: '4px',
                                padding: '2px 6px',
                                font: 'inherit',
                            }}
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
                            style={{
                                textDecoration: task.done ? 'line-through' : 'none',
                                color: task.done ? '#888' : '#000',
                                cursor: 'text',
                                flex: 1,
                                minWidth: 0,
                                overflowWrap: 'break-word',
                            }}
                        >
                            {task.title}
                        </span>
                    )}
                </div>
                <span style={{ fontSize: '0.75rem', color: '#999' }}>
                    {new Date(task.createdAt).toLocaleDateString()}
                </span>
                <button
                    onClick={() => onDelete(task.id)}
                    style={{ color: 'red', border: 'none', background: 'none', cursor: 'pointer' }}
                >
                    Delete
                </button>
            </div>

            <div style={{ paddingLeft: '32px', marginTop: '4px' }}>
                {isAddingSubtask ? (
                    <form onSubmit={submitSubtask} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <input
                            type="text"
                            autoFocus
                            value={subtaskTitle}
                            placeholder="Subtask title"
                            onChange={(e) => setSubtaskTitle(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Escape') cancelAddSubtask();
                            }}
                            style={{
                                flex: 1,
                                minWidth: 0,
                                border: '1px solid #ccc',
                                borderRadius: '4px',
                                padding: '2px 6px',
                                fontSize: '0.85rem',
                            }}
                        />
                        <button
                            type="submit"
                            style={{
                                padding: '2px 10px',
                                background: '#2563eb',
                                color: '#fff',
                                border: 'none',
                                borderRadius: '9999px',
                                cursor: 'pointer',
                                fontSize: '0.75rem',
                            }}
                        >
                            Add
                        </button>
                        <button
                            type="button"
                            onClick={cancelAddSubtask}
                            style={{ background: 'none', border: 'none', color: '#999', cursor: 'pointer', fontSize: '0.75rem' }}
                        >
                            Cancel
                        </button>
                    </form>
                ) : (
                    <button
                        onClick={() => setIsAddingSubtask(true)}
                        style={{ background: 'none', border: 'none', color: '#2563eb', cursor: 'pointer', fontSize: '0.75rem', padding: 0 }}
                    >
                        + Add subtask
                    </button>
                )}
            </div>

            {task.subtasks.length > 0 && (
                <ul style={{ listStyleType: 'none', padding: 0, margin: '4px 0 0', paddingLeft: '32px' }}>
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
