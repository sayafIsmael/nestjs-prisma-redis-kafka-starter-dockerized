import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { Kafka, Producer, Consumer } from 'kafkajs';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class KafkaService implements OnModuleInit, OnModuleDestroy {
    private kafka: Kafka;
    private producer: Producer;
    private consumer: Consumer;

    constructor(
        private configService: ConfigService
    ) {
        this.kafka = new Kafka({
            clientId: this.configService.get<string>('KAFKA_CLIENT_ID'),
            brokers: ['localhost:9092'],
            retry: {
                retries: 10,
                initialRetryTime: 100,
            },
        });
        this.producer = this.kafka.producer({});
        this.consumer = this.kafka.consumer({
            groupId: 'nest-kafka-group',
        });
    }

    async onModuleInit() {
        // Connect producer and consumer
        await this.producer.connect();
        await this.consumer.connect();
        console.log('Kafka connected');
    }

    async onModuleDestroy() {
        // Disconnect producer and consumer
        await this.producer.disconnect();
        await this.consumer.disconnect();
    }

    // Send a message to a Kafka topic
    async sendMessage(topic: string, message: any) {
        await this.producer.send({
            topic,
            messages: [{ value: JSON.stringify(message) }],
        });
        console.log(`Message sent to topic "${topic}":`, message);
    }

    // Subscribe to a Kafka topic
    async subscribe(topic: string, onMessage: (message: any) => void) {
        await this.consumer.subscribe({ topic, fromBeginning: true });
        await this.consumer.run({
            eachMessage: async ({ message }) => {
                const value = message.value?.toString();
                onMessage(value ? JSON.parse(value) : null);
            },
        });
        console.log(`Subscribed to topic "${topic}"`);
    }
}
