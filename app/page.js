"use client";

import { currencyFormater } from '@/app/lib/utils';
import ExpenseItem from './Components/ExpenseItem';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { useState, useContext, useEffect } from 'react';

import {financeContext} from '@/app/lib/store/finance-context';
import { authContext } from './lib/store/auth-context';

import  AddIncomeModal  from './Components/Modals/AddIncomeModal';
import AddExpensesModal from './Components/Modals/AddExpensesModal';

import SignIn from './Components/SignIn';



ChartJS.register(ArcElement, Tooltip, Legend);






export default function Home() {


  const [showIncomeModal, setShowIncomeModal] = useState(false);
  const [showExpensesModal, setShowExpensesModal] = useState(false);
  const [balance, setBalance] = useState(0);

  const { expenses, income } = useContext(financeContext);
  const { user, loading} = useContext(authContext);
   
  useEffect(() => {
    const newBalance = income.reduce((total, i) => {
      return total + i.amount
    }, 0) - 
    expenses.reduce((total, e) => {
      return total + e.total
    }, 0);

    setBalance(newBalance);

  }, [expenses,income])

  if(!user){
    return <SignIn />
  }

  return (
 <>
   {/*Income Modal*/}
   <AddIncomeModal show={showIncomeModal} onClose={setShowIncomeModal}/>
   {/*Income Modal*/}

   {/*Expenses Modal*/}
    <AddExpensesModal show={showExpensesModal} onClose={setShowExpensesModal}></AddExpensesModal>
   {/*Expenses Modal*/}
    <main className="container max-w-2xl px-6 mx-auto">
       <section className="py-3">
        <small className="text-slate-300 text-md">My Balance</small>
        <h2 className="text-4xl text-bold">{ currencyFormater(balance) }</h2>
       </section>
       <section className="flex items-center gap-2 py-3">
         <button onClick={() => {setShowExpensesModal(true)}} className="btn btn-primary">+ Expenses</button>
         <button onClick={() => {setShowIncomeModal(true)}} className="btn btn-primary-outline">+ Income</button>
       </section>
 
       {/*Expenses*/}
       <section className="py-6">
        <h3 className="text-2xl">My Expenses</h3>
        <div className='flex flex-col gap-4 mt-6'>
         {expenses.map((expense) =>  {
           return (
             <ExpenseItem 
              key={expense.id}
              expense={expense}
             /> 
           )  
           
         })}
        
        </div>
       </section>
 
       {/*Chart Section*/}
        <section className="py-6">
          <h3 className="text-2xl">Stats</h3>
          <div className='w-1/2 mx-auto'>
           <Doughnut data={{
             labels: expenses.map(expense => expense.title),
             datasets: [{
               label: "Expenses",
               data: expenses.map(expense => expense.total),
               backgroundColor: expenses.map(expense => expense.color),
               borderColor: ['#18181b'],
               borderWidth: 3,
             }]
           }}/>
          </div>
        </section>
     </main>  
  </>   
  );
}
