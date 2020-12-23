import { NotFoundException, Catch, ArgumentsHost, ExceptionFilter } from '@nestjs/common';
@Catch(NotFoundException)
export class NotFoundExceptionFilter implements ExceptionFilter {
    catch(exception: NotFoundException, host: ArgumentsHost) {

        const ctx = host.switchToHttp();
        const request = ctx.getRequest();
        const response = ctx.getResponse();

        if (request.url == '/') response.send('User Auth API');
        else if (request.url == '/api') response.send('API WORKS');
        else response.send("Not Found");
    }
}