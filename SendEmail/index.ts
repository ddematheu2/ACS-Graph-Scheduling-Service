import { EmailClient } from "@azure/communication-email";
import { AzureFunction, Context, HttpRequest } from "@azure/functions"

// This code retrieves your connection string
// from an environment variable.
const connectionString = process.env.ACS_CONNECTION_STRING;

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {

    let email = req.query.email;
    let url =  req.query.url;

    var client = new EmailClient(connectionString);
    //send mail
    const emailMessage = {
        sender: process.env.FROM_EMAIL,
        content: {
        subject: "Appointment remainder",
        plainText: "Join your scheduled appointment here: " + url,
        },
        recipients: {
        to: [
            {
            email,
            },
        ],
        },
    };
    var response = await client.send(emailMessage);

    context.res = {
        // status: 200, /* Defaults to 200 */
        body: response
    };

};

export default httpTrigger;