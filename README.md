http-websockets-rabbitmq-perf-battle
====================================

A fairly unscientific project to benchmark the throughput performance of inter-service communication using HTTP, web sockets, and RabbitMQ.

![RabbitMQ Test Diagram](https://raw.githubusercontent.com/cflynn07/http-websockets-rabbitmq-perf-battle/master/RabbitMQ_Test_Diagram.jpg)

- All tests use RabbitMQ v3.5.0
- AWS EC2 tests use Amazon Linux

Setup Notes
-----------
#### Install RabbitMQ on Amazon Linux
```bash
$ sudo yum install erlang --enablerepo=epel
$ wget http://www.rabbitmq.com/releases/rabbitmq-server/v3.5.0/rabbitmq-server-3.5.0-1.noarch.rpm
$ sudo rpm -Uvh rabbitmq-server-3.1.1-1.noarch.rpm
$ sudo rabbitmq-plugins enable rabbitmq_management
$ rabbitmqctl add_user example-user example-password
$ rabbitmqctl set_user_tags example-user administrator
$ rabbitmqctl set_permissions -p / example-user ".*" ".*" ".*"
```

#### Install Node.js on Amazon Linux
```bash
$ sudo yum install nodejs npm --enablerepo=epel
$ sudo yum install git
$ sudo npm install n -g
$ sudo n install v5.4.1
$ git clone https://github.com/cflynn07/http-websockets-rabbitmq-perf-battle.git
$ cd http-websockets-rabbitmq-perf-battle
$ /usr/local/n/versions/node/5.4.1/bin/npm install . # n does not automatically set symlink on Amazon Linux
```

Test Notes
----------
#### 1 - RabbitMQ, local, non-persistent
```bash
# Same host
$ PB_RABBITMQ_DELIVERY_MODE=1 node ./src/rabbitmq-server.js
$ PB_RABBITMQ_DELIVERY_MODE=1 node ./src/rabbitmq-client.js
```

#### 2 - RabbitMQ, local, persistent
```bash
# Same host
$ PB_RABBITMQ_DELIVERY_MODE=2 node ./src/rabbitmq-server.js
$ PB_RABBITMQ_DELIVERY_MODE=2 node ./src/rabbitmq-client.js
```

#### 3 - RabbitMQ, EC2 (t2.micro), non-persistent
```bash
# Separate EC2 hosts
$ PB_RABBITMQ_DELIVERY_MODE=1 PB_RABBITMQ_USERNAME=example-user PB_RABBITMQ_PASSWORD=example-password PB_RABBITMQ_HOST=ip-***-***-***-***.us-west-2.compute.internal /usr/local/n/versions/node/5.4.1/bin/node src/rabbitmq-server.js
$ PB_RABBITMQ_DELIVERY_MODE=1 PB_RABBITMQ_USERNAME=example-user PB_RABBITMQ_PASSWORD=example-password PB_RABBITMQ_HOST=ip-***-***-***-***.us-west-2.compute.internal /usr/local/n/versions/node/5.4.1/bin/node src/rabbitmq-client.js
```

#### 4 - RabbitMQ, EC2 (t2.micro), persistent
```bash
# Separate EC2 hosts
$ PB_RABBITMQ_DELIVERY_MODE=2 PB_RABBITMQ_USERNAME=example-user PB_RABBITMQ_PASSWORD=example-password PB_RABBITMQ_HOST=ip-***-***-***-***.us-west-2.compute.internal /usr/local/n/versions/node/5.4.1/bin/node src/rabbitmq-server.js
$ PB_RABBITMQ_DELIVERY_MODE=2 PB_RABBITMQ_USERNAME=example-user PB_RABBITMQ_PASSWORD=example-password PB_RABBITMQ_HOST=ip-***-***-***-***.us-west-2.compute.internal /usr/local/n/versions/node/5.4.1/bin/node src/rabbitmq-client.js
```

#### 5 - RabbitMQ, EC2 (t2.micro), non-persistent, 100kb payload
```bash
# Separate EC2 hosts
$ PB_PAYLOAD_BYTES=102400 PB_RABBITMQ_DELIVERY_MODE=1 PB_RABBITMQ_USERNAME=example-user PB_RABBITMQ_PASSWORD=example-password PB_RABBITMQ_HOST=ip-***-***-***-***.us-west-2.compute.internal /usr/local/n/versions/node/5.4.1/bin/node src/rabbitmq-server.js
$ PB_PAYLOAD_BYTES=102400 PB_RABBITMQ_DELIVERY_MODE=1 PB_RABBITMQ_USERNAME=example-user PB_RABBITMQ_PASSWORD=example-password PB_RABBITMQ_HOST=ip-***-***-***-***.us-west-2.compute.internal /usr/local/n/versions/node/5.4.1/bin/node src/rabbitmq-client.js
```

#### 6 - RabbitMQ, EC2 (t2.micro), persistent, 100kb payload
```bash
# Separate EC2 hosts
$ PB_PAYLOAD_BYTES=102400 PB_RABBITMQ_DELIVERY_MODE=2 PB_RABBITMQ_USERNAME=example-user PB_RABBITMQ_PASSWORD=example-password PB_RABBITMQ_HOST=ip-***-***-***-***.us-west-2.compute.internal /usr/local/n/versions/node/5.4.1/bin/node src/rabbitmq-server.js
$ PB_PAYLOAD_BYTES=102400 PB_RABBITMQ_DELIVERY_MODE=2 PB_RABBITMQ_USERNAME=example-user PB_RABBITMQ_PASSWORD=example-password PB_RABBITMQ_HOST=ip-***-***-***-***.us-west-2.compute.internal /usr/local/n/versions/node/5.4.1/bin/node src/rabbitmq-client.js
```

#### 7 - RabbitMQ, EC2 (t2.micro), non-persistent, 500kb payload
```bash
# Separate EC2 hosts
$ PB_PAYLOAD_BYTES=512000 PB_RABBITMQ_DELIVERY_MODE=1 PB_RABBITMQ_USERNAME=example-user PB_RABBITMQ_PASSWORD=example-password PB_RABBITMQ_HOST=ip-***-***-***-***.us-west-2.compute.internal /usr/local/n/versions/node/5.4.1/bin/node src/rabbitmq-server.js
$ PB_PAYLOAD_BYTES=512000 PB_RABBITMQ_DELIVERY_MODE=1 PB_RABBITMQ_USERNAME=example-user PB_RABBITMQ_PASSWORD=example-password PB_RABBITMQ_HOST=ip-***-***-***-***.us-west-2.compute.internal /usr/local/n/versions/node/5.4.1/bin/node src/rabbitmq-client.js
```

#### 8 - RabbitMQ, EC2 (t2.micro), persistent, 500kb payload
```bash
# Separate EC2 hosts
$ PB_PAYLOAD_BYTES=512000 PB_RABBITMQ_DELIVERY_MODE=2 PB_RABBITMQ_USERNAME=example-user PB_RABBITMQ_PASSWORD=example-password PB_RABBITMQ_HOST=ip-***-***-***-***.us-west-2.compute.internal /usr/local/n/versions/node/5.4.1/bin/node src/rabbitmq-server.js
$ PB_PAYLOAD_BYTES=512000 PB_RABBITMQ_DELIVERY_MODE=2 PB_RABBITMQ_USERNAME=example-user PB_RABBITMQ_PASSWORD=example-password PB_RABBITMQ_HOST=ip-***-***-***-***.us-west-2.compute.internal /usr/local/n/versions/node/5.4.1/bin/node src/rabbitmq-client.js
```

Benchmarks
----------
Id | Facilitator | Environment    | Payload Size | Persistent | RTT (avg. 5000x)
---|-------------|----------------|--------------|------------|-----------------
1  | RabbitMQ    | local          | 1kb          | No         | 0.7670 ms
2  | RabbitMQ    | local          | 1kb          | Yes        | 0.8266 ms
3  | RabbitMQ    | EC2 (t2.micro) | 1kb          | No         | 1.7604 ms
4  | RabbitMQ    | EC2 (t2.micro) | 1kb          | Yes        | 1.8120 ms
5  | RabbitMQ    | EC2 (t2.micro) | 100kb        | No         | 7.2426 ms
6  | RabbitMQ    | EC2 (t2.micro) | 100kb        | Yes        | 7.3300 ms
7  | RabbitMQ    | EC2 (t2.micro) | 500kb        | No         | 28.0066 ms
8  | RabbitMQ    | EC2 (t2.micro) | 500kb        | Yes        | 28.0038 ms
9  | RabbitMQ    | EC2 (t2.micro) | 1000kb       | No         | 
10 | RabbitMQ    | EC2 (t2.micro) | 1000kb       | Yes        | 
11 | HTTP        | local          | 1kb          | *N/A*      | 
12 | HTTP        | EC2 (t2.micro) | 1kb          | *N/A*      | 
13 | Web Sockets | local          | 1kb          | *N/A*      | 
14 | Web Sockets | EC2 (t2.micro) | 1kb          | *N/A*      | 
