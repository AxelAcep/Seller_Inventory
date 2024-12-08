const amqp = require('amqplib');

async function receiveOrderNotifications() {
  try {
    //const connection = await amqp.connect('amqp://172.17.0.3:5672');
    const connection = await amqp.connect('amqp://localhost'); 
    const channel = await connection.createChannel();

    const queue = 'order_notifications';
    await channel.assertQueue(queue, { durable: true });

    console.log('Waiting for order notifications...');

    channel.consume(queue, (msg) => {
      if (msg !== null) {
        const order = JSON.parse(msg.content.toString());
        console.log('Received order notification:', order);

        // Proses notifikasi, misalnya: simpan di database, kirim email, dll.

        channel.ack(msg); // Tandai pesan sebagai diproses
      }
    });
  } catch (error) {
    console.error('Failed to receive notifications:', error);
  }
}

const sendOrderNotification = async (messageOrder) => {
  const queue = 'confirm_notifications';
  const connection = await amqp.connect('amqp://localhost'); 
  //const connection = await amqp.connect('amqp://172.17.0.3:5672');
  const channel = await connection.createChannel();

  await channel.assertQueue(queue, {
    durable: true,
  });

  // Konversi pesan menjadi string sebelum dikirim
  const messageString = JSON.stringify(messageOrder);

  channel.sendToQueue(queue, Buffer.from(messageString)); // Kirim pesan
  console.log('Order notification sent:', messageString);

  await channel.close();
  await connection.close();
};

module.exports = {receiveOrderNotifications, sendOrderNotification};