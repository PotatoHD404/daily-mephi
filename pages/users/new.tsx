import React, {FormEvent} from "react";
import SEO from "components/seo";

interface FormParams {
    target: { first: { value: any; }; last: { value: any; }; };
}

type HandleSubmitParams = FormEvent<HTMLFormElement> & FormParams;

function NewUser() {
    const handleSubmit = async (event: HandleSubmitParams) => {
        // Stop the form from submitting and refreshing the page.
        event.preventDefault()

        // Get data from the form.
        const data = {
            first: event.target.first.value,
            last: event.target.last.value,
        }

        // Send the data to the server in JSON format.
        const JSONdata = JSON.stringify(data)

        // API endpoint where we send form data.
        const endpoint = '/api/form'

        // Form the request for sending data to the server.
        const options = {
            // The method is POST because we are sending data.
            method: 'POST',
            // Tell the server we're sending JSON.
            headers: {
                'Content-Type': 'application/json',
            },
            // Body of the request is the JSON data we created above.
            body: JSONdata,
        }

        // Send the form data to our forms API on Vercel and get a response.
        const response = await fetch(endpoint, options)

        // Get the response data from server as JSON.
        // If server returns the name submitted, that means the form works.
        const result: any = await response.json()
        alert(`Is this your full name: ${result.data}`)
    }
    return (
        <>
            <SEO title={'Заполните профиль'}/>
            <div className="flex-wrap w-full">
                <h1 className="">Заполните профиль</h1>
                <form onSubmit={handleSubmit}>
                    <label htmlFor="first">First Name</label>
                    <input type="text" id="first" name="first" required/>

                    <label htmlFor="last">Last Name</label>
                    <input type="text" id="last" name="last" required/>

                    <button type="submit">Submit</button>
                </form>
            </div>
        </>
    );

}

export default NewUser;
