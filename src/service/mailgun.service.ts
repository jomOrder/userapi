import * as Mailgun from 'mailgun-js'

const DOMAIN = 'mg.jomorder.com.my';
const mg = new Mailgun({ apiKey: 'ce97334a16f8c6f459246799e54e88a5-915161b7-e8fab4ab', domain: DOMAIN })


export const sendUserWelcomeMessage = (email): void => {
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

export const sendUserEmailVerification = (): void => {

}

export const sendTransactionEmail = (email, transaction): any => {
    const data = {
        from: 'JomOrder <no-reply@jomorder.com.my>',
        to: email,
        subject: 'Your JomOrder E-Receipt',
        template: 'template.transaction',
        'h:X-Mailgun-Variables': JSON.stringify({
            title: "This is JomOrder",
            data: transaction
        })
    };
    mg.messages().send(data, function (error, body) {
        console.log(body)
    });
}