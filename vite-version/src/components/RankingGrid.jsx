import "./RankingGrid.css";

// comparisons: { [itemNameA]: { [itemNameB]: winCountForAOverB } }
function RankingGrid({ items, comparisons }) {
  if (items.length === 0) return <p>No items to display.</p>;

  // Calculate column totals (how many times each item lost to others)
  const colTotals = items.map((colItem) => {
    let total = 0;
    items.forEach((rowItem) => {
      if (
        rowItem.name !== colItem.name &&
        comparisons &&
        comparisons[rowItem.name] &&
        comparisons[rowItem.name][colItem.name]
      ) {
        total += comparisons[rowItem.name][colItem.name];
      }
    });
    return total;
  });

  return (
    <div
      className="ranking-grid-container"
      style={{ animation: "fadeIn 0.7s" }}
    >
      <table className="ranking-grid">
        <caption
          style={{
            captionSide: "top",
            fontWeight: 600,
            fontSize: "1.15em",
            marginBottom: "0.7em",
            color: "#535bf2",
          }}
        >
          Pairwise Preference Matrix
        </caption>
        <thead>
          <tr>
            <th></th>
            {items.map((item, idx) => (
              <th key={idx}>{item.name}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {items.map((rowItem, rowIdx) => (
            <tr key={rowIdx}>
              <th>{rowItem.name}</th>
              {items.map((colItem, colIdx) => (
                <td
                  key={colIdx}
                  className={
                    rowIdx === colIdx
                      ? "self-cell"
                      : comparisons &&
                        comparisons[rowItem.name] &&
                        comparisons[rowItem.name][colItem.name] > 0
                      ? "win-cell"
                      : comparisons &&
                        comparisons[colItem.name] &&
                        comparisons[colItem.name][rowItem.name] > 0
                      ? "lose-cell"
                      : ""
                  }
                >
                  {rowIdx === colIdx
                    ? "-"
                    : comparisons &&
                      comparisons[rowItem.name] &&
                      comparisons[rowItem.name][colItem.name] > 0
                    ? comparisons[rowItem.name][colItem.name]
                    : comparisons &&
                      comparisons[colItem.name] &&
                      comparisons[colItem.name][rowItem.name] > 0
                    ? 0
                    : ""}
                </td>
              ))}
            </tr>
          ))}
          {/* Add total row */}
          <tr>
            <th>Total</th>
            {colTotals.map((total, idx) => (
              <td key={idx} className="total-cell">
                {total}
              </td>
            ))}
          </tr>
        </tbody>
      </table>
      <p>
        Each cell shows how many times the row item was preferred over the
        column item.
      </p>
    </div>
  );
}

export default RankingGrid;
