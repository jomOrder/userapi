import axios from "axios";
let API = null;

const url = "https://sms.360.my/gw/bulk360";

API = axios.create({
    baseURL: url,
});

export const sendVerificationSMS = async (mobile, code) => {
    try {

        const result = await API.get(`/v1.4?user=projexelplaystore@gmail.com&pass=Suren3117&type=0&to=${mobile}&from=JomOrder&text=JomOrder: Your Verification Code is: ${code}&servid=Bulk360`)
        console.log(result.data);

    } catch (e) {
        console.error(e);
    }
}