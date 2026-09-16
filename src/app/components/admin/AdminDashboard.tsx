"use client";

import { useState } from "react";
import CardsTable, { AdminCardRow } from "./CardsTable";
import NewCardModal from "./NewCardModal";

interface AdminDashboardProps {
  cards: AdminCardRow[];
}

export default function AdminDashboard({ cards }: AdminDashboardProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalKey, setModalKey] = useState(0);

  function openModal() {
    setModalKey((k) => k + 1); // forces NewCardModal to remount, giving it a fresh passcode
    setModalOpen(true);
  }

  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-3xl text-[#23262B]">Cards</h1>
        <button
          type="button"
          onClick={openModal}
          className="rounded-md bg-[#23262B] px-4 py-2 text-sm text-white transition-colors hover:bg-[#3A3D42]"
        >
          New card
        </button>
      </div>

      <div className="mt-8">
        <CardsTable cards={cards} />
      </div>

      {modalOpen && (
        <NewCardModal key={modalKey} onClose={() => setModalOpen(false)} />
      )}
    </>
  );
}
