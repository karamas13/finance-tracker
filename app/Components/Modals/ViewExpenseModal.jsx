import { useContext } from 'react'
import { financeContext } from '@/app/lib/store/finance-context'
import Modal from '@/app/Components/Modal'
import { currencyFormater } from '@/app/lib/utils'

import { FaRegTrashAlt } from 'react-icons/fa'

import { toast } from 'react-toastify'

function ViewExpenseModal({show, onClose, expense}) {
    const { deleteExpenseItem, deleteExpenseCategory } = useContext(financeContext);
  
    const deleteExpenseHandler = async () => {
        try {
          await deleteExpenseCategory(expense.id)
          toast.success("Expense Category removed")
        } catch(error) {
          console.log(error.message);
          toast.error(error.message);
        }
    }

    const deleteExpenseItemHandler = async (item) => {
        try {
           //Item Removal
           const updatedItems = expense.items.filter((i) => i.id !== item.id)  
           toast.success("Expense Item remove succesfully")

           //Update Expense Balance
           const updatedExpense = {
            items:[...updatedItems],
            total: expense.total - item.amount, 
           };

           await deleteExpenseItem(updatedExpense, expense.id) 
        } catch (error) {
            console.log(error)
            toast.error(error.message);
        }
    }
  
    return (
    <Modal show={show} onClose={onClose}>
      <div className="flex items-center justify-between">
        <h2 className="text=4xl">{expense.title}</h2>
        <button onClick={deleteExpenseHandler} className="btn btn-danger">Delete</button>
      </div>

      <div >
        <h3 className="text-2xl my-4 ">Expense History</h3>
        {expense.items.map((item) => {
            return (
                <div className="flex items-center justify-between py-1" key={item.id}>
                  <small>{item.createdAt.toMillis ?
                    new Date(item.createdAt.toMillis()).toISOString() :
                    item.createdAt.toISOString()
                    }</small>
                    <p className="flex items-center gap-2">
                        {currencyFormater(item.amount)}
                        <button onClick={() => {
                            deleteExpenseItemHandler(item);
                        }}>
                            <FaRegTrashAlt className='hover:text-red-600 ease-in-out duration-700 text-xl'/>
                        </button>
                    </p>
                </div>   
            )
        })}
      </div>
    </Modal>
  )
}

export default ViewExpenseModal