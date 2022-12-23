import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import { SmsClient }  from "@azure/communication-sms"

// This code retrieves your connection string
// from an environment variable.
const connectionString = process.env.ACS_CONNECTION_STRING;

// Instantiate the SMS client.
const smsClient = new SmsClient(connectionString);

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    let phoneNumber = req.query.phoneNumber;
    let url =  req.query.url;

    const sendResults = await smsClient.send({
        from: process.env.FROM_NUMBER,
        to: [phoneNumber],
        message: "Join your scheduled appointment here: " + url
      }, {
        enableDeliveryReport: true
      });
    
      // Individual messages can encounter errors during sending.
      // Use the "successful" property to verify the status.
      for (const sendResult of sendResults) {
        if (sendResult.successful) {
          console.log("Success: ", sendResult);
        } else {
          console.error("Something went wrong when trying to send this message: ", sendResult);
        }
      }

    context.res = {
        // status: 200, /* Defaults to 200 */
        body: sendResults
    };

};

export default httpTrigger;