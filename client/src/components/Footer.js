import styled from "styled-components";

const Footer = () => {
    return (
        <FooterDiv>
            <h2> 
                Made by <a href="https://github.com/durandal1409" target="_blank">Maria Kladova</a>.
            </h2>
        </FooterDiv>
    )
}

const FooterDiv = styled.div`
    position: relative;
    bottom: 0;
    width: 100%;
    text-align: center;
    padding: 20px 0;
    h2 {
        color: var(--color-button);
        a {
            color: var(--color-button);
        }
    }
`

export default Footer;