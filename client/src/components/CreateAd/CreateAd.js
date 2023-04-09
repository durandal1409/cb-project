import styled from "styled-components";
import { useState } from "react";
import { useAuth0 } from '@auth0/auth0-react';
import { useNavigate } from "react-router-dom";

import PicsUpload from "./PicsUpload";
import Categories from "./Categories";
import Button from "../shared/Button";

const CreateAd = () => {
    const { user } = useAuth0();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({pics: [], categories: ['']});

    const handleChange = (key, value) => {
        setFormData({
            ...formData,
            [key]: value
        })
    }

    const handleFormSubmit = (e, formData) => {
        e.preventDefault();
        
        // console.log("form: ", formData);
        fetch("/api/ads", {
            method: "POST",
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
                if (data.status === 201) {
                    window.alert(data.message);
                    navigate("/");
                } else {
                    window.alert(data.message)
                }
            })
            .catch((error) => {
                window.alert(error);
            })

    }
    return (
        <Form onSubmit={(e) => handleFormSubmit(e, formData)}>
            <Label>
                Title
                <Input 
                    type="text" 
                    required
                    onChange={(e) => handleChange("name", e.target.value)} 
                />
            </Label>
            
            <Categories formData={formData} setFormData={setFormData} />
            <Label>
                Description
                <Description 
                    rows="7" 
                    required
                    onChange={(e) => handleChange("description", e.target.value)} 
                />
            </Label>
            <PicsUpload 
                // images={images} 
                // setImages={setImages}
                formData={formData}
                setFormData={setFormData}
            />
            <Label>
                Address
                <Input 
                    type="text" 
                    required
                    onChange={(e) => handleChange("address", e.target.value)} 
                />
            </Label>
            <Label>
                Price, $
                <Input 
                    type="number" 
                    required
                    onChange={(e) => handleChange("price", e.target.value)} 
                />
            </Label>
            <Button type="submit" width={"200px"}>Post ad</Button>
        </Form>
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