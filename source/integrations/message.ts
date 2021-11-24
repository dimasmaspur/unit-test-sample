import config from '../configs/config';
import axios from 'axios';

class MessageIntegration {
    private appServerUrl: any;

    constructor() {
        this.appServerUrl = {
            publish: `${config.arvisAppBaseUrl}api/web/v0/mq/publish`
        };
    }

    public publishMessage = (params: any): any => {
        return new Promise(async (resolve, reject) => {
            try {
                let response = await axios.post(this.appServerUrl.publish, params, {
                    headers: {
                        'x-api-key': config.mainAppApiKey
                    }
                });
                resolve(response.data);
            } catch (error) {
                reject(error);
            }
        });
    };
}

export default new MessageIntegration();
