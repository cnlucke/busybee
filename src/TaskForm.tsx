import { useState } from "react";
import { Task } from "./types";

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
        });
        setTitle("");
        setDone(false);
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label htmlFor="titleInput">Title: </label>
                <input
                    id="titleInput"
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
            </div>
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
            <br />
            <button type="submit">Add Task</button>
        </form>
    );
}

export default TaskForm;
