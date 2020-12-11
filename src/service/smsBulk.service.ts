import axios from "axios";
let API = null;

const url = "https://sms.360.my/gw/bulk360";

API = axios.create({
    baseURL: url,
});

const sendVerificationSMS = async (mobile, code) => {
    try {

        const result = await API.get(`/v1.4?user=ezekielmichaelace@gmail.com&pass=deskhelp1234&type=0&to=${mobile}&from=JomOrder&text=JomOrder: Your Verification Code ${code}&servid=Bulk360`)
        console.log(result.data);

    } catch (e) {
        console.error(e);
    }
}

export default {
    sendVerificationSMS,
}