import { Body, Controller, Delete, UseGuards, Get, Param, Patch, Post, Query, Req, Res, UsePipes, ValidationPipe, HttpStatus } from '@nestjs/common';
import { Response, Request } from 'express';
import { AuthGuard } from "@nestjs/passport";

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
        return response.status(200).send(users);
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

    @Get('/auth/google')
    @UseGuards(AuthGuard("google"))
    async googleLogin(): Promise<any> {
        return HttpStatus.OK;
    }

    @Get("/auth/google/redirect")
    @UseGuards(AuthGuard("google"))
    async googleLoginRedirect(@Req() req: Request): Promise<any> {
        return this.usersService.loginWithGoogle(req);
    }


    @Get('/auth/apple')
    @UseGuards(AuthGuard("apple"))
    async appleLogin(): Promise<any> {
        return HttpStatus.OK;
    }

    @Get("/auth/apple/redirect")
    @UseGuards(AuthGuard("apple"))
    async appleLoginRedirect(@Req() req: Request): Promise<any> {
        return {
            statusCode: HttpStatus.OK,
            data: req.user,
        };
    }

    @Get("/auth/facebook")
    @UseGuards(AuthGuard("facebook"))
    async facebookLogin(): Promise<any> {
        return HttpStatus.OK;
    }

    @Get("/auth/facebook/redirect")
    @UseGuards(AuthGuard("facebook"))
    async facebookLoginRedirect(@Req() req: Request): Promise<any> {
        return {
            statusCode: HttpStatus.OK,
            data: req.user,
        };
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
