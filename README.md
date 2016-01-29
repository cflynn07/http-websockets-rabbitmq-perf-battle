http-websockets-rabbitmq-perf-battle
====================================

A fairly unscientific project to benchmark the throughput performance of inter-service communication using HTTP, web sockets, and RabbitMQ.

![RabbitMQ Test Diagram](https://raw.githubusercontent.com/cflynn07/http-websockets-rabbitmq-perf-battle/master/RabbitMQ_Test_Diagram.jpg)

#### 
```bash
$ node ./src/rabbitmq-server.js
$ node ./src/rabbitmq-client.js
```

Benchmarks
----------
Id | Facilitator | Environment | Payload Size | Persistent | RTT (avg. 5000x)
---|-------------|-------------|--------------|------------|-----------------
1  | RabbitMQ    | local       | 1kb          | No         | 2.2074 ms
2  | RabbitMQ    | local       | 1kb          | Yes        | 
3  | RabbitMQ    | EC2         | 1kb          | No         |
4  | RabbitMQ    | EC2         | 1kb          | Yes        | 
5  | HTTP        | local       | 1kb          | *N/A*      | 
6  | HTTP        | EC2         | 1kb          | *N/A*      | 
7  | Web Sockets | local       | 1kb          | *N/A*      | 
8  | Web Sockets | EC2         | 1kb          | *N/A*      | 
