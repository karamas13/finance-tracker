import { useRef, useEffect, useContext } from "react"
import { currencyFormater } from "@/app/lib/utils";

import {financeContext} from '@/app/lib/store/finance-context';
import { authContext } from "@/app/lib/store/auth-context";

import Modal from '../Modal';

//Icon Imports
import { FaRegTrashAlt } from 'react-icons/fa';

import { toast } from "react-toastify";




function AddIncomeModal({show,onClose}) {
    const amountRef =useRef();
    const descriptionRef =useRef();
    const { income, addIncomeItem, removeIncomeItem } = useContext(financeContext);
    const { user } = useContext(authContext);

 //Handler Functions Start
    
  const addIncomeHandler = async (e) => {
    e.preventDefault();

    const newIncome ={
      amount: +amountRef.current.value,
      description: descriptionRef.current.value,
      createdAt: new Date(),
      uid: user.uid,
    }
    
    try{
     await addIncomeItem(newIncome);
     descriptionRef.current.value ="";       
     amountRef.current.value = "";
     toast.success("Income added successfully")          
    } catch (error) {
        console.log(error.message);
        toast.error(error.message);
    }
    

    
  };

  const deleteIncomeEntryHandler = async (incomeId) => {    
    try{
        await removeIncomeItem(incomeId);  
        toast.success("Income deleted")                          
       } catch (error) {
           console.log(error.message);
           toast.error(error.message);
       }
  }

  //Handler Functions End
   
    return (
    <Modal show={show} onClose={onClose} onclassName="">
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
  )
}

export default AddIncomeModal