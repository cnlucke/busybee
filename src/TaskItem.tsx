import { useState } from 'react';
import type { Task } from './types';

interface TaskItemProps {
    task: Task;
    onToggle: (id: string) => void;
    onDelete: (id: string) => void;
    onEdit: (id: string, title: string) => void;
}

export default function TaskItem({ task, onToggle, onDelete, onEdit }: TaskItemProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [draftTitle, setDraftTitle] = useState(task.title);

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

    return (
        <li style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '8px',
            borderBottom: '1px solid #ccc',
            gap: '10px',
        }}>
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
                            border: '1px solid #ccc',
                            borderRadius: '4px',
                            padding: '2px 6px',
                            font: 'inherit',
                        }}
                    />
                ) : (
                    <span
                        onClick={startEditing}
                        style={{
                            textDecoration: task.done ? 'line-through' : 'none',
                            color: task.done ? '#888' : '#000',
                            cursor: 'text',
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
        </li>
    );
}
