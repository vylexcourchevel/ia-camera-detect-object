import { useState, useEffect } from "react";
import { addItem, getItems, clearItems, deleteItem } from "../../db2.js";
import "./TestIndexesDB.css";

const TestIndexesDB = () => {
  const [items, setItems] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [textValue, setTextValue] = useState("");

  useEffect(() => {
    const fetchItems = async () => {
      const allItems = await getItems();
      setItems(allItems);
    };
    fetchItems();
  }, []);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleAddItem = async () => {
    if (!selectedFile || textValue.trim() === "") return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const item = {
        image: event.target.result,
        text: textValue,
        name: selectedFile.name,
        type: selectedFile.type,
      };
      await addItem(item);
      const allItems = await getItems();
      setItems(allItems);
      setSelectedFile(null);
      setTextValue("");
    };
    reader.readAsDataURL(selectedFile);
  };

  const handleClearItems = async () => {
    await clearItems();
    setItems([]);
  };

  const handleDeleteItem = async (id) => {
    await deleteItem(id);
    const updatedItems = await getItems();
    setItems(updatedItems);
  };

  return (
    <div className="container main-container">
      <h1>STORAGE ON IndexedDB</h1>
      <div className="input-container">
        <input type="file" onChange={handleFileChange} />
        <input
          type="text"
          value={textValue}
          onChange={(e) => setTextValue(e.target.value)}
          placeholder="Enter text"
        />
      </div>
      <div className="button-container">
        <button onClick={handleAddItem}>Add Item</button>
        <button onClick={handleClearItems}>Clear Items</button>
      </div>
      <div className="items-container">
        {items.map((item, index) => (
          <div key={index} className="item">
            <h3>{item.name}</h3>
            <p>{item.text}</p>
            <img src={item.image} alt={item.name} />
            <button
              className="delete_button"
              onClick={() => handleDeleteItem(item.id)}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TestIndexesDB;
