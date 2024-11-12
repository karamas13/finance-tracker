
export default function Home() {
  return (
   <main className="container max-w-2xl px-6 mx-auto">
      <section className="py-3">
       <small className="text-slate-300 text-md">My Balance</small>
       <h2 className="text-4xl text-bold">$10000</h2>
      </section>
      <section className="flex items-center gap-2 py-3">
        <button className="btn btn-primary">+ Expenses</button>
        <button className="btn btn-primary-outline">+ Income</button>
      </section>
    </main>    
  );
}
