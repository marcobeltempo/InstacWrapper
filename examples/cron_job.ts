import { CronJob } from 'cron';
import dotenv from 'dotenv';
import InstacWrapper, { Options } from '../src';

dotenv.config();

function log(message: string, isError = false) {
    const timestamp = new Date().toLocaleString();
    const formattedMessage = `${timestamp} - ${message}`;
    isError
        ? console.error(formattedMessage)
        : console.info(formattedMessage);
}

async function getRetailers(api: InstacWrapper) {
    const response = await api.getRetailers();

    const modules = response.data.modules;

    if (modules) {
        const retailers = modules.find((m: any) => m.id.startsWith('retailers_primary_selection'));
        const address = modules.find((m: any) => m.id.startsWith('retailers_header'));

        let retailerNames = '';

        retailers.data.retailers.forEach((r: any) => retailerNames += `- ${r.name}\n`);
        log(`Retailers near: ${address.data.location}\n${retailerNames}`);

    } else {
        log('retailers_primary_selection module not found', true);
    }
}


async function checkDeliveryTimes(api: InstacWrapper, store: string) {
    const res = await api.getDeliveryTimes(store);
    const modules = res.data.modules;

    if (modules) {
        const errorModule = modules.find((m: any) => m.id.startsWith('errors_no_availability'));
        const deliveryOptionsModule = modules.find((m: any) => m.id.startsWith('delivery_option_list'));

        if (errorModule) {
            log(`${errorModule.data.title} at ${res.data.title}`)
        }
        else if (deliveryOptionsModule) {
            const serviceOptions = deliveryOptionsModule.data.service_options;

            log(`There are available delivery windows!\n${JSON.stringify(serviceOptions, null, 2)}`);
        }
    } else {
        log('error occured trying to fetch delivery windows', true);
    }
}

export const run = async () => {
    try {
        const options: Options = {
            email: process.env.EMAIL!,
            password: process.env.PASSWORD!,
        }

        const api = new InstacWrapper(options);
        await api.login();

        const checkTimes = () => {
            getRetailers(api);
            checkDeliveryTimes(api, 'real-canadian-superstore');
        };

        const job = new CronJob('*/1 * * * *', checkTimes, null, false, 'America/Toronto', true);
        job.start();
    }
    catch (err) {
        log(err, true);
    }
}