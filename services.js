const schedule = require('node-schedule');
const webPush = require('web-push')

exports.scheduleNotification = (date, paylaod, subscriptions) => {

    const job = schedule.scheduleJob(date, function(){
        subscriptions.forEach(subscription => {
            webPush.sendNotification(subscription, paylaod).catch(error=>console.log(error)) 
        });
    });

}