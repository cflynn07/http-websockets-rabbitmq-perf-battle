http-websockets-rabbitmq-perf-battle
====================================

A fairly unscientific project to benchmark the throughput performance of inter-service communication using HTTP, web sockets, and RabbitMQ.

![RabbitMQ Test Diagram](https://raw.githubusercontent.com/cflynn07/http-websockets-rabbitmq-perf-battle/master/RabbitMQ_Test_Diagram.jpg)

- All tests use RabbitMQ v3.5.0 (non-clustered)
- AWS EC2 tests use Amazon Linux

Benchmarks
----------
Id | Facilitator | Environment | Payload Size | Persistent | RTT t2.micro | RTT m4.xlarge
---|-------------|-------------|--------------|------------|--------------|--------------
1  | RabbitMQ    | local       | 1kb          | No         | 0.7670 ms    | *N/A*
2  | RabbitMQ    | local       | 1kb          | Yes        | 0.8266 ms    | *N/A*
3  | RabbitMQ    | EC2         | 1kb          | No         | 1.7604 ms    | 0.8530 ms
4  | RabbitMQ    | EC2         | 1kb          | Yes        | 1.8120 ms    | 0.8692 ms
5  | RabbitMQ    | EC2         | 100kb        | No         | 7.2426 ms    | 3.0590 ms
6  | RabbitMQ    | EC2         | 100kb        | Yes        | 7.3300 ms    | 3.0374 ms
7  | RabbitMQ    | EC2         | 500kb        | No         | 28.0066 ms   | 10.2910 ms
8  | RabbitMQ    | EC2         | 500kb        | Yes        | 28.0038 ms   | 10.2900 ms
9  | RabbitMQ    | EC2         | 1000kb       | No         |              | 21.3096 ms
10 | RabbitMQ    | EC2         | 1000kb       | Yes        |              | 21.3126 ms
11 | HTTP        | local       | 1kb          | *N/A*      |              | 0.9554 ms
12 | HTTP        | EC2         | 1kb          | *N/A*      |              | 4.983 ms
13 | HTTP        | EC2         | 100kb        | *N/A*      |              | 3.076 ms
14 | HTTP        | EC2         | 500kb        | *N/A*      |              | 12.5326 ms
15 | HTTP        | EC2         | 1000kb       | *N/A*      |              | 24.969 ms
16 | Web Sockets | local       | 1kb          | *N/A*      | 1.3002 ms    | *N/A*
17 | Web Sockets | EC2         | 1kb          | *N/A*      |              | 1.5238 ms
18 | Web Sockets | EC2         | 100kb        | *N/A*      |              | 5.9674 ms
19 | Web Sockets | EC2         | 500kb        | *N/A*      |              | 25.1116 ms
20 | Web Sockets | EC2         | 1000kb       | *N/A*      |              | 48.1444 ms

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

#### 3 - RabbitMQ, EC2 (t2.micro & m4.xlarge), non-persistent
```bash
# Separate EC2 hosts
$ PB_RABBITMQ_DELIVERY_MODE=1 PB_RABBITMQ_USERNAME=example-user PB_RABBITMQ_PASSWORD=example-password PB_RABBITMQ_HOST=ip-***-***-***-***.us-west-2.compute.internal /usr/local/n/versions/node/5.4.1/bin/node src/rabbitmq-server.js
$ PB_RABBITMQ_DELIVERY_MODE=1 PB_RABBITMQ_USERNAME=example-user PB_RABBITMQ_PASSWORD=example-password PB_RABBITMQ_HOST=ip-***-***-***-***.us-west-2.compute.internal /usr/local/n/versions/node/5.4.1/bin/node src/rabbitmq-client.js
```

#### 4 - RabbitMQ, EC2 (t2.micro & m4.xlarge), persistent
```bash
# Separate EC2 hosts
$ PB_RABBITMQ_DELIVERY_MODE=2 PB_RABBITMQ_USERNAME=example-user PB_RABBITMQ_PASSWORD=example-password PB_RABBITMQ_HOST=ip-***-***-***-***.us-west-2.compute.internal /usr/local/n/versions/node/5.4.1/bin/node src/rabbitmq-server.js
$ PB_RABBITMQ_DELIVERY_MODE=2 PB_RABBITMQ_USERNAME=example-user PB_RABBITMQ_PASSWORD=example-password PB_RABBITMQ_HOST=ip-***-***-***-***.us-west-2.compute.internal /usr/local/n/versions/node/5.4.1/bin/node src/rabbitmq-client.js
```

#### 5 - RabbitMQ, EC2 (t2.micro & m4.xlarge), non-persistent, 100kb payload
```bash
# Separate EC2 hosts
$ PB_PAYLOAD_BYTES=102400 PB_RABBITMQ_DELIVERY_MODE=1 PB_RABBITMQ_USERNAME=example-user PB_RABBITMQ_PASSWORD=example-password PB_RABBITMQ_HOST=ip-***-***-***-***.us-west-2.compute.internal /usr/local/n/versions/node/5.4.1/bin/node src/rabbitmq-server.js
$ PB_PAYLOAD_BYTES=102400 PB_RABBITMQ_DELIVERY_MODE=1 PB_RABBITMQ_USERNAME=example-user PB_RABBITMQ_PASSWORD=example-password PB_RABBITMQ_HOST=ip-***-***-***-***.us-west-2.compute.internal /usr/local/n/versions/node/5.4.1/bin/node src/rabbitmq-client.js
```

#### 6 - RabbitMQ, EC2 (t2.micro & m4.xlarge), persistent, 100kb payload
```bash
# Separate EC2 hosts
$ PB_PAYLOAD_BYTES=102400 PB_RABBITMQ_DELIVERY_MODE=2 PB_RABBITMQ_USERNAME=example-user PB_RABBITMQ_PASSWORD=example-password PB_RABBITMQ_HOST=ip-***-***-***-***.us-west-2.compute.internal /usr/local/n/versions/node/5.4.1/bin/node src/rabbitmq-server.js
$ PB_PAYLOAD_BYTES=102400 PB_RABBITMQ_DELIVERY_MODE=2 PB_RABBITMQ_USERNAME=example-user PB_RABBITMQ_PASSWORD=example-password PB_RABBITMQ_HOST=ip-***-***-***-***.us-west-2.compute.internal /usr/local/n/versions/node/5.4.1/bin/node src/rabbitmq-client.js
```

#### 7 - RabbitMQ, EC2 (t2.micro & m4.xlarge), non-persistent, 500kb payload
```bash
# Separate EC2 hosts
$ PB_PAYLOAD_BYTES=512000 PB_RABBITMQ_DELIVERY_MODE=1 PB_RABBITMQ_USERNAME=example-user PB_RABBITMQ_PASSWORD=example-password PB_RABBITMQ_HOST=ip-***-***-***-***.us-west-2.compute.internal /usr/local/n/versions/node/5.4.1/bin/node src/rabbitmq-server.js
$ PB_PAYLOAD_BYTES=512000 PB_RABBITMQ_DELIVERY_MODE=1 PB_RABBITMQ_USERNAME=example-user PB_RABBITMQ_PASSWORD=example-password PB_RABBITMQ_HOST=ip-***-***-***-***.us-west-2.compute.internal /usr/local/n/versions/node/5.4.1/bin/node src/rabbitmq-client.js
```

#### 8 - RabbitMQ, EC2 (t2.micro & m4.xlarge), persistent, 500kb payload
```bash
# Separate EC2 hosts
$ PB_PAYLOAD_BYTES=512000 PB_RABBITMQ_DELIVERY_MODE=2 PB_RABBITMQ_USERNAME=example-user PB_RABBITMQ_PASSWORD=example-password PB_RABBITMQ_HOST=ip-***-***-***-***.us-west-2.compute.internal /usr/local/n/versions/node/5.4.1/bin/node src/rabbitmq-server.js
$ PB_PAYLOAD_BYTES=512000 PB_RABBITMQ_DELIVERY_MODE=2 PB_RABBITMQ_USERNAME=example-user PB_RABBITMQ_PASSWORD=example-password PB_RABBITMQ_HOST=ip-***-***-***-***.us-west-2.compute.internal /usr/local/n/versions/node/5.4.1/bin/node src/rabbitmq-client.js
```

#### 12 - HTTP, EC2 (t2.micro & m4.xlarge), 1kb payload
```bash
$ PB_SERVER_PORT=3000 node src/http-server.js
$ PB_SERVER_PORT=3000 PB_SERVER_HOST=ip-***-***-***-***.us-west-2.compute.internal node src/http-client.js
```

#### 13 - HTTP, EC2 (t2.micro & m4.xlarge), 100kb payload
```bash
$ PB_SERVER_PORT=3000 node src/http-server.js
$ PB_PAYLOAD_BYTES=102400 PB_SERVER_PORT=3000 PB_SERVER_HOST=ip-***-***-***-***.us-west-2.compute.internal node src/http-client.js
```

#### 14 - HTTP, EC2 (t2.micro & m4.xlarge), 500kb payload
```bash
$ PB_SERVER_PORT=3000 node src/http-server.js
$ PB_PAYLOAD_BYTES=512000 PB_SERVER_PORT=3000 PB_SERVER_HOST=ip-***-***-***-***.us-west-2.compute.internal node src/http-client.js
```

#### 15 - HTTP, EC2 (t2.micro & m4.xlarge), 1000kb payload
```bash
$ PB_SERVER_PORT=3000 node src/http-server.js
$ PB_PAYLOAD_BYTES=1024000 PB_SERVER_PORT=3000 PB_SERVER_HOST=ip-***-***-***-***.us-west-2.compute.internal node src/http-client.js
```

#### 17 - Web Sockets, EC2 (t2.micro & m4.xlarge), 1kb payload
```bash
$ PB_SERVER_PORT=3000 node src/websocket-server.js
$ PB_SERVER_HOST=ip-***-***-***-***.us-west-2.compute.internal PB_SERVER_PORT=3000 node src/websocket-client.js
```
#### 18 - Web Sockets, EC2 (t2.micro & m4.xlarge), 100kb payload
```bash
$ PB_SERVER_PORT=3000 node src/websocket-server.js
$ PB_PAYLOAD_BYTES=102400 PB_SERVER_HOST=ip-***-***-***-***.us-west-2.compute.internal PB_SERVER_PORT=3000 node src/websocket-client.js
```
#### 19 - Web Sockets, EC2 (t2.micro & m4.xlarge), 500kb payload
```bash
$ PB_SERVER_PORT=3000 node src/websocket-server.js
$ PB_PAYLOAD_BYTES=512000 PB_SERVER_HOST=ip-***-***-***-***.us-west-2.compute.internal PB_SERVER_PORT=3000 node src/websocket-client.js
```
#### 20 - Web Sockets, EC2 (t2.micro & m4.xlarge), 1000kb payload
```bash
$ PB_SERVER_PORT=3000 node src/websocket-server.js
$ PB_PAYLOAD_BYTES=1024000 PB_SERVER_HOST=ip-***-***-***-***.us-west-2.compute.internal PB_SERVER_PORT=3000 node src/websocket-client.js
```
