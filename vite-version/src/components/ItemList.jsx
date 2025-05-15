function ItemList({ items }) {
  if (items.length === 0) {
    return <p>No items added yet.</p>;
  }

  return (
    <div>
      <h2>Items to Prioritize:</h2>
      <ul>
        {items.map((item, index) => (
          <li key={index}>{item.name}</li>
        ))}
      </ul>
    </div>
  );
}

export default ItemList;
