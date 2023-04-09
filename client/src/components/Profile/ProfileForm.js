import styled from "styled-components";
import { useState } from "react";

import Button from "../shared/Button";

const ProfileForm = ({user, showProfileForm, setShowProfileForm}) => {
    const {fname, lname, email, _id} = user;
    const [formData, setFormData] = useState({fname, lname, email});

    const handleChange = (key, value) => {
        setFormData({
            ...formData,
            [key]: value
        })
    }

    const handleUpdateProfile = (e, formData) => {
        e.preventDefault();
        console.log("formdata: ", {...formData, _id});
        fetch(`/api/users`, {
            method: "PATCH",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                _id,
                ...formData
            })
        })
            .then(res => res.json())
            .then(data => {
                if (data.status === 200) {
                    window.alert(data.message);
                    setShowProfileForm(false);
                } else {
                    window.alert(data.message)
                }
            })
            .catch((error) => {
                window.alert(error);
            })
    }

    return (
        <Form className={showProfileForm ? "show" : null} onSubmit={(e) => handleUpdateProfile(e, formData)}>
            <Label>
                First name
                <Input 
                    type="text" 
                    required
                    onChange={(e) => handleChange("fname", e.target.value)}
                    value={formData.fname}
                />
            </Label>
            <Label>
                Last name
                <Input 
                    type="text" 
                    required
                    onChange={(e) => handleChange("lname", e.target.value)}
                    value={formData.lname}
                />
            </Label>
            <Label>
                Email
                <Input 
                    type="text" 
                    required
                    onChange={(e) => handleChange("email", e.target.value)}
                    value={formData.email}
                />
            </Label>
            <Button type="submit" width={"200px"}>Save changes</Button>
        </Form>
    )
}

const Form = styled.form`
    display: none;
    &.show {
        width: 100%;
        margin: 0 auto;
        padding-top: 30px;
        display: flex;
        flex-direction: column;
        padding-bottom: 30px;
    }
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

export default ProfileForm;