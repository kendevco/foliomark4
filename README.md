# foliomark4

It is now the publicly available source for [folio.kendev.co](https://folio.kendev.co), my folio website. Powered by Payload CMS 3.0 Beta .53.
Includes interesting pattern for separating components into server and client components. Mail functionality still doesn't work and 
storage-s3 provider was working but stopped with no configuration or other changes. 

Project includes smart seed function to seed the database with my data. You can change the seed data to reflect your skills and experiences etc.

## Development

To spin up the project locally, follow these steps:

1. **Clone the repo:**
   ```
   git clone https://github.com/kendevco/foliomark4.git
   ```

2. **Navigate to the project directory and copy the environment variables file:**
   ```
   cd foliomark4 && cp .env.example .env
   ```

3. **Configure the .env file:**
   Open the `.env` file in a text editor and add the following content:

   ```plaintext
   DATABASE_URI=postgres://<username>:<password>@<host>:<port>/<database>
   PAYLOAD_SECRET=<your_payload_secret>

   RESEND_API_KEY=<your_resend_api_key>
   EMAIL_ADDRESS_FROM=your.mail@gmail.com

   VAPI_PUBLIC_KEY=<your_vapi_public_key>
   VAPI_AGENT_ID=<your_vapi_agent_id>
   RESET_MEDIA_FIELDS=false

   PAYLOAD_PUBLIC_CLOUD_STORAGE_ADAPTER=s3

   S3_BUCKET_NAME=<your_s3_bucket_name>
   S3_ACCESS_KEY=<your_s3_access_key>
   S3_SECRET_KEY=<your_s3_secret_key>
   S3_ENDPOINT=<your_s3_endpoint>
   S3_REGION=us-east-1

   PAYLOAD_SEED=false
   ```

   Replace the placeholder values (`<your_payload_secret>`, `<your_resend_api_key>`, etc.) with your actual credentials. For more information on obtaining these keys, visit the respective vendor websites:
   - [Resend API](https://resend.io)
   - [VAPI](https://vapi.com)
   - [Supabase S3](https://supabase.com)

4. **Install dependencies and start the development server:**
   ```
   yarn && yarn dev
   ```
   or
   ```
   docker-compose up
   ```
   (see [Docker](#docker) for more details)

5. **Access the admin panel:**
   Open [http://localhost:3000/admin](http://localhost:3000/admin) to access the admin panel and create your first admin user using the form on the page.

That's it! Changes made in `./src` will be reflected in your app.

### Docker

Alternatively, you can use [Docker](https://www.docker.com) to spin up this project locally. To do so, follow these steps:

1. Follow [steps 1 and 2 from above](#development), the docker-compose file will automatically use the `.env` file in your project root.
2. Next run `docker-compose up`.
3. Follow [steps 4 and 5 from above](#development) to login and create your first admin user.

That's it! The Docker instance will help you get up and running quickly while also standardizing the development environment across your teams.

## Production

To run Payload in production, you need to build and serve the Admin panel. To do so, follow these steps:

1. **Build the project:**
   ```
   yarn build
   ```
   or
   ```
   npm run build
   ```
   This creates a `./build` directory with a production-ready admin bundle.

2. **Serve the project:**
   ```
   yarn serve
   ```
   or
   ```
   npm run serve
   ```
   This will run Node in production and serve Payload from the `./build` directory.

### Deployment

The easiest way to deploy your project is to use [Payload Cloud](https://payloadcms.com/new/import), a one-click hosting solution to deploy production-ready instances of your Payload apps directly from your GitHub repo. You can also deploy your app manually, check out the [deployment documentation](https://payloadcms.com/docs/production/deployment) for full details.

## Questions

If you have any issues or questions, reach out to us on [Discord](https://discord.com/invite/payload) or start a [GitHub discussion](https://github.com/payloadcms/payload/discussions).
