import { Nav, NavDropdown } from "react-bootstrap";
import { useRouter } from "next/router";
import { CurrentUserProps } from "../types";
import styled from 'styled-components';

const Textspan = styled.span`
  color: #4c8c35;
`

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
              <Textspan className="mr-1">of</Textspan>
              <Textspan>{currentUser.fullName}</Textspan>
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