import { Nav, NavDropdown } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/router";

interface CurrentUserProps {
  currentUser: {
    fullName: string;
    isAdmin: boolean;
  }
}

const CurrentUser = ({ currentUser }: CurrentUserProps) => {
  const isAdmin = currentUser?.isAdmin

  const router = useRouter();

  const pathname = router?.pathname || ''


  const onSelect = (uri: string) => {
    switch (uri) {
      case 'signout':
        return router.push('/auth/signout');
      default:
        router.push(`/${uri}`);
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
              <FontAwesomeIcon icon={faUser} className="mr-2" />
              {currentUser.fullName}
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