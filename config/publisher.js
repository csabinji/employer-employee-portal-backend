const amqp = require('amqplib');
const { Employee } = require('../models');
const { RABBITMQ_HOST, RABBITMQ_PORT, RABBITMQ_USER, RABBITMQ_PASSWORD } = require('./env');

const getUrl = async () => {
    let host = RABBITMQ_HOST || 'localhost';
    let port = RABBITMQ_PORT || 5672;
    let user = RABBITMQ_USER || 'guest';
    let password = RABBITMQ_PASSWORD || 'guest';
    return `amqp://${user}:${password}@${host}:${port}`;
}

// Connect to the RabbitMQ server
async function sendMessage(message) {
    try {
        let url = await getUrl();
        const connection = await amqp.connect(url);
        const channel = await connection.createChannel();
        const queue = 'messages';
        await channel.assertQueue(queue, { durable: true });
        const messageJson = JSON.stringify(message);
        await channel.sendToQueue(queue, Buffer.from(messageJson));
        console.log('Sent message to queue');
        await receiveMessage();
    } catch (error) {
        throw error;
    }
}

async function receiveMessage() {
    try {
        let url = await getUrl();
        const connection = await amqp.connect(url);
        const channel = await connection.createChannel();
        const queue = 'messages';
        await channel.assertQueue(queue, { durable: true });
        console.log(`Waiting for messages in queue: ${queue}`);
        channel.consume(queue, async (message) => {
            if (message !== null) {
                const messageData = JSON.parse(message.content.toString());
                const userWithSameEmail = await Employee.findOne({ email: messageData['email'] });
                if (!userWithSameEmail) await Employee.create(messageData);
                channel.ack(message);
            }
        });
    } catch (error) {
        throw error;
    }
}

module.exports = {
    sendMessage,
    receiveMessage
};
