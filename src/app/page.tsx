'use client';

import Crytpo24hChart from '../components/crypto24hChart';

export default function Home() {
  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <div className="flex gap-4 items-center flex-row sm:flex-row">
          <h1>BTC</h1>
          <h2 className="h1">price</h2>
        </div>
        <section style={{ marginTop: 32 }}>
          <Crytpo24hChart />
        </section>
      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center"></footer>
    </div>
  );
}
