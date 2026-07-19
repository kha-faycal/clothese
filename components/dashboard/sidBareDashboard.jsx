"use client"

import { useState } from "react";
import CategoriesManager from "@components/dashboard/CategoriesManager";
import UsersManager from "@components/dashboard/UsersManager";
import ProductsManager from "@components/dashboard/ProductsManager";
import OrdersManager from "@components/dashboard/OrdersManager";
import Statistics from "@components/dashboard/Statistics";

export default function SidBareDashboard() {
  const [active, setActive] = useState("Statistics");

  const componetRnder = () => {
    switch (active) {
      case "Statistics":
        return <Statistics/>;
      case "category":
        return <CategoriesManager />;
      case "Users":
        return <UsersManager />;
      case "products":
        return <ProductsManager />;
      case "Orders":
        return <OrdersManager/>;
    }
  };

  return (
    <div className="flex min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      
      {/* Sidebar */}
      <aside className="w-56 bg-[var(--border)] flex flex-col py-6 shadow-lg">
        <h1 className="text-lg font-bold text-center text-[var(--secondary)] mb-6">
          Welcome to the Dashboard
        </h1>
        <nav className="flex flex-col gap-3 px-4">
          {["Statistics", "category", "products", "Orders", "Users"].map((item) => (
            <button
              key={item}
              onClick={() => setActive(item)}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                active === item
                  ? "bg-[var(--primary)] text-[var(--text)]"
                  : "bg-[var(--background)] text-[var(--foreground)] hover:bg-[var(--primary)]/20"
              }`}
            >
              {item}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-6">{componetRnder()}</main>
    </div>
  );
}
