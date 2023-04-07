import styled from "styled-components";
import { useState } from "react";
import { useAuth0 } from '@auth0/auth0-react';

import PicsUpload from "./PicsUpload";
import Categories from "./Categories";
import Button from "../shared/Button";

const CreateAd = () => {
    const { user } = useAuth0();
    const [images, setImages] = useState([]);
    const [formData, setFormData] = useState({pics: []});

    const handleChange = (key, value) => {
        setFormData({
            ...formData,
            [key]: value
        })
    }

    const handleFormSubmit = (e, formData) => {
        e.preventDefault();
        console.log("form: ", formData);
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
            
            <Categories />
            <Label>
                Description
                <Description 
                    rows="4" 
                    cols="50"
                    required
                    onChange={(e) => handleChange("description", e.target.value)} 
                />
            </Label>
            <PicsUpload 
                images={images} 
                setImages={setImages}
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
                Price
                <Input 
                    type="number" 
                    required
                    onChange={(e) => handleChange("price", e.target.value)} 
                />
            </Label>
            <Button type="submit">Post ad</Button>
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
const Label = styled.label`

`
const Input = styled.input`

`
const Description = styled.textarea`

`


export default CreateAd;