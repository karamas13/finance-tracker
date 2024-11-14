"use client";

import { currencyFormater } from '@/app/lib/utils';
import ExpenseItem from './Components/ExpenseItem';
import Modal from './Components/Modal';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { useState, useRef, useEffect } from 'react';

//Firebase Imports
import { db } from './lib/firebase';
import { collection, addDoc, getDocs, doc, deleteDoc } from 'firebase/firestore';

//Icon Imports
import { FaRegTrashAlt } from 'react-icons/fa';

ChartJS.register(ArcElement, Tooltip, Legend);

const DEMO_DATA = [
  {
    id: 1,
    title: "Entertainment",
    color: "#000",
    total: 500
  },
  {
    id: 2,
    title: "Fuel",
    color: "#f1f1f1",
    total: 1500
  },
  {
    id: 3,
    title: "Utilities",
    color: "#333",
    total: 3500
  },
  {
    id: 4,
    title: "Movies",
    color: "#009",
    total: 50
  },
]

export default function Home() {
  
  const [income, setIncome] = useState([]);
  const [showIncomeModal, setshowIncomeModal] = useState(false);
  const [showExpenseModal, setshowExpenseModal] = useState(false);
  const amountRef = useRef();
  const descriptionRef = useRef();
  console.log(income);

  //Handler Functions
    
    const addIncomeHandler = async (e) => {
      e.preventDefault();

      const newIncome ={
        amount: amountRef.current.value,
        description: descriptionRef.current.value,
        createdAt: new Date(),
      }

      const collectionRef = collection(db, 'income') 
      
      try{
        const docSnap = await addDoc(collectionRef, newIncome)

        //update State
        setIncome(prevState => {
         return [
            ...prevState,
            {
              id: docSnap.id,
              ...newIncome
            }
          ]
        });
         
        descriptionRef.current.value ="";       
        amountRef.current.value = "";   
      } catch (error) {
        console.log(error.message);
      }
           

    };

    const deleteIncomeEntryHandler = async (incomeId) => {
        const docRef = doc(db, 'income', incomeId)
        
        try{
          await deleteDoc(docRef);

          //Update State
          setIncome((prevState) => {
            return prevState.filter((i) => i.id !== incomeId)
          });
        } catch (error) {
          console.log(error.message)
        }
        
    } 

    //Handler Functions

    useEffect(() => {
      const getIncomeData = async () => {
        const collectionRef = collection(db, 'income')
        const docsSnap = await getDocs(collectionRef)

        const data = docsSnap.docs.map(doc => {
          return{
            id: doc.id,
            ...doc.data(),
            createdAt: new Date(doc.data().createdAt.toMillis())
          }            
          
        })

        setIncome(data)
      }

      getIncomeData();

    },[])

   

  return (
 <>
   {/*Income Modal*/}
    <Modal show={showIncomeModal} onClose={setshowIncomeModal} className="">
      <form onSubmit={addIncomeHandler} className='flex flex-col gap-4 '>
       <div className="input-group ">
        <label htmlFor="amount">Income Amount</label>
        <input  
         type="number"
         name="amount"
         ref={amountRef} 
         min={0.01} 
         step={0.01} 
         placeholder='Enter Income Amount' 
         required
        />
       </div>
       
       <div className="input-group">
        <label htmlFor="description">Description</label>
        <input  
         type="text"
         name='description' 
         ref={descriptionRef}        
         placeholder='Enter Income Description' 
         required
        />
       </div>

       <button className="btn btn-primary py-6"type="submit">Add Entry</button>
      </form>
      <div className="flex flex-col gap-4 mt-6 ">
        <h3 className="text-2xl font-bold">Income History</h3>

        {income.map((i) => {
          return (
            <div className="flex items-center py-2 justify-between" key={i.id} > 
              <div>
                <p className="font-semibold">{i.description}</p>
                <small className='text-xs'>{i.createdAt.toISOString()}</small>
              </div>
               <div className="flex items-center gap-4">
                <p className='flex items-center'> {currencyFormater(i.amount)}</p>               
                <button className='hover:text-red-600 ease-in-out duration-700 text-xl' onClick={() => { deleteIncomeEntryHandler(i.id) }}>
                 <FaRegTrashAlt/>
                </button>
               </div>
            </div>
          )
        })}
      </div>
    </Modal>
   {/*Income Modal*/}
   {/*Expenses Modal*/}
    <Modal show={showExpenseModal} onClose={setshowExpenseModal}>
      <h3>Expenses</h3>
    </Modal>
   {/*Expenses Modal*/}
    <main className="container max-w-2xl px-6 mx-auto">
       <section className="py-3">
        <small className="text-slate-300 text-md">My Balance</small>
        <h2 className="text-4xl text-bold">{ currencyFormater(100000) }</h2>
       </section>
       <section className="flex items-center gap-2 py-3">
         <button onClick={() => {setshowExpenseModal(true)}} className="btn btn-primary">+ Expenses</button>
         <button onClick={() => {setshowIncomeModal(true)}} className="btn btn-primary-outline">+ Income</button>
       </section>
 
       {/*Expenses*/}
       <section className="py-6">
        <h3 className="text-2xl">My Expenses</h3>
        <div className='flex flex-col gap-4 mt-6'>
         {DEMO_DATA.map(expense =>  {
           return (
             <ExpenseItem 
              key={expense.id}
              color={expense.color} 
              title={expense.title} 
              total={expense.total}
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
             labels: DEMO_DATA.map(expense => expense.title),
             datasets: [{
               label: "Expenses",
               data: DEMO_DATA.map(expense => expense.total),
               backgroundColor: DEMO_DATA.map(expense => expense.color),
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
