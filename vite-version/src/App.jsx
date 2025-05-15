import { useState } from "react";
import "./App.css";
import AddItemForm from "./components/AddItemForm";
import ItemList from "./components/ItemList";
import ComparisonView from "./components/ComparisonView";
import RankingGrid from "./components/RankingGrid";

function App() {
  // State to hold the list of items
  const [items, setItems] = useState([]);
  // State to hold all unique pairs for comparison
  const [pairs, setPairs] = useState([]);
  // State to hold the current pair being compared
  const [currentPairIndex, setCurrentPairIndex] = useState(0);
  // State to track the current view ('add', 'compare', 'rank')
  const [view, setView] = useState("add");
  // Add comparisons state
  const [comparisons, setComparisons] = useState({});

  // Function to add a new item (limit to 10)
  const addItem = (itemName) => {
    if (
      itemName.trim() !== "" &&
      !items.find((item) => item.name === itemName.trim()) &&
      items.length < 10
    ) {
      setItems([...items, { name: itemName.trim(), wins: 0 }]);
    }
  };

  // Function to generate all unique pairs
  const generatePairs = () => {
    if (items.length !== 10) return;
    const generatedPairs = [];
    for (let i = 0; i < items.length; i++) {
      for (let j = i + 1; j < items.length; j++) {
        generatedPairs.push([items[i], items[j]]);
      }
    }
    setPairs(generatedPairs);
    setCurrentPairIndex(0);
    setView("compare");
    setComparisons({}); // Reset comparisons for new round
  };

  // Function to handle comparison result
  const handleComparison = (preferredItemName) => {
    // Find the index of the preferred item in the original items list
    const preferredItemIndex = items.findIndex(
      (item) => item.name === preferredItemName
    );

    if (preferredItemIndex !== -1) {
      // Create a new array with the updated wins count
      const updatedItems = items.map((item, index) => {
        if (index === preferredItemIndex) {
          return { ...item, wins: item.wins + 1 };
        }
        return item;
      });
      setItems(updatedItems);
    }

    // Update comparisons state
    const [itemA, itemB] = pairs[currentPairIndex];
    const winner = preferredItemName;
    const loser = itemA.name === winner ? itemB.name : itemA.name;
    setComparisons((prev) => {
      const updated = { ...prev };
      if (!updated[winner]) updated[winner] = {};
      updated[winner][loser] = (updated[winner][loser] || 0) + 1;
      return updated;
    });

    // Move to the next pair
    if (currentPairIndex < pairs.length - 1) {
      setCurrentPairIndex(currentPairIndex + 1);
    } else {
      // All comparisons done, show ranking
      setView("rank");
    }
  };

  // Calculate ranking whenever items or view changes
  const rankedItems = [...items].sort((a, b) => b.wins - a.wins);

  // Download ranking as CSV
  const handleDownload = () => {
    const csvRows = [
      ["Rank", "Item", "Wins"],
      ...[...rankedItems]
        .reverse()
        .map((item, idx) => [idx + 1, item.name, item.wins]),
    ];
    const csvContent = csvRows.map((row) => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "priority_ranking.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="App">
      <h1>Priority Grid</h1>

      {view === "add" && (
        <>
          <AddItemForm onAddItem={addItem} disabled={items.length >= 10} />
          <ItemList items={items} />
          {items.length < 10 && (
            <p>Add {10 - items.length} more item(s) to reach 10.</p>
          )}
          <button onClick={generatePairs} disabled={items.length !== 10}>
            Start Comparison
          </button>
          {items.length === 10 && (
            <p>All 10 items entered. Ready to compare!</p>
          )}
        </>
      )}

      {view === "compare" && pairs.length > 0 && (
        <ComparisonView
          item1={pairs[currentPairIndex][0]}
          item2={pairs[currentPairIndex][1]}
          onCompare={handleComparison}
          current={currentPairIndex + 1}
          total={pairs.length}
        />
      )}

      {view === "rank" && (
        <>
          <RankingGrid items={rankedItems} comparisons={comparisons} />
          {/* Ranking List */}
          <div
            style={{
              margin: "2em auto 1em auto",
              maxWidth: 500,
              background: "#f9fafb",
              borderRadius: 12,
              boxShadow: "0 2px 12px rgba(83,91,242,0.07)",
              padding: "1.5em 1em",
            }}
          >
            <h2
              style={{
                color: "#535bf2",
                marginBottom: "0.7em",
              }}
            >
              Ranking List
            </h2>
            <ol
              style={{
                textAlign: "left",
                fontSize: "1.1em",
                paddingLeft: "1.5em",
              }}
            >
              {[...rankedItems].reverse().map((item, idx) => (
                <li key={item.name} style={{ marginBottom: "0.5em" }}>
                  <span style={{ fontWeight: 600 }}>{item.name}</span>
                  <span
                    style={{
                      color: "#888",
                      marginLeft: "0.7em",
                    }}
                  >
                    ({item.wins} win{item.wins !== 1 ? "s" : ""})
                  </span>
                </li>
              ))}
            </ol>
            <button onClick={handleDownload} style={{ marginTop: "1em" }}>
              Download Ranking (CSV)
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default App;
