import {ImStatsBars} from "react-icons/im"

function Navigation() {
  return (
    
    <header className="container max-w-2xl px-6 py-6 mx-auto">
     <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
       <div className="h-[40px] w-[40px] rounded-full overflow-hidden">
        <img className="h-full w-full object-cover" src="https://thispersondoesnotexist.com/"  alt="Profile Picture"/> 
       </div>
       <small>Hi, User!</small>
      </div>

      {/*Right Side Navigation*/}
       <nav className="flex items-center gap-4">
        <div>
          <ImStatsBars className="text-2xl "/>
        </div>
        <div><button className="btn btn-danger">Logout</button></div>
       </nav>
     </div>
   </header>
  )
}

export default Navigation;