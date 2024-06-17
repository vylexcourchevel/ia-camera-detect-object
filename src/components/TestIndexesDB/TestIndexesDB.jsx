import { useState, useEffect } from 'react';
import { addItem, getItems, clearItems } from '../../db.js';

const TestIndexesDB = () => {
  const [items, setItems] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [textValue, setTextValue] = useState('');

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
    if (!selectedFile || textValue.trim() === '') return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const item = {
        image: event.target.result,
        text: textValue,
        name: selectedFile.name,
        type: selectedFile.type
      };
      await addItem(item);
      const allItems = await getItems();
      setItems(allItems);
      setSelectedFile(null);
      setTextValue('');
    };
    reader.readAsDataURL(selectedFile);
  };

  const handleClearItems = async () => {
    await clearItems();
    setItems([]);
  };

  return (
    <div>
      <h1>IndexedDB Image and Text Storage</h1>
      <input type="file" onChange={handleFileChange} />
      <input
        type="text"
        value={textValue}
        onChange={(e) => setTextValue(e.target.value)}
        placeholder="Enter text"
      />
      <button onClick={handleAddItem}>Add Item</button>
      <button onClick={handleClearItems}>Clear Items</button>
      <div>
        {items.map((item, index) => (
          <div key={index}>
            <h3>{item.name}</h3>
            <p>{item.text}</p>
            <img src={item.image} alt={item.name} style={{ width: '200px' }} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default TestIndexesDB;
