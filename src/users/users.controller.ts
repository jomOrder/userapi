import { Body, Controller, Delete, UseGuards, Redirect, Get, Param, Patch, Post, Query, Req, Res, UsePipes, ValidationPipe, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthGuard } from "@nestjs/passport";

import { CreateUserDto } from './dto/createUser.dto';
import { GetUserFliterDto } from './dto/getUserFilter.dto';
import { UserValidationPiples } from './pipes/UserValidationPiples.pipes';
import { UsersService } from './users.service';
import { VerifyUserPhoneDto } from './dto/verifyUserPhoneDto.dto';
@Controller('api/users')
export class UsersController {
    constructor(private usersService: UsersService) { }

    @Get()
    async getUsers(@Query() userFilter: GetUserFliterDto, @Req() request, @Res() response) {
      
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
    registerUserWithEmail(@Body() createUserDto: CreateUserDto, @Req() req, @Res() res: Response) {
        return this.usersService.createUserWithEmail(createUserDto, res);
    }

    @Get('/auth/google')
    @UseGuards(AuthGuard("google"))
    async googleLogin(): Promise<any> {
        return HttpStatus.OK;
    }

    @Get("/auth/google/redirect")
    @UseGuards(AuthGuard("google"))
    // @Redirect('https://nestjs.com', 302)
    async googleLoginRedirect(@Req() req: Request, @Res() res): Promise<any> {
        // return this.usersService.loginWithGoogle(req);
        //@ts-ignore
        return res.redirect("http://localhost:19006/?access=fsgrsgdfsgdfg");

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
        return this.usersService.loginWithFacebook(req);
    }
    
    @Post('/auth/phone')
    phoneNumberLogin(@Body() verifyUserPhone: VerifyUserPhoneDto, @Res() res: Response) {
        return this.usersService.signInWithPhoneNumber(verifyUserPhone, res);
    }

    @Post('/auth/verify/code')
    verifyUserPhone(@Body() verifyUserPhone: VerifyUserPhoneDto, @Res() res: Response) {
        return this.usersService.verifyOTPCode(verifyUserPhone, res);
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