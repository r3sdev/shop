import { Nav, NavDropdown } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/router";
import { CurrentUserProps } from "../types";


const CurrentUser = ({ currentUser }: CurrentUserProps) => {
  const isAdmin = currentUser?.isAdmin

  const router = useRouter();

  const pathname = router?.pathname || ''


  const onSelect = (uri: any) => {
    switch (uri) {
      case 'signout':
        return router.push('/auth/signout');
      default:
        return router.push(`/${uri}`);
    }
  }

  if (!currentUser) return null;

  return (
    <Nav>
      {
        currentUser
        && (
          <NavDropdown title={
            <>
              <span className="mr-1">of</span>
              <span>{currentUser.fullName}</span>
            </>
          }
            id="collasible-nav-dropdown2"
            onSelect={onSelect}
          >
            <NavDropdown.Item
              eventKey="profile"
              active={pathname.includes('profile')}
            >
              Profile
            </NavDropdown.Item>
            {
              isAdmin && (
                <>
                  <NavDropdown.Item
                    eventKey="admin"
                    active={pathname.includes('admin')}
                  >
                    Admin
                  </NavDropdown.Item>
                  <NavDropdown.Divider />
                </>
              )
            }
            <NavDropdown.Item eventKey="signout">
              Sign out
            </NavDropdown.Item>
          </NavDropdown>
        )
      }
    </Nav>
  )
}

export default CurrentUser;