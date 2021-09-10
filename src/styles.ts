import styled, { createGlobalStyle } from "styled-components";

export const StyledAppContainer = styled.div`
  width: 100%;
  height: 100%;
  background-color: #121212;
`;

export const GlobalStyles = createGlobalStyle`
    html, body, #root {
        height: 100%;
    }

    body {
        margin: 0;
    }
`;
