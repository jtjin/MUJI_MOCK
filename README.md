# MUJI MOCK

###### E-commerce Website

###### Website URL: https://white-100.online/

## Table of Contents

- [Main Features](#Main-Features)
  -- [Page](#Page)
- [Technologies](#Technologies)
- [Architecture](#Architecture)
- [Contact](#Contact)

## Main Features

- An E-commerce shopping website including catalog, shopping cart module, and third-party payment
- Built login / logout / register authentication functions
- Product upload function with 2 customized specifications
- Designed RDBMS & Normalization database structure by adding indexes.
- Connected to backend APIs using AJAX
- Built campaigns and product categorization features
- Integrated TapPay SDK (third-party payment API) for credit card payment flow
- Used MySQL as database, AWS RDS store data, AWS S3 to store product images, Mongo Db for logs, Redis for cache
- Used Artillery for Load testing
- Created load balancer, AMI for auto scaling
  Auto-Refresh dashBoard with interactive charts
- Logs system

### Page

- Public Page

  - [Product list main](https://white-100.online/)
  - [Product detail](https://white-100.online/product.html?id=201807242211)

- Need Authentication
  - [Product Create](https://white-100.online/admin/product.html)
  - [Cart](https://white-100.online/cart.html)
  - [Profile](https://white-100.online/profile.html)
  - [Admin chatroom system](https://white-100.online/admin/chatroom.html)

## Technologies

### Backend

- Node.js / Express.js
- TypeScript / JavaScript
- RESTful API
- NGINX

### Front-End

- HTML
- CSS
- JavaScript
- AJAX
- EJS

### Cloud Service (AWS)

- Compute: EC2
- Storage: S3 (images)
- Database: MySQL / AWS RDS
- Network: CloudFront, ELB
- Logs DB : Mongo DB

### Database

- MySQL (RDS)
- Redis (Cache)
- MongoDb (logs)
- Local file (logs)

### Logs System

- Different Levels, translates to data about data.
- Custom formatting with good readability
- Several Transports (console, local file, mongo)

### Tools

- Version Control: Git, GitHub
- CI / CD: Jenkins
- Test: Artillery
- Logs: Winston + morgan

## Architecture

![Architecture.png](https://i.imgur.com/kVIbucv.jpg)

## Contact

Email: t100210022002@gmail.com

> ##### 版權聲明
>
> ##### 本專案所有圖片素材均來自於無印良品官網，如有侵權敬請告知，將立即刪除
