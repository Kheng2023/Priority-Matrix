import { useState } from "react";

function AddItemForm({ onAddItem, disabled }) {
  const [itemName, setItemName] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!disabled) {
      onAddItem(itemName);
      setItemName("");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={itemName}
        onChange={(e) => setItemName(e.target.value)}
        placeholder="Enter item here to compare"
        disabled={disabled}
      />
      <button type="submit" disabled={!itemName.trim() || disabled}>
        Add Item
      </button>
      {disabled && (
        <span style={{ marginLeft: "1em", color: "#888" }}>Limit reached</span>
      )}
    </form>
  );
}

export default AddItemForm;
