import styled from "styled-components";
import Button from "./Button";

// form for sending a messge to a seller
const ContactForm = ({sellerName,handleMessage}) => {
    return (
        <Form onSubmit={handleMessage}>
            <h3>Contact {sellerName}:</h3>
            <textarea type="text" rows="7" maxLength="500" placeholder="Write a message..." />
            <Button width={"100%"} type={"submit"}>Send message</Button>
        </Form>
    )
}
const Form = styled.form`
    width: 100%;
    textarea {
        display: block;
        margin-bottom: 10px;
        width: calc(100% - 6px);
    }
    
`

export default ContactForm;