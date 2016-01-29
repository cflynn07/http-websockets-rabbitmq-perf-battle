http-websockets-rabbitmq-perf-battle
====================================

A fairly unscientific project to benchmark the throughput performance of inter-service communication using HTTP, web sockets, and RabbitMQ.

![RabbitMQ Test Diagram](https://raw.githubusercontent.com/cflynn07/http-websockets-rabbitmq-perf-battle/master/RabbitMQ_Test_Diagram.jpg)

TODO
----
Facilitator | Environment                                             | Payload Size | Persistent | RTT
------------|---------------------------------------------------------|--------------|------------|----
RabbitMQ    | local (producer/consumer same host)                     | 1kb          | No         | 
RabbitMQ    | local (producer/consumer same host)                     | 1kb          | Yes        | 
RabbitMQ    | EC2 (producer/consumer separate EC2 servers  N. VA)     | 1kb          | No         | 
RabbitMQ    | EC2 (producer/consumer separate EC2 servers  N. VA)     | 1kb          | Yes        | 
HTTP        | local (producer/consumer same host)                     | 1kb          | *N/A*      | 
HTTP        | EC2 (producer/consumer separate EC2 servers  N. VA)     | 1kb          | *N/A*      | 
Web Sockets | local (producer/consumer same host)                     | 1kb          | *N/A*      | 
Web Sockets | EC2 (producer/consumer separate EC2 servers  N. VA)     | 1kb          | *N/A*      | 
