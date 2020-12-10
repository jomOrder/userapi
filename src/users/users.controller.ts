import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateUserDto } from './dto/createUser.dto';
import { UsersService } from './users.service';

@Controller('customers')
export class UsersController {
    constructor(private usersService: UsersService) {}

    @Get()
    getAllUsers() {

    }

    @Post()
    registerUserWithEmail(@Body() createUserDto: CreateUserDto) {
        this.usersService.createUser(createUserDto);    
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
