import axios from 'axios';

const API_URL = 'http://localhost:8080/api/submit';

class MathService{
    postReq(data) {
        return axios.post(API_URL, data);
    }
}
export default new MathService();