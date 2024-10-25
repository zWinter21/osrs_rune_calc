import "./Nav.css";
function Navbar() {
  return (
      <nav
          id="nav"
          className="navbar navbar-expand-lg navbar-dark fixed-top px-4">
          <a className="navbar-brand">
              <img
                  src={"/Fire.png"}
                  alt="Logo"
                  width="30"
                  height="30"
                  className="d-inline-block align-top me-2"
              />
              OSRS Rune Buying Calculator
          </a>
      </nav>
  );
}

export default Navbar;
