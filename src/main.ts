import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const options = new DocumentBuilder()
    .setTitle("USER ROLES")
    .setDescription("My api Description")
    .setVersion("1.0")
    .addServer("http://localhost:3001")
    .addTag("My Api Tag")
    .build();  
    app.enableCors()
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup("api-docs", app, document);
  await app.listen(3001);
}
bootstrap();
