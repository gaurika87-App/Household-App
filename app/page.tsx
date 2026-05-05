"use client";
import { doc, updateDoc } from "firebase/firestore";
//Saving in firebase database
import { deleteDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import { collection, addDoc, getDocs } from "firebase/firestore";
import { useEffect } from "react";
import { useState } from "react";

export default function Home() {
  const [task, setTask] = useState("");
  const [category, setCategory] = useState("todo");
  const [tasks, setTasks] = useState([]);


  const addTask = async () => {
  if (!task) return;

  await addDoc(collection(db, "tasks"), {
    title: task,
    category,
    done: false,
    createdAt: new Date()
  });

  setTask("");
  loadTasks(); // reload after adding
};

 const toggleDone = async (taskItem) => {
  const taskRef = doc(db, "tasks", taskItem.id);

  await updateDoc(taskRef, {
    done: !taskItem.done
  });

  loadTasks(); // refresh list
};

  const categories = {
    todo: "To Do",
    to_buy: "To Buy",
    to_clean: "To Clean",
    to_cook: "To Cook"
  };

  const loadTasks = async () => {
  const querySnapshot = await getDocs(collection(db, "tasks"));
  const data = [];

  querySnapshot.forEach((doc) => {
    data.push({ id: doc.id, ...doc.data() });
  });

  setTasks(data);
};

const deleteTask = async (taskItem) => {
  await deleteDoc(doc(db, "tasks", taskItem.id));
  loadTasks();
};

useEffect(() => {
  loadTasks();
}, []);

  return (
    <div style={{ padding: 20 }}>
      <h1>🏠 Household Manager</h1>

      <div style={{ marginBottom: 20 }}>
        <input
          value={task}
          onChange={(e) => setTask(e.target.value)}
          placeholder="Enter task"
        />

        <select onChange={(e) => setCategory(e.target.value)}>
          <option value="todo">To Do</option>
          <option value="to_buy">To Buy</option>
          <option value="to_clean">To Clean</option>
          <option value="to_cook">To Cook</option>
        </select>

        <button onClick={addTask}>Add</button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        {Object.keys(categories).map((cat) => (
          <div key={cat} style={{ border: "1px solid gray", padding: 10 }}>
            <h2>{categories[cat]}</h2>

            {tasks
              .filter((t) => t.category === cat)
              .map((t, i) => (
                <div key={i}>
                  <input
                    type="checkbox"
                    checked={t.done}
                    onChange={() => toggleDone(t)}
                  />
                  <span
                    style={{
                      textDecoration: t.done ? "line-through" : "none",
                      marginLeft: 8
                    }}
                  >
                    {t.title}
                  </span>
                  <button onClick={() => deleteTask(t)}>❌</button>
                </div>
              ))}
          </div>
        ))}
      </div>
    </div>
  );
}