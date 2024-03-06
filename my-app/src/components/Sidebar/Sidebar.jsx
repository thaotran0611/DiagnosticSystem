import './Sidebar.css';
import {SidebarData} from './SidebarData.js'

function SideBar(){
  return <div id='sidebar'> <ul class ="SidebarList">
    {SidebarData.map((val,key) => {
      return (
        <li key={key} class="row" onClick={()=> {window.location.pathname = val.link}}> 
          {" "}
          <div id="icon"> {val.icon}</div> {" "}
          <div id="title"> 
            {val.title}
          </div>
        </li>
        );
    })}
    </ul>
  </div>;
}
export default SideBar;