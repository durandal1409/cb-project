import styled from "styled-components";
import { useState } from "react";
import { useAuth0 } from '@auth0/auth0-react';
import { useNavigate } from "react-router-dom";

import PicsUpload from "./PicsUpload";
import Categories from "./Categories";
import Button from "../shared/Button";


// this is a component for creating and updating ad
const CreateAd = ({adData, handleAfterUpdate}) => {
    const { user } = useAuth0();
    const navigate = useNavigate();
    // if adData props was passed then it's update ad form
    // and we fill it with current ad data
    // otherwise only fill it with initial values
    const initialValuesObj = {
        name: '', 
        description: '', 
        address: '', 
        price: 0, 
        pics: [], 
        categories: ['']
    }
    const [formData, setFormData] = useState(adData ? adData : initialValuesObj);

    const handleChange = (key, value) => {
        setFormData({
            ...formData,
            [key]: value
        })
    }

    const handleFormSubmit = (e, formData) => {
        e.preventDefault();
        // if adData props was passed then we need to update form with patch request
        // otherwise we are creating new ad and need to post
        const methodName = adData ? "PATCH" : "POST";
        fetch("/api/ads", {
            method: methodName,
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                userId: user.sub,
                ...formData
            })
        })
            .then(res => res.json())
            .then(data => {
                if (data.status === 201 || data.status === 200) {
                    window.alert(data.message);
                    navigate("/user/me");
                    // if updating ad then need to call handler in Profile after successful update
                    handleAfterUpdate && handleAfterUpdate(data.data);
                } else {
                    window.alert(data.message)
                }
            })
            .catch((error) => {
                window.alert(error);
            })

    }
    return (
        user 
            ?   <Form onSubmit={(e) => handleFormSubmit(e, formData)}>
                    <Label>
                        Title
                        <Input 
                            type="text" 
                            required
                            value={formData.name}
                            onChange={(e) => handleChange("name", e.target.value)} 
                        />
                    </Label>
                    
                    <Categories formData={formData} setFormData={setFormData} />
                    <Label>
                        Description
                        <Description 
                            rows="7" 
                            required
                            value={formData.description}
                            onChange={(e) => handleChange("description", e.target.value)} 
                        />
                    </Label>
                    <PicsUpload 
                        formData={formData}
                        setFormData={setFormData}
                    />
                    <Label>
                        Address
                        <Input 
                            type="text" 
                            required
                            value={formData.address}
                            onChange={(e) => handleChange("address", e.target.value)} 
                        />
                    </Label>
                    <Label>
                        Price, $
                        <Input 
                            type="number" 
                            required
                            value={formData.price}
                            onChange={(e) => handleChange("price", e.target.value)} 
                        />
                    </Label>
                    {/* if adData props was passed then it's update form */}
                    <Button type="submit" width={"200px"}>{adData ? "Update ad" : "Post ad"}</Button>
                </Form>
            : <h3>Please, log in.</h3>
    )
}
const Form = styled.form`
    width: var(--big-block-width);
    margin: 0 auto;
    padding-top: 30px;
    display: flex;
    flex-direction: column;
    padding-bottom: 30px;
`
const Label = styled.label`
    font-size: 1.5rem;
	margin: 20px 0;
`
const Input = styled.input`
    width: 100%;
    border: 1px solid var(--color-button);
    border-radius: 7px;
    display: block;
    line-height: 2rem;
    margin-top: 10px;
    font-size: 1.2rem;
`
const Description = styled.textarea`
    display: block;
    margin-top: 10px;
    width: 100%;
    border: 1px solid var(--color-button);
    border-radius: 7px;
    font-size: 1.2rem;
`


export default CreateAd;