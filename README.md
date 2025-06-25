## Ecommerce Order Management

### Members:

- Muhammad Umer F2023266912
- Abdul Majid F2023266946
- Haider Ali F2023266933
- Haseeb Ullah F20232661009

To run the project, you should have Node.JS and a running Postgres Instance.

To start the Postgres Instance on GitPod or CodeSpace Run.

```bash
docker run -d -p 5432:5432 -e POSTGRES_USER=umer -e POSTGRES_PASSWORD=password postgres
docker ps
docker exec -it <container_id> bash
psql -U umer
create database ecommerce_order_management;
```

Install the Deps.

```bash
npm install
```

Copy `sample.env.local` to `.env.local`, then add the deps.

Initialize the DB

```bash
npm run seed
```

Run the Project.

```bash
npm run build
npm run start
```

To visit the app as ADMIN register as email `ugulzar4512@gmail.com`
