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
            <div className="flex items-center gap-2">
                <label htmlFor="titleInput">Title: </label>
                <input
                    id="titleInput"
                    type="text"
                    placeholder="What needs to be done?"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="border border-[#ccc] rounded px-2 py-1"
                />
                <button
                    type="submit"
                    className="px-3.5 py-1 bg-blue-600 text-white border-none rounded-full cursor-pointer text-[0.85rem]"
                >
                    Add
                </button>
            </div>
            <p className="mt-1 mb-0 text-[0.8rem] text-[#888]">
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
