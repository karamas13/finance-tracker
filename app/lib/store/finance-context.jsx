"use client"

import { createContext, useState, useEffect, useContext } from "react";

import { authContext } from "./auth-context";

//Firebase Imports
import { db } from '../../lib/firebase/index';
import { collection, addDoc, getDocs, doc, deleteDoc, updateDoc, query, where } from 'firebase/firestore';


export const financeContext = createContext ({
  income: [],
  expenses: [],
  addIncomeItem: async () => {},
  removeIncomeItem: async () => {},
  addExpenseItemItem: async () => {},
  addCategory: async () => {},
  deleteExpenseItem: async () => {},
  deleteExpenseCategory: async () => {},
});

export default function FinanceContextProvider({children}) {
    const [income, setIncome] = useState([]);
    const [expenses, setExpenses] = useState([]);

    const { user } = useContext(authContext);

    const addCategory = async (category) => {
      try {
      const collectionRef = collection(db, 'expenses') 
      
      const docSnap = await addDoc(collectionRef, {
        
        uid: user.uid,
        ...category,
        items: [],
      }) 
      
      setExpenses(prevExpenses => {
         return [
           ...prevExpenses,
           {
            id: docSnap.id,
            uid: user.uid,
            items:[],
            ...category
           }
         ]
      })
     } catch (error) {
      throw error;
     }
    }

    const addExpenseItem = async (expenseCategoryId, newExpense) => { 
       const docRef = doc(db, "expenses", expenseCategoryId) 
       
       try{
        await updateDoc(docRef, {...newExpense})

        //Update State
        setExpenses(prevState => {
          const updatedExpenses = [...prevState]

          const foundIndex = updatedExpenses.findIndex(expense => {
            return  expense.id === expenseCategoryId
          })

          updatedExpenses[foundIndex] = {id: expenseCategoryId, ...newExpense}

          return updatedExpenses;
        })
       } catch(error) {
        throw error;        
       }
       
     }

     const deleteExpenseItem = async (updatedExpense, expenseCategoryId) => {
      try {
       const docRef = doc(db, "expenses", expenseCategoryId)
       await updateDoc(docRef, {
        ...updatedExpense,
      })

      setExpenses(prevExpenses => {
        const updatedExpenses = [...prevExpenses ];
        const pos = updatedExpenses.findIndex((ex) => ex.id === expenseCategoryId)    
        updatedExpenses[pos].items = [...updatedExpense.items];    
        updatedExpenses[pos].total = updatedExpense.total;  
        
        return updatedExpenses;
      })

      } catch(error) {
        throw error
      }
     }

     const deleteExpenseCategory = async (expenseCategoryId) => {
      try{
       const docRef = doc(db, "expenses", expenseCategoryId);
       await deleteDoc(docRef)

       setExpenses(prevExpenses => {
        const updatedExpenses = prevExpenses.filter(
          (expense) => expense.id !== expenseCategoryId
        )

        return [...updatedExpenses];
       })
      } catch (error){

      }
     }
    
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
        
      if (!user) return;

      const getIncomeData = async () => {
          const collectionRef = collection(db, 'income')

          const que = query(collectionRef, where("uid", "==", user.uid))
          const docsSnap = await getDocs(que);
    
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

          const que = query(collectionRef, where("uid", "==", user.uid))
          const docsSnap = await getDocs(que)

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
    
      },[user])


    const values = { income, expenses, addIncomeItem, removeIncomeItem, addExpenseItem, addCategory, deleteExpenseItem, deleteExpenseCategory};

   return <financeContext.Provider value={values}>
        {children}
    </financeContext.Provider>
}