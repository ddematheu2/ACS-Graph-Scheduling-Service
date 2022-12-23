import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import createNewMeetingAsync from "./graph";

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {

    console.log(req.query)

    let teamsMeetingLink = await createNewMeetingAsync(
        req.query.userId, // user to create meeting with
        req.query.startTime,
        req.query.endTime
    );

    const body = JSON.stringify(teamsMeetingLink);
    const meeting = JSON.parse(body);

    const phoneNumber = encodeURIComponent(req.query.phoneNumber);
    const url = encodeURIComponent(meeting.onlineMeeting.joinUrl);

    let smsResponse = await fetch('http://localhost:7071/api/SendSMS?phoneNumber=' + phoneNumber + '&url=' + url )
    let smsSuccess = await smsResponse.json();

    const email = encodeURIComponent(req.query.email);

    let emailResponse = await fetch('http://localhost:7071/api/SendEmail?email=' + email + '&url=' + url )
    let emailSuccess = await emailResponse.json();

    context.res = {
        // status: 200, /* Defaults to 200 */
        body: {
            joinUrl: url,
            smsSuccess,
            emailSuccess
        }
    } 

};

export default httpTrigger;