function ComparisonView({ item1, item2, onCompare, current, total }) {
  return (
    <div
      style={{
        background: "#f9fafb",
        borderRadius: "12px",
        boxShadow: "0 2px 12px rgba(83,91,242,0.07)",
        padding: "2em 1em",
        margin: "2em auto",
        maxWidth: "500px",
      }}
    >
      <h2 style={{ color: "#535bf2", marginBottom: "0.5em" }}>
        Compare ({current}/{total})
      </h2>
      <p style={{ marginBottom: "1.5em", color: "#2d3a4a" }}>
        Which is more important?
      </p>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "1.5em",
        }}
      >
        <button onClick={() => onCompare(item1.name)}>{item1.name}</button>
        <span style={{ fontWeight: 600, color: "#888" }}>vs</span>
        <button onClick={() => onCompare(item2.name)}>{item2.name}</button>
      </div>
    </div>
  );
}

export default ComparisonView;
