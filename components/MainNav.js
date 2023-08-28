import { useState } from 'react';
import { Navbar, Nav, Form, NavDropdown, Button, Container } from 'react-bootstrap';
import { useRouter } from 'next/router';
import Link from "next/link";
import { useAtom } from 'jotai';
import { searchHistoryAtom } from '@/store.js';
import { addToHistory } from "@/lib/userData";
import { removeToken, readToken } from "@/lib/authenticate";

export default function MainNav() {
  const [searchHistory, setSearchHistory] = useAtom(searchHistoryAtom);
  const router = useRouter();
  const [searchField, setSearchField] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);

  const handleMouseEnter = (event) => {
    event.target.style.color = "#18BC9C"; // Change the text color to red on hover
  };

  const handleMouseLeave = (event) => {
    event.target.style.color = ""; // Reset the text color when the hover ends
  };

  const handleUserEnter = (event) => {
    event.target.style.backgroundColor = "#2c3e50"; // Change the text color to red on hover
    event.target.style.color = "#FFFFFF";
  };

  const handleUserLeave = (event) => {
    event.target.style.backgroundColor = ""; // Reset the text color when the hover ends
    event.target.style.color = "";
  };

  const submitForm = async (e) => {
    e.preventDefault();
    setIsExpanded(false);
    router.push(`/artwork?title=true&q=${searchField}`);
    setSearchHistory(await addToHistory(`title=true&q=${searchField}`));
  };

  let token = readToken();
  function logout() {
    setIsExpanded(false);
    removeToken();
    router.push("/login");
  }

  return (
    <>
      <Navbar
        className="fixed-top navbar-dark"
        variant="light"
        expand="lg"
        expanded={isExpanded}
        style={{
          backgroundColor: "#2C3E50",
          paddingBottom: "16px",
          paddingTop: "16px",
        }}
      >
        <Container>
          <Navbar.Brand style={{ color: "#FFFFFF" }}>
            Metropolitan Museum App
          </Navbar.Brand>
          <Navbar.Toggle
            aria-controls="navbarScroll"
            onClick={(e) => setIsExpanded(!isExpanded)}
          />
          <Navbar.Collapse id="navbarScroll">
            <Nav className="me-auto">
              <Link href="/" passHref legacyBehavior>
                <Nav.Link
                  onClick={(e) => setIsExpanded(false)}
                  active={router.pathname === "/"}
                  style={{ color: "#18BC9C" }}
                >
                  Home
                </Nav.Link>
              </Link>
              {token && (
                <Link href="/search" passHref legacyBehavior>
                  <Nav.Link
                    onClick={(e) => setIsExpanded(false)}
                    active={router.pathname === "/search"}
                    style={{ color: "#F2FCFF" }}
                  >
                    Advanced Search
                  </Nav.Link>
                </Link>
              )}
            </Nav>
            &nbsp;
            {token && (
              <Form className="d-flex" onSubmit={submitForm}>
                <Form.Control
                  type="search"
                  placeholder="Search"
                  className="me-2"
                  aria-label="Search"
                  onChange={(e) => {
                    setSearchField(e.target.value);
                  }}
                />
                <Button
                  type="submit"
                  variant="success"
                  style={{ background: "#18bc9c", color: "#F2FCFF" }}
                >
                  Search
                </Button>
              </Form>
            )}
            &nbsp;
            {token ? (
              <Nav>
                <NavDropdown
                  title={token.userName}
                  id="basic-nav-dropdown"
                  active={
                    router.pathname === "/favourites" ||
                    router.pathname === "/history"
                  }
                >
                  <Link href="/favourites" passHref legacyBehavior>
                    <NavDropdown.Item
                      onClick={(e) => {
                        setIsExpanded(false);
                      }}
                      active={router.pathname === "/favourites"}
                      onMouseEnter={handleUserEnter}
                      onMouseLeave={handleUserLeave}
                      style={{backgroundColor: 'white', color: '#7B8A8B'}}
                    >
                      Favourites
                    </NavDropdown.Item>
                  </Link>
                  <Link href="/history" passHref legacyBehavior>
                    <NavDropdown.Item
                      onClick={(e) => {
                        setIsExpanded(false);
                      }}
                      active={router.pathname === "/history"}
                      onMouseEnter={handleUserEnter}
                      onMouseLeave={handleUserLeave}
                      style={{backgroundColor: 'white', color: '#7B8A8B'}}
                    >
                      Search History
                    </NavDropdown.Item>
                  </Link>
                  <NavDropdown.Item onClick={logout} onMouseEnter={handleUserEnter}
                      onMouseLeave={handleUserLeave} style={{backgroundColor: 'white', color: '#7B8A8B'}}>Logout</NavDropdown.Item>
                </NavDropdown>
              </Nav>
            ) : (
              <Nav className="ms-auto">
                <Link href="/register" passHref legacyBehavior>
                  <Nav.Link
                    onClick={(e) => setIsExpanded(false)}
                    active={router.pathname === "/register"}
                    style={{ color: "#FFFFFF" }}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                  >
                    Register
                  </Nav.Link>
                </Link>
                <Link href="/login" passHref legacyBehavior>
                  <Nav.Link
                    onClick={(e) => {
                      setIsExpanded(false);
                    }}
                    active={router.pathname === "/login"}
                    style={{ color: "#FFFFFF" }}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                  >
                    Login
                  </Nav.Link>
                </Link>
              </Nav>
            )}
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <br /><br /><br />
    </>
  );
}
