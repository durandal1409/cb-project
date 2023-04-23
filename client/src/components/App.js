import styled from "styled-components";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import GlobalStyles from "./GlobalStyles";
import Header from "./Header/Header";
import Footer from "./Footer";
import Home from "./Home";
import Search from "./Search/Search";
import Item from "./Item/Item";
import Profile from "./Profile/Profile";
import CreateAd from "./CreateAd/CreateAd";

const App = () => {
  return (
    <BrowserRouter>
            <GlobalStyles />
            <Header />
            <Wrapper>
              <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/search/*" element={<Search />} />
                  <Route path="/item/:itemId" element={<Item />} />
                  <Route path="/user/:userId" element={<Profile />} />
                  <Route path="/user/favourites/:userId" element={<Profile favourites={true}/>} />
                  <Route path="/create-ad" element={<CreateAd />} />
                  <Route path="" element={<h1>404: Oops!</h1>} />
              </Routes>
            </Wrapper>
            <Footer />
    </BrowserRouter>
  );
}

const Wrapper = styled.div`
  background-color: var(--color-background);
`

export default App;
