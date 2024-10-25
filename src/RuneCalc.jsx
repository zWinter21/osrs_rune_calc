import { useState } from "react";
import "./RuneCalc.css";
import spellBooks from "./spells";
import runes from "./runes";

const RuneCalculator = () => {
    const [selectedSpellbook, setSelectedSpellbook] = useState("standard");
    const [selectedCategory, setSelectedCategory] = useState("combat");
    const [selectedSpell, setSelectedSpell] = useState("");
    const [spellQuantity, setSpellQuantity] = useState(1);
    const [isBuyingFromBattleRunes, setIsBuyingFromBattleRunes] =
        useState(false);

    const calculateDynamicPrice = (
        initialPrice,
        quantity,
        maxStock,
        priceIncreaseRate,
        isPackAvailable
    ) => {
        let totalCost = 0;
        let remainingQuantity = quantity;
        let currentStock = maxStock;
        let maxCurrentStock = maxStock;
        let purchaseQuantity = isPackAvailable && quantity >= 100 ? 100 : 1; // Purchase quantity is 100 if packs are available and quantity needed >= 100 runes, else its 1
        let buyingPacksBool = isPackAvailable && quantity >= 100;
        while (remainingQuantity > 0) {
            let currentPrice = 0;
            // Apply dynamic pricing
            const unitsBelowMaxStock = maxCurrentStock - currentStock;
            const priceMultiplier = 1 + unitsBelowMaxStock * priceIncreaseRate;

            if (buyingPacksBool) {
                // Buying packs
                currentPrice = initialPrice * priceMultiplier; // initialPrice is pack price
                // Accumulate total cost
                totalCost += currentPrice;
                // Update remaining quantity and current stock
                remainingQuantity -= purchaseQuantity; // Decrease remaining quantity by 100
                currentStock -= 1; // Decrement pack stock by 1

                // If stock is depleted, reset to max stock
                if (currentStock <= 0) {
                    currentStock = maxCurrentStock;
                }
            } else {
                // Buying individual runes
                currentPrice =
                    initialPrice * priceMultiplier * purchaseQuantity; // initialPrice is rune price

                // Accumulate total cost
                totalCost += currentPrice;

                // Update remaining quantity and current stock
                remainingQuantity -= purchaseQuantity; // Decrease remaining quantity by 1
                currentStock -= purchaseQuantity; // Decrement rune stock by 1

                // If stock is depleted, reset to max stock
                if (currentStock <= 0) {
                    currentStock = maxCurrentStock;
                }
            }
        }

        return Math.round(totalCost);
    };

    // Helper function to format prices
    const formatPrice = (price) => {
        if (price > 999) {
            return `${Math.ceil(price / 1000)}k gp`;
        }
        return `${price} gp`;
    };

    const handleSpellbookChange = (event) => {
        setSelectedSpellbook(event.target.value);
        setSelectedCategory("combat");
        setSelectedSpell("");
    };

    const handleCategoryChange = (event) => {
        setSelectedCategory(event.target.value);
        setSelectedSpell("");
    };

    const handleSpellChange = (event) => {
        setSelectedSpell(event.target.value);
    };

    const handleQuantityChange = (event) => {
        setSpellQuantity(event.target.value);
    };

    const handleBuyingFromBattleRunesChange = (event) => {
        setIsBuyingFromBattleRunes(event.target.checked);
    };

    const selectedSpellData = spellBooks[selectedSpellbook][
        selectedCategory
    ].find((spell) => spell.name === selectedSpell);

    // Variable to keep track of the total cost of all runes
    let totalRuneCost = 0;

    return (
        <div className="container mt-5 mb-5">
            <div className="row align-items-start">
                <div
                    id="calc"
                    className="card text-center text-md-start mb-4 rounded-4 border-3">
                    <h2 className="mb-4">OSRS Rune Calculator</h2>
                    <div className="mb-3">
                        <label htmlFor="spellBookSelect" className="form-label">
                            Select Spell Book
                        </label>
                        <select
                            id="spellBookSelect"
                            className="form-select border-3"
                            value={selectedSpellbook}
                            onChange={handleSpellbookChange}>
                            <option value="standard">Standard</option>
                            <option value="ancients">Ancients</option>
                        </select>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="categorySelect" className="form-label">
                            Select Category
                        </label>
                        <select
                            id="categorySelect"
                            className="form-select border-3"
                            value={selectedCategory}
                            onChange={handleCategoryChange}>
                            <option value="combat">Combat</option>
                            <option value="utility">Utility/Teleport</option>
                        </select>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="spellSelect" className="form-label">
                            Select Spell
                        </label>
                        <select
                            id="spellSelect"
                            className="form-select border-3"
                            value={selectedSpell}
                            onChange={handleSpellChange}>
                            <option value="">-- Select a Spell --</option>
                            {spellBooks[selectedSpellbook][
                                selectedCategory
                            ].map((spell) => (
                                <option key={spell.name} value={spell.name}>
                                    {spell.name} (Lvl {spell.level})
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="form-check mb-3 info-anchor">
                        <input
                            className="form-check-input"
                            type="checkbox"
                            id="battleRunesCheck"
                            checked={isBuyingFromBattleRunes}
                            onChange={handleBuyingFromBattleRunesChange}
                        />
                        <label
                            className="form-check-label "
                            htmlFor="battleRunesCheck"
                            style={{ fontSize: "0.9rem" }}>
                            Buying from Battle Runes (post-quest)?
                        </label>
                        <span className="info-text">
                          Battle Runes has a 0.2% change per bought stock compared to the normal 0.1%
                        </span>
                    </div>
                    {selectedSpellData && (
                        <div>
                            <div className="mb-3">
                                <label
                                    htmlFor="quantity"
                                    className="form-label">
                                    Number of Casts
                                </label>
                                <input
                                    type="number"
                                    id="quantity"
                                    className="form-control border-3"
                                    value={spellQuantity}
                                    onChange={handleQuantityChange}
                                    min="0"
                                    step="100"
                                />
                            </div>
                            <h5>Total Runes Needed:</h5>
                            <div className="card-group">
                                {Object.entries(selectedSpellData.runes).map(
                                    ([runeKey, amount]) => {
                                        const runeName =
                                            runeKey.charAt(0).toUpperCase() +
                                            runeKey.slice(1).toLowerCase();
                                        const runeInfo = runes[runeName];
                                        let runePrice = runeInfo.price;
                                        // Determine if we're buying from Battle Runes shop
                                        const maxStock = isBuyingFromBattleRunes
                                            ? runeInfo.maxStockBR !== undefined
                                                ? runeInfo.maxStockBR
                                                : runeInfo.maxStock
                                            : runeInfo.maxStock;

                                        // Determine price increase rate
                                        const priceIncreaseRate =
                                            isBuyingFromBattleRunes
                                                ? 0.002
                                                : 0.001;
                                        // Check if rune packs are available
                                        const isPackAvailable =
                                            runeInfo.pack !== undefined &&
                                            runeInfo.pack > 0;
                                        if (
                                            isPackAvailable &&
                                            spellQuantity * amount >= 100
                                        ) {
                                            runePrice = runeInfo.pack;
                                        }
                                        // Calculate total cost using the updated function
                                        let totalCost;
                                        if (runeInfo.price === "Unbuyable") {
                                            totalCost = "Unbuyable";
                                        } else {
                                            totalCost = calculateDynamicPrice(
                                                runePrice,
                                                amount * spellQuantity,
                                                maxStock,
                                                priceIncreaseRate,
                                                isPackAvailable
                                            );
                                        }

                                        // Accumulate total rune cost
                                        if (typeof totalCost === "number") {
                                            totalRuneCost += totalCost;
                                        }

                                        return (
                                            <div
                                                className="card mt-3 mx-2 rounded-4 p-2 border-3"
                                                key={runeName}>
                                                <img
                                                    id="rune"
                                                    src={`/${runeName}.png`}
                                                    alt={`${runeName} rune`}
                                                />
                                                {runeName}:{" "}
                                                {amount * spellQuantity} <br />
                                                Price:{" "}
                                                {totalCost === "Unbuyable"
                                                    ? "Unbuyable"
                                                    : formatPrice(totalCost)}
                                            </div>
                                        );
                                    }
                                )}
                            </div>
                            <div className="info-anchor">
                              <h5 className="mt-4">
                                Total Cost:{" "}
                                {typeof totalRuneCost === "number"
                                    ? formatPrice(totalRuneCost)
                                    : "Calculation not available"}
                            </h5>
                            <span className="info-text">
                                *All calculations are estimations and rounded up to the nearest thousand
                            </span>
                            </div>

                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

function RuneCalc() {
    return (
        <>
            <RuneCalculator />
        </>
    );
}

export default RuneCalc;
