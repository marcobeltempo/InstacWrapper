# InstacWrapper

Node Instacart API wrapper

## Functions

`constructor(email, password)` - 

`login()` - login to your Instacart account to retrieve a valid session token

`getDeliveryTimes(retailerName)` - retrieves delivery schedule for the provided retailer name

`getRetailers()` - returns a list of retailers associated with your last used address

## Examples

The `cron_job` example schedules a re-occurring task every minute to check for available delivery times

1. `cd ./instacwrapper`
2. `npm install`
3. create an .env file in the root directory: `vi .env`
4. set the `EMAIL` and `PASSWORD` environment variables using your Instacart credentials
5. `npm run example:cron`
6. observe the output


### Notes

**Canadian Retailer Name Mappings**

- Walmart = `walmart_canada`
- Loblaws = `loblaws`
- Real Canadian Superstore = `real-canadian-superstore`
- T&T Supermarket= TODO
- Staples= TODO
- Shoppers Drug Mart= TODO
- M&M Food Market= TODO
