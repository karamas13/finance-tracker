"use client"

import { createContext, useState, useEffect } from "react";

//Firebase Imports
import { db } from '../../lib/firebase/index';
import { collection, addDoc, getDocs, doc, deleteDoc } from 'firebase/firestore';

export const financeContext = createContext ({
  income: [],
  expenses: [],
  addIncomeItem: async () => {},
  removeIncomeItem: async () => {},
});

export default function FinanceContextProvider({children}) {
    const [income, setIncome] = useState([]);
    const [expenses, setExpenses] = useState([]);
    
    const addIncomeItem = async (newIncome) => { 
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
           
      
        } catch (error) {
          console.log(error.message);
          throw error;
        }
     }

    const removeIncomeItem = async (incomeId) => { 
        const docRef = doc(db, 'income', incomeId)
      
        try{
          await deleteDoc(docRef);
  
          //Update State
          setIncome((prevState) => {
            return prevState.filter((i) => i.id !== incomeId)
          });
        } catch (error) {
          console.log(error.message)
          throw error
        }
        
     }

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
        };

        const getExpensesData = async () => {
          const collectionRef = collection(db, 'expenses')
          const docsSnap = await getDocs(collectionRef)

          const data = docsSnap.docs.map(doc => {
            return{
              id: doc.id,
              ...doc.data(),
              createdAt: new Date(doc.data().createdAt)
            }            
            
          })
          setExpenses(data)
        }
    
        getIncomeData();
        getExpensesData();
    
      },[])


    const values = { income, expenses, addIncomeItem, removeIncomeItem};

   return <financeContext.Provider value={values}>
        {children}
    </financeContext.Provider>
}