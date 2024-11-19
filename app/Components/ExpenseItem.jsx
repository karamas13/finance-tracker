import React from 'react';
import {currencyFormater} from '@/app/lib/utils';
import { useState } from 'react';
import ViewExpenseModal from './Modals/ViewExpenseModal';

function ExpenseItem({expense}) {
  const [showViewExpenseModal, setViewExpenseModal] = useState(false)
  
  return (
  <>
   <ViewExpenseModal show={showViewExpenseModal} onClose={setViewExpenseModal} expense={expense}/>
    <button onClick={() =>{setViewExpenseModal(true)}}> 
      <div className='flex items-center justify-between px-4 py-4 bg-slate-700 rounded-3xl'>
      <div className="flex items-center gap-2">
       <div className='w-[25px] h-[25px] rounded-full' style={{backgroundColor: expense.color}}/>
       <h4 className='capitalize'>{expense.title}</h4>
      </div>
      <p>{currencyFormater(expense.total)}</p>          
     </div>
    </button>
  </>
  )
}

export default ExpenseItem;