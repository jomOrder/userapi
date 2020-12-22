import * as Mailgun from 'mailgun-js'
import * as moment from 'moment-timezone';

const DOMAIN = 'mg.jomorder.com.my';
const mg = new Mailgun({ apiKey: 'ce97334a16f8c6f459246799e54e88a5-915161b7-e8fab4ab', domain: DOMAIN })



export const sendUserWelcomeMessage = (email: string): void => {
    const data = {
        from: 'JomOrder <no-reply@jomorder.com.my>',
        to: email,
        subject: 'Welcome To JomOrder',
        template: 'template.welcome',
        'h:X-Mailgun-Variables': JSON.stringify({
            title: "",
        })
    };
    mg.messages().send(data, function (error, body) {
        console.log(body);
    });
}

export const sendUserEmailVerification = (email: string, verification_link: string): void => {
    const data = {
        from: 'JomOrder <no-reply@jomorder.com.my>',
        to: email,
        subject: 'JomOrder Verification Email',
        template: 'template.verification',
        'h:X-Mailgun-Variables': JSON.stringify({
            link_domain: verification_link,
        })
    };
    mg.messages().send(data, function (error, body) {
        console.log(body)
    });

}

export const sendTransactionEmail = (email: string, transaction: any): any => {
    let day = new Date()
    let dayWrapper = moment(day);
    let dayString = dayWrapper.format("YYYY MMM D H:mm:ss");

    const data = {
        from: 'JomOrder <no-reply@jomorder.com.my>',
        to: email,
        subject: 'Your JomOrder E-Receipt',
        template: 'template.transaction',
        'h:X-Mailgun-Variables': JSON.stringify({
            date: dayString,
            data: transaction
        })
    };
    mg.messages().send(data, function (error, body) {
        console.log(body)
    });
}