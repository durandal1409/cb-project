import styled from "styled-components";

const CreateAd = () => {

    const handleFormSubmit = () => {

    }
    return (
        <Form onSubmit={handleFormSubmit}>
            
        </Form>
    )
}
const Form = styled.form`
    width: var(--content-width);
    margin: 0 auto;
    padding-top: 30px;
    display: flex;
    flex-direction: column;
`

export default CreateAd;