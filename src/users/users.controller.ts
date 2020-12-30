import { Body, Controller, Delete, UseGuards, Get, Param, Patch, Post, Req, Res, UsePipes, ValidationPipe, HttpStatus, Query } from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthGuard } from "@nestjs/passport";
import { CreateUserDto } from './dto/createUser.dto';
import { UserValidationPiples } from './pipes/UserValidationPiples.pipes';
import { UsersService } from './users.service';
import { VerifyUserPhoneDto } from './dto/verifyUserPhoneDto.dto';
import { EmailVerificationDto } from './dto/emailVerification.dto';
@Controller('api/users')
export class UsersController {
    constructor(private usersService: UsersService) { }

    @Get()
    getUser(@Req() req: Request) {
        return this.usersService.viewUser(req);
    }

    @Post('/auth/signup/email')
    @UsePipes(ValidationPipe)
    registerUserWithEmail(@Body() createUserDto: CreateUserDto, @Req() req, @Res() res: Response) {
        return this.usersService.createUserWithEmail(createUserDto, res);
    }

    @Post('/auth/signin/email')
    @UsePipes(ValidationPipe)
    loginUserWithEmail(@Body() createUserDto: CreateUserDto, @Req() req, @Res() res: Response) {
        return this.usersService.loginUserWithEmail(createUserDto, res);
    }

    @Get('/auth/verify/email')
    verifyUserEmail(@Query() emailVerificationDto: EmailVerificationDto, @Res() res: Response) {
        return this.usersService.emailVerification(emailVerificationDto, res);
    }

    @Get('/auth/google')
    @UseGuards(AuthGuard("google"))
    async googleLogin(): Promise<any> {
        return HttpStatus.OK;
    }

    @Get("/auth/google/redirect")
    @UseGuards(AuthGuard("google"))
    async googleLoginRedirect(@Req() req: Request, @Res() res: Response): Promise<any> {
        return this.usersService.loginWithGoogle(req, res);
    }


    @Get('/auth/apple')
    @UseGuards(AuthGuard("apple"))
    async appleLogin(): Promise<any> {
        return HttpStatus.OK;
    }

    @Post("/auth/apple/redirect")
    // @UseGuards(AuthGuard("apple"))
    async appleLoginRedirect(@Req() req: Request, @Res() res: Response): Promise<any> {
        return res.redirect(`/welcome?search=${req.user}&res=${res}`);

        // return {
        //     data2: req.user,
        //     statusCode: HttpStatus.OK,
        //     data: res,
        // };
    }

    @Get("/auth/facebook")
    @UseGuards(AuthGuard("facebook"))
    async facebookLogin(): Promise<any> {
        return HttpStatus.OK;
    }

    @Get("/auth/facebook/redirect")
    @UseGuards(AuthGuard("facebook"))
    async facebookLoginRedirect(@Req() req: Request, @Res() res: Response): Promise<any> {
        return this.usersService.loginWithFacebook(req, res);
    }
    
    @Post('/auth/phone')
    phoneNumberLogin(@Body() verifyUserPhoneDto: VerifyUserPhoneDto, @Res() res: Response) {
        return this.usersService.signInWithPhoneNumber(verifyUserPhoneDto, res);
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