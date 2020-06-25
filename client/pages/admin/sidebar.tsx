import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTachometerAlt, faUser, faTasks, faCalendar, faEnvelope, faQuestion, 
  faAngleDoubleLeft, faCaretDown, faShoppingCart
} from '@fortawesome/free-solid-svg-icons';

const AdminSidebar = () => {
  return (
    <div id="sidebar-container" className="sidebar-expanded d-none d-md-block col-2" style={{ zIndex: -1 }}>
      <ul className="list-group sticky-top sticky-offset">
        <li className="list-group-item sidebar-separator-title text-muted d-flex align-items-center menu-collapsed">
          <small>MAIN MENU</small>
        </li>
        <a href="#submenu1" data-toggle="collapse" aria-expanded="false" className="bg-dark list-group-item list-group-item-action flex-column align-items-start">
          <div className="d-flex w-100 justify-content-start align-items-center">
            <FontAwesomeIcon icon={faTachometerAlt} fixedWidth={true} className="mr-3" />
            <span className="menu-collapsed">Dashboard</span>
            <FontAwesomeIcon icon={faCaretDown} fixedWidth={true} className="ml-auto" />
          </div>
        </a>
        <div id="submenu1" className="collapse sidebar-submenu">
          <a href="#" className="list-group-item list-group-item-action bg-dark text-white">
            <span className="menu-collapsed">Charts</span>
          </a>
          <a href="#" className="list-group-item list-group-item-action bg-dark text-white">
            <span className="menu-collapsed">Reports</span>
          </a>
          <a href="#" className="list-group-item list-group-item-action bg-dark text-white">
            <span className="menu-collapsed">Tables</span>
          </a>
        </div>
        <a href="#submenu2" data-toggle="collapse" aria-expanded="false" className="bg-dark list-group-item list-group-item-action flex-column align-items-start">
          <div className="d-flex w-100 justify-content-start align-items-center">
            <FontAwesomeIcon icon={faUser} fixedWidth={true} className="mr-3" />
            <span className="menu-collapsed">Profile</span>
            <FontAwesomeIcon icon={faCaretDown} fixedWidth={true} className="ml-auto" />
          </div>
        </a>
        <div id="submenu2" className="collapse sidebar-submenu">
          <a href="#" className="list-group-item list-group-item-action bg-dark text-white">
            <span className="menu-collapsed">Settings</span>
          </a>
          <a href="#" className="list-group-item list-group-item-action bg-dark text-white">
            <span className="menu-collapsed">Password</span>
          </a>
        </div>
        <a href="#" className="bg-dark list-group-item list-group-item-action">
          <div className="d-flex w-100 justify-content-start align-items-center">
            <FontAwesomeIcon icon={faTasks} fixedWidth={true} className="mr-3" />
            <span className="menu-collapsed">Tasks</span>
          </div>
        </a>
        <li className="list-group-item sidebar-separator-title text-muted d-flex align-items-center menu-collapsed">
          <small>OPTIONS</small>
        </li>
        <a href="#" className="bg-dark list-group-item list-group-item-action">
          <div className="d-flex w-100 justify-content-start align-items-center">
            <FontAwesomeIcon icon={faCalendar} fixedWidth={true} className="mr-3" />
            <span className="menu-collapsed">Calendar</span>
          </div>
        </a>
        <a href="#" className="bg-dark list-group-item list-group-item-action">
          <div className="d-flex w-100 justify-content-start align-items-center">
            <FontAwesomeIcon icon={faEnvelope} fixedWidth={true} className="mr-3" />
            <span className="menu-collapsed">Messages <span className="badge badge-pill badge-primary ml-2">5</span></span>
          </div>
        </a>
        <li className="list-group-item sidebar-separator menu-collapsed"></li>
        <a href="#" className="bg-dark list-group-item list-group-item-action">
          <div className="d-flex w-100 justify-content-start align-items-center">
            <FontAwesomeIcon icon={faQuestion} fixedWidth={true} className="mr-3" />

            <span className="menu-collapsed">Help</span>
          </div>
        </a>
        <a href="#" data-toggle="sidebar-colapse" className="bg-dark list-group-item list-group-item-action d-flex align-items-center">
          <div className="d-flex w-100 justify-content-start align-items-center">
            <FontAwesomeIcon icon={faAngleDoubleLeft} fixedWidth={true} className="mr-3" />
            <span id="collapse-text" className="menu-collapsed">Collapse</span>
          </div>
        </a>
        <li className="list-group-item logo-separator d-flex justify-content-center">
          <FontAwesomeIcon
            icon={faShoppingCart}
            color="#808080"
            style={{height: 30, width: 30}}
          />
        </li>
      </ul>
    </div>
  )
}

export default AdminSidebar