import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, Res, UsePipes, ValidationPipe } from '@nestjs/common';
import { Response } from 'express';
import { CreateUserDto } from './dto/createUser.dto';
import { GetUserFliter } from './dto/getUserFilter.dto';
import { UserValidationPiples } from './pipes/UserValidationPiples.pipes';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
    constructor(private usersService: UsersService) { }

    @Get()
    async getUsers(@Query() userFilter: GetUserFliter, @Req() request, @Res() response) {

        // if(Object.keys(userFilter).length) 
        const users = await this.usersService.getAllUsers();

        return response.status(200).send({ users });
    }


    @Get('/:id')
    getUserById(@Param('id') id: string) {
        return this.usersService.getUserByID(id);
    }

    @Post('/auth/signup/email')
    @UsePipes(ValidationPipe)
    async registerUserWithEmail(@Body() createUserDto: CreateUserDto, @Req() req, @Res() res: Response) {
        const statusCode = await this.usersService.createUserWithEmail(createUserDto);

        if (statusCode == 302) return res.status(statusCode).send({ message: 'User Exist Already. need to register' });

        return res.status(statusCode).send({ message: 'User has created' });
    }

    @Post('/auth/phone')
    registerUserWithPhone() {

    }

    @Post('/gmail/outh2')
    registerUserWithGoogle() {

    }

    @Post('/auth/apple')
    registerUserWithApple() {

    }

    @Post('/auth/facebook')
    registerUserWithFacebook() {

    }

    @Post('/verify/code')
    verifyUserPhone() {

    }

    @Delete('/:id')
    removeUser(@Param('id') id: string) {
        return this.usersService.removeUser(id);
    }

    @Patch('/:id')
    updateUserInfo(
        @Body('isVerified', UserValidationPiples)
        @Param('id') id: string) {
        return this.usersService.updateUser(id);
    }

}
