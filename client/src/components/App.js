import styled from "styled-components";
import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import GlobalStyles from "./GlobalStyles";
import Header from "./Header";
import Footer from "./Footer";
import Home from "./Home";
import Search from "./Search";
import Item from "./Item";
import Profile from "./Profile";
import CreateAd from "./CreateAd";

const App = () => {
  return (
    <BrowserRouter>
            <GlobalStyles />
            <Header />
            <Wrapper>
              <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/search" element={<Search />} />
                  <Route path="/item/:itemId" element={<Item />} />
                  <Route path="/profile/:userId" element={<Profile />} />
                  <Route path="/post-ad" element={<CreateAd />} />
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
