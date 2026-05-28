"use client";

import { useState, useEffect } from "react";
import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";

import { db } from "../lib/firebase";

export default function Home() {
  const [task, setTask] = useState("");
  const [category, setCategory] = useState("todo");
  const [tasks, setTasks] = useState([]);
  const [groceryItem, setGroceryItem] = useState("");
  const [groceryList, setGroceryList] = useState([]);

  const categories = {
    todo: {
      title: "To Do",
      color: "#dbeafe",
    },
    to_buy: {
      title: "To Buy",
      color: "#dcfce7",
    },
    to_clean: {
      title: "To Clean",
      color: "#fef3c7",
    },
    to_cook: {
      title: "To Cook",
      color: "#fce7f3",
    },
  };
const addGrocery = () => {
  if (!groceryItem.trim()) return;

  const newTask = {
    id: Date.now(),
    title: groceryItem,
    category: "to_buy",
    done: false,
    type: "grocery",
  };

  setTasks((prevTasks) => [
    ...prevTasks,
    newTask,
  ]);

  setGroceryItem("");
};

const toggleGrocery = (index) => {
  const updated = [...groceryList];
  updated[index].bought = !updated[index].bought;
  setGroceryList(updated);
};

const deleteGrocery = (index) => {
  const updated = groceryList.filter((_, i) => i !== index);
  setGroceryList(updated);
};

  const loadTasks = async () => {
    const querySnapshot = await getDocs(collection(db, "tasks"));
    const data = [];

    querySnapshot.forEach((docItem) => {
      data.push({ id: docItem.id, ...docItem.data() });
    });

    setTasks(data);
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const addTask = async () => {
    if (!task) return;

    await addDoc(collection(db, "tasks"), {
      
  id: Date.now(),
  title: task,
  category,
  done: false,
  type: "normal",

      createdAt: new Date(),
    });

    setTask("");
    loadTasks();
  };

  const toggleDone = async (taskItem) => {
    const taskRef = doc(db, "tasks", taskItem.id);

    await updateDoc(taskRef, {
      done: !taskItem.done,
    });

    loadTasks();
  };

  const deleteTask = async (taskItem) => {
    await deleteDoc(doc(db, "tasks", taskItem.id));
    loadTasks();
  };

  return (

     <div
      style={{
        minHeight: "100vh",
        background: "#f5f7fb",
        color: "black",
        padding: "30px",
        fontFamily: "Arial",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        <h1
          style={{
            textAlign: "center",
            marginBottom: "30px",
            fontSize: "36px",
          }}
        >
          🏠 Household Manager
        </h1>

        <div
          style={{
            background: "white",
            color: "black",
            padding: "20px",
            borderRadius: "16px",
            marginBottom: "30px",
            boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
            display: "flex",
            gap: "10px",
            flexWrap: "wrap",
          }}
        >
          <input
            value={task}
            onChange={(e) => setTask(e.target.value)}
            placeholder="Enter task"
            style={{
              flex: 1,
              padding: "12px",
              borderRadius: "10px",
              border: "1px solid #ccc",
              minWidth: "220px",
            }}
          />

          <select
            onChange={(e) => setCategory(e.target.value)}
            style={{
              padding: "12px",
              borderRadius: "10px",
              border: "1px solid #ccc",
            }}
          >
            <option value="todo">To Do</option>
            <option value="to_buy">To Buy</option>
            <option value="to_clean">To Clean</option>
            <option value="to_cook">To Cook</option>
          </select>

          <button
            onClick={addTask}
            style={{
              background: "white",
              color: "black",
              border: "none",
              padding: "12px 18px",
              borderRadius: "10px",
              cursor: "pointer",
            }}
          >
            Add Task
          </button>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "20px",
          }}
        >
          {Object.keys(categories).map((cat) => (
            <div
              key={cat}
              style={{
                background: categories[cat].color,
                padding: "18px",
                borderRadius: "16px",
                minHeight: "300px",
                boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
              }}
            >
              <h2 style={{ marginBottom: "15px" }}>
                {categories[cat].title}
              </h2>

              {cat === "to_buy" && (
  <>
    {/* Grocery Quick Add */}
    <div
      style={{
        background: "#ecfccb",
        padding: "12px",
        borderRadius: "12px",
        marginBottom: "20px",
        border: "1px solid #bef264",
      }}
    >
      <div
        style={{
          fontWeight: "bold",
          marginBottom: "10px",
          color: "#166534",
        }}
      >
        🛒 Grocery Quick Add
      </div>

      <div
        style={{
          display: "flex",
          gap: "8px",
           flexWrap: "wrap",
           alignItems: "center",
        }}
      >
        <input
          value={groceryItem}
          onChange={(e) =>
            setGroceryItem(e.target.value)
          }
          placeholder="Add grocery item"
          style={{
            flex: 1,
            padding: "10px",
            borderRadius: "8px",
            border: "1px solid #ccc",
            background: "white",
            color: "black",
          }}
        />

        <button
          onClick={addGrocery}
          style={{
  background: "#65a30d",
  color: "white",
  border: "none",
  padding: "6px 10px",
  borderRadius: "6px",
  cursor: "pointer",
  fontWeight: "bold",
  fontSize: "12px",
  minWidth: "90px",
  height: "36px",
}}
        >
          + Grocery
        </button>
      </div>
    </div>

    {/* Grocery Items Section */}
    <div
      style={{
        background: "#dcfce7",
        padding: "8px 12px",
        borderRadius: "10px",
        marginBottom: "10px",
        fontWeight: "bold",
        color: "#166534",
      }}
    >
      🛒 Grocery Items
    </div>

    {tasks
      .filter(
        (t) =>
          t.category === "to_buy" &&
          t.type === "grocery"
      )
      .map((t) => (
        <div
          key={t.id}
          style={{
            background: "white",
            color: "black",
            padding: "12px",
            borderRadius: "12px",
            marginBottom: "10px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <input
              type="checkbox"
              checked={t.done}
              onChange={() => toggleDone(t)}
            />

            <span
              style={{
                marginLeft: "10px",
                textDecoration: t.done
                  ? "line-through"
                  : "none",
              }}
            >
              {t.title}
            </span>
          </div>

          <button
            onClick={() => deleteTask(t)}
            style={{
              background: "transparent",
              border: "none",
              cursor: "pointer",
            }}
          >
            ❌
          </button>
        </div>
      ))}

    {/* Other Buy Items */}
    <div
      style={{
        background: "#e0f2fe",
        padding: "8px 12px",
        borderRadius: "10px",
        marginTop: "20px",
        marginBottom: "10px",
        fontWeight: "bold",
        color: "#075985",
      }}
    >
      📦 Other Buy Items
    </div>
  </>
)}

{tasks
  .filter((t) => {
  if (cat !== "to_buy") {
    return t.category === cat;
  }

  return (
    t.category === "to_buy" &&
    t.type !== "grocery"
  );
})
  .map((t) => (
    <div
      key={t.id}
      style={{
        background: "white",
        color: "black",
        padding: "12px",
        borderRadius: "12px",
        marginBottom: "10px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
        }}
      >
        <input
          type="checkbox"
          checked={t.done}
          onChange={() => toggleDone(t)}
        />

        <span
          style={{
            marginLeft: "10px",
            textDecoration: t.done
              ? "line-through"
              : "none",
          }}
        >
          {t.title}
        </span>
      </div>

      <button
        onClick={() => deleteTask(t)}
        style={{
          background: "transparent",
          border: "none",
          cursor: "pointer",
        }}
      >
        ❌
      </button>
    </div>
  ))}
            </div>
          ))}
          <div
    style={{
      display: "flex",
      gap: "10px",
      marginBottom: "20px",
      flexWrap: "wrap",
    }}
  >
  </div>
</div>
        </div>
      </div>
  );
}