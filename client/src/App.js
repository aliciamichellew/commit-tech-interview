import logo from "./logo.svg";
import "./App.css";
import Landing from "./components/auth/LoginPage";
import Login from "./components/auth/LoginPage";

export const UserContext = createContext();

function App() {
  const init = localStorage.getItem("userInfo") || null;
  const [userInfo, setUserInfo] = useState(init ? JSON.parse(init) : null);

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));

    if (userInfo) {
      setAuthToken(userInfo.token);
    }
  }, [localStorage.getItem("userInfo")]);

  return (
    <ThemeProvider theme={theme}>
      <UserContext.Provider value={{ userInfo, setUserInfo }}>
        <Routes>
          <Route exact path="/" element={<Landing />} />
          {/* <Route path="/home" element={<Home />} /> */}
          <Route path="/login" element={<Login />} />
          {/* <Route path="/signup" element={<SignUp />} /> */}
        </Routes>
      </UserContext.Provider>
    </ThemeProvider>
  );
}

export default App;
