import { useState } from "react";
import type { Task } from "./types";

interface TaskFormProps {
    onAddTask: (task: Task) => void;
}

function TaskForm({ onAddTask }: TaskFormProps) {
    const [title, setTitle] = useState("");
    const [done, setDone] = useState(false);

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!title.trim()) return;
        onAddTask({
            id: String(Date.now()),
            title: title.trim(),
            done,
            createdAt: Date.now(),
            subtasks: [],
        });
        setTitle("");
        setDone(false);
    };

    return (
        <form onSubmit={handleSubmit}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <label htmlFor="titleInput">Title: </label>
                <input
                    id="titleInput"
                    type="text"
                    placeholder="What needs to be done?"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    style={{
                        border: '1px solid #ccc',
                        borderRadius: '4px',
                        padding: '4px 8px',
                    }}
                />
                <button
                    type="submit"
                    style={{
                        padding: '4px 14px',
                        background: '#2563eb',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '9999px',
                        cursor: 'pointer',
                        fontSize: '0.85rem',
                    }}
                >
                    Add
                </button>
            </div>
            <p style={{ margin: '4px 0 0', fontSize: '0.8rem', color: '#888' }}>
                Type a task above, then click Add to save it.
            </p>
            <br />
            <div>
                <label htmlFor="doneInput">Done: </label>
                <input
                    id="doneInput"
                    type="checkbox"
                    checked={done}
                    onChange={(e) => setDone(e.target.checked)}
                />
            </div>
        </form>
    );
}

export default TaskForm;
