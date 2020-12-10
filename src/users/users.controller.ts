import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateUserDto } from './dto/createUser.dto';

@Controller('customers')
export class UsersController {

    @Get()
    getAllUsers() {

    }

    @Post()
    registerUserWithEmail(@Body() createUserDto: CreateUserDto) {
        
    }

    @Post()
    registerUserWithPhone() {

    }

    @Post()
    registerUserWithGoogle() {

    }

    @Post()
    registerUserWithApple() {

    }

    @Post()
    registerUserWithFacebook() {

    }

    @Post()
    verifyUserPhone() {

    }
    
}
