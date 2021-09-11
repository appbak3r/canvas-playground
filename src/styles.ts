import styled, { createGlobalStyle } from "styled-components";

export const StyledAppContainer = styled.div`
  width: 100%;
  height: 100%;
`;

export const GlobalStyles = createGlobalStyle`
    html, body, #root {
        height: 100%;
    }

    body {
        margin: 0;
        background-color: #121212;
    }
`;

export const StyledButton = styled.button`
  font-size: 1.5rem;
  color: #121212;
  border-radius: 50%;
  border: 0;
  background-color: white;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  cursor: pointer;
`;

export const StyledText = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  color: white;
  font-size: 3rem;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
  text-align: center;
  padding: 15px;
`;

export const StyledToolbar = styled.nav`
  position: absolute;
  top: 0;
  left: 0;
  padding: 15px;
  display: grid;
  gap: 15px;
`;
