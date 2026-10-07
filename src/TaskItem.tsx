import type {Task} from './types';

interface TaskItemProps {
    task: Task;
    onToggle: (id: string) => void;
    onDelete: (id: string) => void;
}

export default function TaskItem({ task, onToggle, onDelete }: TaskItemProps) {
    return (
        <li style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '8px',
            borderBottom: '1px solid #ccc',
            gap: '10px',
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1 }}>
                <input
                    type="checkbox"
                    checked={task.done}
                    onChange={() => onToggle(task.id)}
                    style={{ cursor: 'pointer' }}
                />
                <span style={{
                    textDecoration: task.done ? 'line-through' : 'none',
                    color: task.done ? '#888' : '#000',
                }}>
                    {task.title}
                </span>
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
